"use client";

import Link from "next/link";
import { useState } from "react";
import type { LessonData } from "@/lib/mdx";

type Tab = "all" | "basic" | "application";

export default function CourseList({ lessons }: { lessons: LessonData[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = lessons.filter((l) => {
    if (tab === "all") return true;
    return l.frontmatter.category === tab;
  });

  const basicCount = lessons.filter((l) => l.frontmatter.category === "basic").length;
  const appCount = lessons.filter((l) => l.frontmatter.category === "application").length;

  return (
    <>
      <div className="category-tabs">
        <button
          className={`category-tab ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          ทั้งหมด ({lessons.length})
        </button>
        <button
          className={`category-tab ${tab === "basic" ? "active" : ""}`}
          onClick={() => setTab("basic")}
        >
          🔵 พื้นฐาน ({basicCount})
        </button>
        <button
          className={`category-tab ${tab === "application" ? "active" : ""}`}
          onClick={() => setTab("application")}
        >
          🟡 การประยุกต์ใช้ ({appCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>
          <p style={{ fontSize: "1.125rem" }}>ยังไม่มีบทเรียนในหมวดนี้</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filtered.map((lesson, i) => {
            const isApp = lesson.frontmatter.category === "application";
            const num = (lesson.frontmatter.order ?? i + 1).toString().padStart(2, "0");
            return (
              <Link
                key={lesson.slug}
                href={`/course/${lesson.slug}`}
                className="course-card"
              >
                <div className="course-card-top">
                  <div className={`course-card-num ${isApp ? "application" : ""}`}>{num}</div>
                  <span className={`category-badge ${lesson.frontmatter.category}`}>
                    {isApp ? "🟡 ประยุกต์" : "🔵 พื้นฐาน"}
                  </span>
                </div>
                <div className="course-card-title">{lesson.frontmatter.title}</div>
                {lesson.frontmatter.description && (
                  <div className="course-card-desc">{lesson.frontmatter.description}</div>
                )}
                <div className="course-card-footer">
                  <span className="course-card-meta">Python</span>
                  <div className="course-card-arrow">→</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
