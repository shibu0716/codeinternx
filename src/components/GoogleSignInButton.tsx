"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google Sign In Error:", error);
      }
      // If successful, the page will redirect to Google
    } catch (err) {
      console.error("Unexpected error during Google Sign-in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      type="button"
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.72 17.58V20.34H19.29C21.38 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.58C14.73 18.24 13.48 18.64 12 18.64C9.14 18.64 6.7 16.71 5.84 14.12H2.15V16.98C3.96 20.57 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.84 14.12C5.62 13.47 5.5 12.75 5.5 12C5.5 11.25 5.62 10.53 5.84 9.88V7.02H2.15C1.41 8.5 1 10.2 1 12C1 13.8 1.41 15.5 2.15 16.98L5.84 14.12Z" fill="#FBBC05"/>
          <path d="M12 5.36C13.62 5.36 15.07 5.92 16.22 7.01L19.37 3.86C17.46 2.07 14.97 1 12 1C7.7 1 3.96 3.43 2.15 7.02L5.84 9.88C6.7 7.29 9.14 5.36 12 5.36Z" fill="#EA4335"/>
        </svg>
      )}
      Continue with Google
    </button>
  );
}
