import { getAllLessons } from "@/lib/mdx";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const lessons = await getAllLessons();

  // Sort lessons by order or filename
  const sortedLessons = lessons.sort((a, b) => {
    if (a.frontmatter.order && b.frontmatter.order) {
      return a.frontmatter.order - b.frontmatter.order;
    }
    return a.slug.localeCompare(b.slug);
  });

  return (
    <main className="home-container">
      <section className="home-hero">
        <div className="home-logo">🐍</div>
        <h1 className="home-title">Python Course</h1>
        <p className="home-subtitle">
          เรียนรู้ภาษา Python ตั้งแต่พื้นฐาน
          พร้อมตัวอย่างโค้ดที่รันได้จริงในเบราว์เซอร์
        </p>
      </section>

      <section>
        <h2 className="home-lessons-title">
          <BookOpen size={24} />
          บทเรียนทั้งหมด
        </h2>

        <div className="lessons-grid">
          {sortedLessons.map((lesson, index) => (
            <Link
              key={lesson.slug}
              href={`/course/${lesson.slug}`}
              className="lesson-card"
            >
              <div className="lesson-card-number">{index + 1}</div>
              <div className="lesson-card-content">
                <div className="lesson-card-title">
                  {lesson.frontmatter.title}
                </div>
                {lesson.frontmatter.description && (
                  <div className="lesson-card-desc">
                    {lesson.frontmatter.description}
                  </div>
                )}
              </div>
              <ArrowRight className="lesson-card-arrow" size={20} />
            </Link>
          ))}
        </div>

        {sortedLessons.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "3rem" }}>
            ยังไม่มีบทเรียน กรุณาเพิ่มไฟล์ .mdx ในโฟลเดอร์ content/
          </p>
        )}
      </section>
    </main>
  );
}
