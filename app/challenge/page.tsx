import { getAllChallenges, type Difficulty } from "@/lib/challenges";
import Link from "next/link";

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
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-[calc(100vh-64px)] w-full">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          โจทย์ฝึกหัด Python
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          ฝึกทักษะการเขียนโค้ดด้วยโจทย์หลากหลายระดับ มี IDE
          พร้อมให้ใช้ในทุกโจทย์
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🧩</div>
          <p className="text-lg font-medium text-gray-600">
            ยังไม่มีโจทย์ฝึกหัด
          </p>
          <p className="text-sm mt-2">เพิ่มไฟล์ .mdx ในโฟลเดอร์ challenges/</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {challenges.map((challenge) => {
            const diff = challenge.frontmatter.difficulty as Difficulty;

            // Badge styles map
            const badgeStyles: Record<Difficulty, string> = {
              easy: "bg-green-100 text-green-700",
              medium: "bg-yellow-100 text-yellow-700",
              hard: "bg-red-100 text-red-700",
            };

            return (
              <Link
                key={challenge.slug}
                href={`/challenge/${challenge.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white border-[1.5px] border-gray-200 rounded-2xl no-underline text-inherit transition-all duration-200 hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-2xl shrink-0 group-hover:bg-blue-50 transition-colors">
                    {difficultyEmoji[diff]}
                  </div>
                  <div className="flex-1">
                    <div className="text-[1.0625rem] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {challenge.frontmatter.order
                        ? `#${challenge.frontmatter.order} — `
                        : ""}
                      {challenge.frontmatter.title}
                    </div>
                    {challenge.frontmatter.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {challenge.frontmatter.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pl-16 sm:pl-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[0.8125rem] font-bold tracking-wide ${badgeStyles[diff]}`}
                  >
                    {difficultyLabel[diff]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
