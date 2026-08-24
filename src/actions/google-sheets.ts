"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { revalidatePath } from "next/cache";

export async function syncGoogleSheets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") return { success: false, message: "Unauthorized" };

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    return { success: false, message: "Missing Google Sheets configuration in .env.local" };
  }
  
  key = key.replace(/\\n/g, "\n");

  try {
    const auth = new JWT({
      email: email,
      key: key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    const { data: programs } = await supabase.from("programs").select("id, title");

    // Optional admin client for user creation
    let supabaseAdmin = null;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const sourceId = `gsheet-${sheetId}-row-${row.rowNumber}`;
      
      const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("source_id", sourceId)
        .single();

      if (existingApp) {
        skipped++;
        continue;
      }

      const rawFullName = row.get("Full Name") || row.get("Name");
      const rawEmail = row.get("Email") || row.get("Email Address");
      const rawCollege = row.get("College") || row.get("Institution") || row.get("College/University");
      const rawDomain = row.get("Internship Domain") || row.get("Domain") || row.get("Course");

      if (!rawEmail) {
        errors++;
        errorDetails.push(`Row ${row.rowNumber}: Missing email.`);
        continue;
      }

      const studentEmail = rawEmail.trim().toLowerCase();
      const fullName = rawFullName ? rawFullName.trim() : "Unknown Student";
      
      // Match program
      let programId = null;
      if (rawDomain && programs) {
        const domainSearch = rawDomain.toLowerCase();
        const matchedProg = programs.find(p => p.title.toLowerCase().includes(domainSearch) || domainSearch.includes(p.title.toLowerCase()));
        if (matchedProg) programId = matchedProg.id;
      }

      if (!programId) {
        errors++;
        errorDetails.push(`Row ${row.rowNumber} (${studentEmail}): Could not map domain '${rawDomain}' to a program.`);
        continue;
      }

      // Check user
      let studentId = null;
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("email", studentEmail).single();

      if (existingProfile) {
        studentId = existingProfile.id;
      } else {
        if (!supabaseAdmin) {
           errors++;
           errorDetails.push(`Row ${row.rowNumber} (${studentEmail}): Student not registered and no SUPABASE_SERVICE_ROLE_KEY provided.`);
           continue;
        }

        // Create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: studentEmail,
          email_confirm: true,
          password: Math.random().toString(36).slice(-10) + "A1!", // Random secure password
          user_metadata: {
            full_name: fullName
          }
        });

        if (authError || !authData.user) {
          errors++;
          errorDetails.push(`Row ${row.rowNumber} (${studentEmail}): Failed to create user - ${authError?.message}`);
          continue;
        }

        studentId = authData.user.id;

        // Create profile
        await supabaseAdmin.from("profiles").insert({
          id: studentId,
          email: studentEmail,
          full_name: fullName,
          college: rawCollege || null,
          role: "STUDENT"
        });
      }

      // Check if application to this program already exists
      const { data: existingProgApp } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", studentId)
        .eq("program_id", programId)
        .single();
        
      if (existingProgApp) {
         // Update existing with source_id
         await supabase.from("applications").update({ source_id: sourceId }).eq("id", existingProgApp.id);
         skipped++;
         continue;
      }

      // Generate application ID
      const appIdStr = `CI-APP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Insert application
      const { error: appError } = await supabase.from("applications").insert({
        application_id: appIdStr,
        student_id: studentId,
        program_id: programId,
        source: "GOOGLE_FORM",
        source_id: sourceId,
        status: "PENDING"
      });

      if (appError) {
        errors++;
        errorDetails.push(`Row ${row.rowNumber} (${studentEmail}): DB Insert Failed - ${appError.message}`);
      } else {
        imported++;
      }
    }

    // Log the sync
    await supabase.from("google_sheet_sync_logs").insert({
      admin_id: user.id,
      records_checked: rows.length,
      records_imported: imported,
      records_updated: 0,
      duplicates_skipped: skipped,
      errors: errors,
      error_details: errorDetails.join(" | ")
    });

    revalidatePath("/admin/applications");
    return { success: true, imported, skipped, errors, errorDetails };

  } catch (error: any) {
    return { success: false, message: `Sync failed: ${error.message}` };
  }
}
