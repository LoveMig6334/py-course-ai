"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="th">
      <body className="min-h-screen flex flex-col items-center justify-center px-6 text-center font-sans bg-white text-gray-900">
        <div className="text-5xl mb-5">💥</div>
        <h2 className="text-2xl font-bold mb-3">เกิดข้อผิดพลาดร้ายแรง</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          ระบบเกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองรีเฟรชหน้า
          {error.digest && (
            <span className="block mt-2 text-xs text-gray-400 font-mono">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-[10px] font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          ลองใหม่
        </button>
      </body>
    </html>
  );
}
