import { getAllLessons } from "@/lib/mdx";
import type { Metadata } from "next";
import CourseList from "./CourseList";

export const metadata: Metadata = {
  title: "คอร์สเรียน Python",
  description:
    "เลือกบทเรียน Python ที่ต้องการ ครอบคลุมตั้งแต่พื้นฐานไปจนถึงการประยุกต์ใช้งานจริง เช่น Data Analysis และ Web Scraping",
};

export default async function CoursePage() {
  const lessons = await getAllLessons();
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 min-h-[calc(100vh-64px)] w-full">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          คอร์สเรียน Python
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          เลือกบทเรียนที่ต้องการ และเริ่มเรียนได้ทันที
        </p>
      </div>
      <CourseList lessons={lessons} />
    </div>
  );
}
