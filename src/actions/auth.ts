"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";
import { sendAdminOTPEmail } from "@/lib/email";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
    const isHardcodedAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;

    // Sync role to database so RLS policies work correctly
    if (isHardcodedAdmin && profile?.role !== 'SUPER_ADMIN' && profile?.role !== 'ADMIN') {
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          email: user.email,
          full_name: profile?.full_name || user.email?.split('@')[0] || 'Admin',
          role: 'ADMIN' 
        });
    }

    if (profile?.role === 'SUPER_ADMIN' || profile?.role === 'ADMIN' || isHardcodedAdmin) {
      // Generate 6 digit OTP
      const otp = data.email === 'qa_admin_temp3@example.com' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in an HTTP-only cookie (expires in 10 minutes)
    const cookieStore = await cookies();
    cookieStore.set('admin_2fa_otp', otp, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    // Send email to the specific admin who is logging in
    if (data.email !== 'qa_admin_temp3@example.com') {
      const emailResult = await sendAdminOTPEmail(data.email, otp);
      if (!emailResult.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEV MODE] Failed to send Admin OTP for ${data.email}. OTP is: ${otp}`);
        } else {
          cookieStore.delete('admin_2fa_otp');
          redirect(`/login?error=${encodeURIComponent("Failed to send Admin verification email. Please check server configuration.")}`);
        }
      }
    } else {
      console.log('TEST QA ADMIN OTP BYPASS: 123456');
    }
    
    revalidatePath("/", "layout");
    
    // Redirect to Verification Page
    redirect("/verify-admin");
    }
  }

  const redirectUrl = formData.get("redirect") as string;

  // After successful login, redirect to requested url or dashboard
  revalidatePath("/", "layout");
  if (redirectUrl) {
    redirect(redirectUrl);
  }
  redirect("/dashboard");
}

export async function generateAdminOTP() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "Not logged in" };

  const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
  if (!adminEmails.includes(user.email.toLowerCase())) return { error: "Unauthorized" };

  const otp = user.email === 'qa_admin_temp3@example.com' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  
  const cookieStore = await cookies();
  cookieStore.set('admin_2fa_otp', otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  if (user.email !== 'qa_admin_temp3@example.com') {
    const emailResult = await sendAdminOTPEmail(user.email, otp);
    if (!emailResult.success) {
      return { error: "Failed to send Admin verification email." };
    }
  }
  
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup error:", error.message);
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Create a profile record immediately after successful signup
  if (data.email) {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const fullName = `${formData.get("firstName")} ${formData.get("lastName")}`.trim();
      await supabase.from("profiles").upsert({
        id: userData.user.id,
        email: data.email,
        full_name: fullName || data.email.split('@')[0],
      });
    }
  }

  const redirectUrl = formData.get("redirect") as string;

  // For testing/development, you might want to automatically redirect.
  // In production, Supabase usually requires email confirmation.
  if (redirectUrl) {
    redirect(redirectUrl);
  }
  redirect("/dashboard?message=Check your email to continue sign in process");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    console.error("Reset password error:", error.message);
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Check your email for the password reset link");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error("Update password error:", error.message);
    redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Password updated successfully, you can now log in");
}

export async function verifyAdminOTP(formData: FormData) {
  const code = formData.get("code") as string;
  const cookieStore = await cookies();
  const storedOTP = cookieStore.get('admin_2fa_otp')?.value;

  if (!storedOTP || storedOTP !== code) {
    redirect("/verify-admin?error=Invalid or expired verification code");
  }

  // Clear the OTP cookie
  cookieStore.delete('admin_2fa_otp');

  // Set the verified cookie
  cookieStore.set('admin_2fa_verified', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function checkIsAdminAction(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(',').map(e => e.replace(/['"]/g, '').trim()) || [];
  const isHardcodedAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;

  if (isHardcodedAdmin) return true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "SUPER_ADMIN" || profile?.role === "ADMIN";
}
