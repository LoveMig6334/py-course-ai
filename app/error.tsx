"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-5">⚠️</div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
        เกิดข้อผิดพลาด
      </h2>
      <p className="text-gray-500 text-[1.0625rem] leading-relaxed max-w-md mb-8">
        มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
        {error.digest && (
          <span className="block mt-2 text-xs text-gray-400 font-mono">
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-[10px] font-semibold text-[0.9375rem] hover:bg-blue-700 transition-colors cursor-pointer"
        >
          ลองใหม่
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-[10px] font-semibold text-[0.9375rem] no-underline hover:bg-gray-200 transition-colors"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
