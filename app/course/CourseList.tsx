"use client";

import { Badge } from "@/components/ui/Badge";
import { CourseCard } from "@/components/ui/Card";
import type { LessonData } from "@/lib/mdx";
import { useState } from "react";

type Tab = "all" | "basic" | "application";

export default function CourseList({ lessons }: { lessons: LessonData[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = lessons.filter((l) => {
    if (tab === "all") return true;
    return l.frontmatter.category === tab;
  });

  const basicCount = lessons.filter(
    (l) => l.frontmatter.category === "basic",
  ).length;
  const appCount = lessons.filter(
    (l) => l.frontmatter.category === "application",
  ).length;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 border-b-2 border-gray-100">
        <button
          className={`px-5 py-2.5 rounded-t-lg font-semibold text-[0.9375rem] transition-all duration-200 border-b-2 -mb-[2px] ${
            tab === "all"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
          onClick={() => setTab("all")}
        >
          ทั้งหมด ({lessons.length})
        </button>
        <button
          className={`px-5 py-2.5 rounded-t-lg font-semibold text-[0.9375rem] transition-all duration-200 border-b-2 -mb-[2px] ${
            tab === "basic"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
          onClick={() => setTab("basic")}
        >
          🔵 พื้นฐาน ({basicCount})
        </button>
        <button
          className={`px-5 py-2.5 rounded-t-lg font-semibold text-[0.9375rem] transition-all duration-200 border-b-2 -mb-[2px] ${
            tab === "application"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
          onClick={() => setTab("application")}
        >
          🟡 การประยุกต์ใช้ ({appCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">ยังไม่มีบทเรียนในหมวดนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson, i) => {
            const isApp = lesson.frontmatter.category === "application";
            const num = (lesson.frontmatter.order ?? i + 1)
              .toString()
              .padStart(2, "0");
            return (
              <CourseCard
                key={lesson.slug}
                href={`/course/${lesson.slug}`}
                className="group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${isApp ? "bg-yellow-400 text-gray-900" : "bg-blue-600 text-white"}`}
                  >
                    {num}
                  </div>
                  <Badge variant={isApp ? "application" : "basic"}>
                    {isApp ? "🟡 ประยุกต์" : "🔵 พื้นฐาน"}
                  </Badge>
                </div>
                <div className="text-[1.0625rem] font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {lesson.frontmatter.title}
                </div>
                {lesson.frontmatter.description && (
                  <div className="text-sm text-gray-500 leading-relaxed flex-1">
                    {lesson.frontmatter.description}
                  </div>
                )}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <span className="text-[0.8125rem] font-medium text-gray-400 uppercase tracking-wide">
                    Python
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white">
                    →
                  </div>
                </div>
              </CourseCard>
            );
          })}
        </div>
      )}
    </>
  );
}
