"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";


function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (!token || error) {
      setTimeout(() => router.replace("/login"), 1500)
      return;
    }

    const user = decodeToken(token);

    if (!user) {
      console.error("Google login failed: could not decode token");
      router.replace("/login");
      return;
    }

    setAuth(token, user);

    router.replace("/dashboard");
  }, [searchParams, router, setAuth]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-teal-400 animate-spin" />
        <p className="text-sm text-slate-300 tracking-wide">
          Finalizing secure login...
        </p>
      </div>
    </main>
  );
}