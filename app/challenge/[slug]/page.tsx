import { getAllChallengeSlugs, getChallengeBySlug, type ChallengeMeta } from "@/lib/challenges";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import IDE from "@/components/ide/IDE";
import type { Difficulty } from "@/lib/challenges";

const difficultyLabel: Record<Difficulty, string> = {
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
};

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mdx-h1" style={{ fontSize: "1.375rem" }} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mdx-h2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mdx-h3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mdx-p" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mdx-ul" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mdx-ol" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="mdx-code" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mdx-pre" {...props} />
  ),
};

export async function generateStaticParams() {
  return getAllChallengeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge) return { title: "โจทย์ไม่พบ" };
  return {
    title: `${challenge.frontmatter.title} | mixPie DEV`,
    description: challenge.frontmatter.description ?? "โจทย์ฝึกหัด Python",
  };
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge) notFound();

  const { content } = await compileMDX<ChallengeMeta>({
    source: challenge.source,
    components,
    options: { parseFrontmatter: false },
  });

  const diff = challenge.frontmatter.difficulty as Difficulty;
  const starterCode =
    challenge.frontmatter.starterCode ??
    `# ${challenge.frontmatter.title}\n# เขียนโค้ดของคุณที่นี่\n\n`;

  return (
    <div className="challenge-layout">
      {/* Description Panel */}
      <div className="challenge-description-panel">
        {/* Breadcrumb */}
        <nav className="lesson-breadcrumb" style={{ marginBottom: "1.25rem" }}>
          <Link href="/">หน้าหลัก</Link>
          <span>/</span>
          <Link href="/challenge">โจทย์ฝึกหัด</Link>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span className={`difficulty-badge ${diff}`} style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
            {difficultyLabel[diff]}
          </span>
          <h1 className="lesson-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {challenge.frontmatter.title}
          </h1>
          {challenge.frontmatter.description && (
            <p className="lesson-description" style={{ fontSize: "0.9375rem" }}>
              {challenge.frontmatter.description}
            </p>
          )}
          {challenge.frontmatter.tags && challenge.frontmatter.tags.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
              {challenge.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "var(--gray-100)",
                    color: "var(--gray-600)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            height: "1px",
            background: "var(--gray-100)",
            marginBottom: "1.25rem",
          }}
        />

        {/* MDX content */}
        <div className="mdx-body" style={{ fontSize: "0.9375rem" }}>
          {content}
        </div>
      </div>

      {/* IDE Panel */}
      <div className="challenge-ide-panel">
        <IDE initialCode={starterCode} />
      </div>
    </div>
  );
}
