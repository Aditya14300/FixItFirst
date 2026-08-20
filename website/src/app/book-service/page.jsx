"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookServiceRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/booking");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-slate-300">Redirecting to Checkout & Payments...</span>
      </div>
    </div>
  );
}