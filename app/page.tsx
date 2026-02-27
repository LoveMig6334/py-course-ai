import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/Card";
import { getAllChallenges } from "@/lib/challenges";
import { getAllLessons } from "@/lib/mdx";
import Link from "next/link";

export default async function HomePage() {
  const [basicLessons, appLessons, challenges] = await Promise.all([
    getAllLessons("basic"),
    getAllLessons("application"),
    getAllChallenges(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:py-32 w-full max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-400 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          🐍 Python Learning Platform
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold leading-tight tracking-tight text-gray-900 mb-5">
          เรียน{" "}
          <span className="text-blue-600 relative inline-block">Python</span>
          <br />
          ที่นี่ที่เดียวครบ
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          จากพื้นฐานการเขียนโค้ดไปจนถึงการนำ Python ไปใช้ในงานจริง พร้อม IDE
          ในเบราว์เซอร์และโจทย์ฝึกทักษะ
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button href="/course" variant="primary">
            เริ่มเรียนเลย →
          </Button>
          <Button href="/challenge" variant="secondary">
            ดูโจทย์ฝึกหัด
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-50 border-y border-blue-100 py-12 px-6">
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-3xl md:text-5xl font-bold text-blue-600 tracking-tight">
              {basicLessons.length + appLessons.length}
            </div>
            <div className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
              บทเรียน
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold text-blue-600 tracking-tight">
              {challenges.length}
            </div>
            <div className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
              โจทย์ฝึกหัด
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold text-blue-600 tracking-tight">
              2
            </div>
            <div className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
              หมวดหมู่
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
            ทำไมต้อง mixPie DEV
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            เรียนรู้อย่างมีประสิทธิภาพ
          </h2>
          <p className="text-[1.0625rem] text-gray-500 max-w-2xl leading-relaxed">
            ระบบที่ออกแบบมาเพื่อให้ผู้เรียนสามารถฝึกเขียนโค้ดได้ทันทีโดยไม่ต้องติดตั้งอะไรเพิ่ม
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 text-2xl rounded-xl flex items-center justify-center mb-5">
                💻
              </div>
              <div className="text-[1.0625rem] font-bold text-gray-900 mb-2">
                IDE ในเบราว์เซอร์
              </div>
              <p className="text-[0.9375rem] text-gray-500 leading-relaxed">
                เขียนและรัน Python ได้ทันทีในเบราว์เซอร์ มีระบบไฟล์, Terminal
                และรองรับ pip install ติดตั้ง library ได้เลย
              </p>
            </FeatureCard>
            <FeatureCard>
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 text-2xl rounded-xl flex items-center justify-center mb-5">
                📚
              </div>
              <div className="text-[1.0625rem] font-bold text-gray-900 mb-2">
                เนื้อหาครบถ้วน
              </div>
              <p className="text-[0.9375rem] text-gray-500 leading-relaxed">
                บทเรียนแบ่งเป็น 2 หมวด: พื้นฐาน Python และการประยุกต์ใช้งานจริง
                เช่น Data Analysis, Web Scraping
              </p>
            </FeatureCard>
            <FeatureCard>
              <div className="w-12 h-12 bg-green-50 text-green-600 text-2xl rounded-xl flex items-center justify-center mb-5">
                🧩
              </div>
              <div className="text-[1.0625rem] font-bold text-gray-900 mb-2">
                โจทย์ฝึกหัด
              </div>
              <p className="text-[0.9375rem] text-gray-500 leading-relaxed">
                โจทย์หลากหลายระดับความยาก ตั้งแต่ Easy ถึง Hard
                ให้ฝึกคิดและแก้ปัญหาจริง พร้อม IDE ในหน้าเดียวกัน
              </p>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
          เนื้อหา
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          บทเรียนทั้งหมด
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Basic */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="basic">🔵 พื้นฐาน</Badge>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {basicLessons.length} บทเรียน
              </span>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {basicLessons.slice(0, 5).map((lesson, i) => (
                <Link
                  key={lesson.slug}
                  href={`/course/${lesson.slug}`}
                  className="flex items-center gap-4 p-3 rounded-[10px] no-underline text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 font-medium text-[0.9375rem]"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  {lesson.frontmatter.title}
                </Link>
              ))}
              {basicLessons.length === 0 && (
                <p className="p-4 text-sm text-gray-400">
                  ยังไม่มีบทเรียนพื้นฐาน
                </p>
              )}
              {basicLessons.length > 5 && (
                <Link
                  href="/course"
                  className="flex items-center gap-4 p-3 mt-1 rounded-[10px] no-underline text-blue-600 transition-all duration-200 hover:bg-blue-50 font-semibold text-[0.9375rem]"
                >
                  ดูทั้งหมด {basicLessons.length} บทเรียน →
                </Link>
              )}
            </div>
          </div>

          {/* Application */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="application">🟡 การประยุกต์ใช้</Badge>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {appLessons.length} บทเรียน
              </span>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {appLessons.slice(0, 5).map((lesson, i) => (
                <Link
                  key={lesson.slug}
                  href={`/course/${lesson.slug}`}
                  className="flex items-center gap-4 p-3 rounded-[10px] no-underline text-gray-700 transition-all duration-200 hover:bg-yellow-50 hover:text-yellow-700 font-medium text-[0.9375rem]"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  {lesson.frontmatter.title}
                </Link>
              ))}
              {appLessons.length === 0 && (
                <p className="p-4 text-sm text-gray-400">
                  ยังไม่มีบทเรียนการประยุกต์ใช้
                </p>
              )}
              {appLessons.length > 5 && (
                <Link
                  href="/course"
                  className="flex items-center gap-4 p-3 mt-1 rounded-[10px] no-underline text-yellow-600 transition-all duration-200 hover:bg-yellow-50 font-semibold text-[0.9375rem]"
                >
                  ดูทั้งหมด {appLessons.length} บทเรียน →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          พร้อมเริ่มต้นแล้วหรือยัง?
        </h2>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          เริ่มเรียน Python วันนี้ ไม่ต้องติดตั้งอะไรเลย
        </p>
        <Button href="/course" variant="yellow">
          ไปหน้าคอร์สเรียน →
        </Button>
      </section>
    </>
  );
}
