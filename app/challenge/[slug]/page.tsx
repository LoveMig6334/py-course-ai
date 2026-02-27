import IDE from "@/components/ide/IDE";
import type { Difficulty } from "@/lib/challenges";
import {
  getAllChallengeSlugs,
  getChallengeBySlug,
  type ChallengeMeta,
} from "@/lib/challenges";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

const difficultyLabel: Record<Difficulty, string> = {
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
};

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-[1.375rem] font-bold text-gray-900 mt-8 mb-3"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b-2 border-yellow-400 inline-block"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-gray-600 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-1.5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal pl-5 mb-4 text-gray-600 space-y-1.5"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-100 px-1.5 py-0.5 rounded text-[0.85em] font-mono text-blue-600 border border-gray-200"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="!bg-transparent !p-0 overflow-x-auto mb-5 border border-[#30363d] rounded-xl"
      {...props}
    />
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

  // Badge styles map
  const badgeStyles: Record<Difficulty, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      {/* Description Panel */}
      <div className="w-full lg:w-1/3 xl:w-[450px] flex-shrink-0 h-1/2 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 p-5 md:p-6 custom-scrollbar">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-5 text-[0.875rem] text-gray-400">
          <Link
            href="/"
            className="text-blue-600 font-medium hover:underline no-underline"
          >
            หน้าหลัก
          </Link>
          <span>/</span>
          <Link
            href="/challenge"
            className="text-blue-600 font-medium hover:underline no-underline"
          >
            โจทย์ฝึกหัด
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-5">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide mb-3 ${badgeStyles[diff]}`}
          >
            {difficultyLabel[diff]}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-2">
            {challenge.frontmatter.title}
          </h1>
          {challenge.frontmatter.description && (
            <p className="text-[0.9375rem] text-gray-500 leading-relaxed">
              {challenge.frontmatter.description}
            </p>
          )}
          {challenge.frontmatter.tags &&
            challenge.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {challenge.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </div>

        <div className="h-[1px] bg-gray-100 mb-5 w-full"></div>

        {/* MDX content */}
        <div className="prose prose-blue prose-sm text-[0.9375rem] text-gray-700 max-w-none prose-pre:bg-[#0d1117] prose-pre:text-[#e6edf3] prose-pre:border prose-pre:border-[#30363d] prose-pre:p-4 prose-pre:rounded-xl">
          {content}
        </div>
      </div>

      {/* IDE Panel */}
      <div className="w-full lg:w-2/3 xl:flex-1 h-1/2 lg:h-full min-h-[400px]">
        <IDE initialCode={starterCode} />
      </div>
    </div>
  );
}
