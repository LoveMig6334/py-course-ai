import Link from "next/link";
import { getAllLessons } from "@/lib/mdx";
import { getAllChallenges } from "@/lib/challenges";

export default async function HomePage() {
  const [basicLessons, appLessons, challenges] = await Promise.all([
    getAllLessons("basic"),
    getAllLessons("application"),
    getAllChallenges(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">🐍 Python Learning Platform</div>
        <h1 className="hero-title">
          เรียน <span className="hero-title-accent">Python</span>
          <br />
          ที่นี่ที่เดียวครบ
        </h1>
        <p className="hero-subtitle">
          จากพื้นฐานการเขียนโค้ดไปจนถึงการนำ Python ไปใช้ในงานจริง
          พร้อม IDE ในเบราว์เซอร์และโจทย์ฝึกทักษะ
        </p>
        <div className="hero-cta">
          <Link href="/course" className="btn-primary">
            เริ่มเรียนเลย →
          </Link>
          <Link href="/challenge" className="btn-secondary">
            ดูโจทย์ฝึกหัด
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          background: "var(--blue-light)",
          borderTop: "1px solid var(--blue-mid)",
          borderBottom: "1px solid var(--blue-mid)",
          padding: "2rem 1.5rem",
        }}
      >
        <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div>
            <div className="stat-number">{basicLessons.length + appLessons.length}</div>
            <div className="stat-label">บทเรียน</div>
          </div>
          <div>
            <div className="stat-number">{challenges.length}</div>
            <div className="stat-label">โจทย์ฝึกหัด</div>
          </div>
          <div>
            <div className="stat-number">2</div>
            <div className="stat-label">หมวดหมู่</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="page-container">
          <p className="section-label">ทำไมต้อง mixPie DEV</p>
          <h2 className="section-title">เรียนรู้อย่างมีประสิทธิภาพ</h2>
          <p className="section-subtitle">
            ระบบที่ออกแบบมาเพื่อให้ผู้เรียนสามารถฝึกเขียนโค้ดได้ทันทีโดยไม่ต้องติดตั้งอะไรเพิ่ม
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue">💻</div>
              <div className="feature-title">IDE ในเบราว์เซอร์</div>
              <p className="feature-desc">
                เขียนและรัน Python ได้ทันทีในเบราว์เซอร์ มีระบบไฟล์, Terminal
                และรองรับ pip install ติดตั้ง library ได้เลย
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon yellow">📚</div>
              <div className="feature-title">เนื้อหาครบถ้วน</div>
              <p className="feature-desc">
                บทเรียนแบ่งเป็น 2 หมวด: พื้นฐาน Python
                และการประยุกต์ใช้งานจริง เช่น Data Analysis, Web Scraping
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green">🧩</div>
              <div className="feature-title">โจทย์ฝึกหัด</div>
              <p className="feature-desc">
                โจทย์หลากหลายระดับความยาก ตั้งแต่ Easy ถึง Hard
                ให้ฝึกคิดและแก้ปัญหาจริง พร้อม IDE ในหน้าเดียวกัน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="courses-preview-section">
        <p className="section-label">เนื้อหา</p>
        <h2 className="section-title">บทเรียนทั้งหมด</h2>
        <div className="preview-grid">
          {/* Basic */}
          <div className="preview-category">
            <div className="preview-category-header">
              <span className="category-badge basic">🔵 พื้นฐาน</span>
              <span style={{ fontSize: "0.875rem", color: "var(--gray-400)" }}>
                {basicLessons.length} บทเรียน
              </span>
            </div>
            <div className="preview-lessons-list">
              {basicLessons.slice(0, 5).map((lesson, i) => (
                <Link
                  key={lesson.slug}
                  href={`/course/${lesson.slug}`}
                  className="preview-lesson-item"
                >
                  <span className="preview-lesson-num">{i + 1}</span>
                  {lesson.frontmatter.title}
                </Link>
              ))}
              {basicLessons.length === 0 && (
                <p style={{ padding: "1rem", color: "var(--gray-400)", fontSize: "0.875rem" }}>
                  ยังไม่มีบทเรียนพื้นฐาน
                </p>
              )}
              {basicLessons.length > 5 && (
                <Link
                  href="/course"
                  className="preview-lesson-item"
                  style={{ color: "var(--blue)", fontWeight: 600 }}
                >
                  ดูทั้งหมด {basicLessons.length} บทเรียน →
                </Link>
              )}
            </div>
          </div>

          {/* Application */}
          <div className="preview-category">
            <div className="preview-category-header">
              <span className="category-badge application">🟡 การประยุกต์ใช้</span>
              <span style={{ fontSize: "0.875rem", color: "var(--gray-400)" }}>
                {appLessons.length} บทเรียน
              </span>
            </div>
            <div className="preview-lessons-list">
              {appLessons.slice(0, 5).map((lesson, i) => (
                <Link
                  key={lesson.slug}
                  href={`/course/${lesson.slug}`}
                  className="preview-lesson-item"
                >
                  <span className="preview-lesson-num">{i + 1}</span>
                  {lesson.frontmatter.title}
                </Link>
              ))}
              {appLessons.length === 0 && (
                <p style={{ padding: "1rem", color: "var(--gray-400)", fontSize: "0.875rem" }}>
                  ยังไม่มีบทเรียนการประยุกต์ใช้
                </p>
              )}
              {appLessons.length > 5 && (
                <Link
                  href="/course"
                  className="preview-lesson-item"
                  style={{ color: "var(--yellow-dark)", fontWeight: 600 }}
                >
                  ดูทั้งหมด {appLessons.length} บทเรียน →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
        <p className="cta-subtitle">เริ่มเรียน Python วันนี้ ไม่ต้องติดตั้งอะไรเลย</p>
        <Link href="/course" className="btn-yellow">
          ไปหน้าคอร์สเรียน →
        </Link>
      </section>
    </>
  );
}
