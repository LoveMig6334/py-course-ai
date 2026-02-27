import Link from "next/link";
import { getAllChallenges, type Difficulty } from "@/lib/challenges";

const difficultyLabel: Record<Difficulty, string> = {
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
};

const difficultyEmoji: Record<Difficulty, string> = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
};

export default async function ChallengePage() {
  const challenges = await getAllChallenges();

  return (
    <div className="challenge-page">
      <div className="page-header">
        <h1 className="page-title">โจทย์ฝึกหัด Python</h1>
        <p className="page-desc">
          ฝึกทักษะการเขียนโค้ดด้วยโจทย์หลากหลายระดับ มี IDE พร้อมให้ใช้ในทุกโจทย์
        </p>
      </div>

      {challenges.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "var(--gray-400)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧩</div>
          <p style={{ fontSize: "1.125rem" }}>ยังไม่มีโจทย์ฝึกหัด</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            เพิ่มไฟล์ .mdx ในโฟลเดอร์ challenges/
          </p>
        </div>
      ) : (
        <div className="challenges-list">
          {challenges.map((challenge) => {
            const diff = challenge.frontmatter.difficulty as Difficulty;
            return (
              <Link
                key={challenge.slug}
                href={`/challenge/${challenge.slug}`}
                className="challenge-card"
              >
                <div className="challenge-num">
                  {difficultyEmoji[diff]}
                </div>
                <div className="challenge-info">
                  <div className="challenge-title">
                    {challenge.frontmatter.order
                      ? `#${challenge.frontmatter.order} — `
                      : ""}
                    {challenge.frontmatter.title}
                  </div>
                  {challenge.frontmatter.description && (
                    <div className="challenge-desc">
                      {challenge.frontmatter.description}
                    </div>
                  )}
                </div>
                <span className={`difficulty-badge ${diff}`}>
                  {difficultyLabel[diff]}
                </span>
                <span style={{ color: "var(--gray-300)", marginLeft: "0.5rem" }}>→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
