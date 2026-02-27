import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl font-bold text-blue-100 select-none mb-2">
        404
      </div>
      <div className="text-5xl mb-6">🐍</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
        ไม่พบหน้าที่ต้องการ
      </h1>
      <p className="text-gray-500 text-[1.0625rem] leading-relaxed max-w-md mb-8">
        หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยน URL หรือไม่เคยมีอยู่ก็เป็นได้
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-[10px] font-semibold text-[0.9375rem] no-underline hover:bg-blue-700 transition-colors"
        >
          กลับหน้าหลัก
        </Link>
        <Link
          href="/course"
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-[10px] font-semibold text-[0.9375rem] no-underline hover:bg-gray-200 transition-colors"
        >
          ดูคอร์สเรียน
        </Link>
      </div>
    </div>
  );
}
