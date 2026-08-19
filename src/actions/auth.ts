"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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

  const redirectUrl = formData.get("redirect") as string;

  // After successful login, redirect to requested url or dashboard
  revalidatePath("/", "layout");
  if (redirectUrl) {
    redirect(redirectUrl);
  }
  redirect("/dashboard");
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
