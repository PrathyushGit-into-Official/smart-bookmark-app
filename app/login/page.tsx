"use client";

import { supabase } from "@/lib/supabase";

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-12 max-w-md w-full text-center">

        <h1 className="text-4xl font-bold text-white mb-3">
          Smart Bookmark App
        </h1>

        <p className="text-gray-300 mb-10">
          Save and organize your favorite links securely.
        </p>

        <button
          onClick={login}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-200"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Your data is private and protected.
        </p>

      </div>
    </div>
  );
}
