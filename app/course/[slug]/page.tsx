import CodeRunner from "@/components/mdx/CodeRunner";
import Mermaid from "@/components/mdx/Mermaid";
import { Badge } from "@/components/ui/Badge";
import { getAllLessonSlugs, getLessonBySlug, LessonMeta } from "@/lib/mdx";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

const components = {
  CodeRunner,
  Mermaid,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold text-gray-900 mt-10 mb-4 tracking-tight"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-yellow-400 inline-block tracking-tight lg:mt-12"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mb-5 text-gray-600 leading-relaxed text-[1.0625rem]"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 mb-5 text-gray-600 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 mb-5 text-gray-600 space-y-2" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 border border-gray-200"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-[#0d1117] p-5 rounded-xl overflow-x-auto mb-6 border border-[#30363d] !bg-transparent !p-0"
      {...props}
    />
  ),
};

export async function generateStaticParams() {
  const slugs = getAllLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) return { title: "บทเรียนไม่พบ" };
  return {
    title: `${lesson.frontmatter.title} | mixPie DEV`,
    description: lesson.frontmatter.description ?? "เรียนรู้ Python ภาษาไทย",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();

  const { content } = await compileMDX<LessonMeta>({
    source: lesson.source,
    components,
    options: { parseFrontmatter: false },
  });

  const categoryLabel =
    lesson.frontmatter.category === "basic" ? "พื้นฐาน" : "การประยุกต์ใช้";
  const categoryClass = lesson.frontmatter.category;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 pb-20 min-h-[calc(100vh-64px)] w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-gray-400">
        <Link
          href="/"
          className="text-blue-600 font-medium hover:underline no-underline"
        >
          หน้าหลัก
        </Link>
        <span>/</span>
        <Link
          href="/course"
          className="text-blue-600 font-medium hover:underline no-underline"
        >
          คอร์สเรียน
        </Link>
        <span>/</span>
        <Badge
          variant={categoryClass as "basic" | "application"}
          className="text-[0.75rem]"
        >
          {categoryLabel}
        </Badge>
      </nav>

      {/* Header */}
      <header className="mb-10 pb-8 border-b-[1.5px] border-gray-100">
        <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-900 tracking-tight mb-3 leading-tight">
          {lesson.frontmatter.title}
        </h1>
        {lesson.frontmatter.description && (
          <p className="text-[1.0625rem] text-gray-500 leading-relaxed md:text-lg">
            {lesson.frontmatter.description}
          </p>
        )}
      </header>

      {/* Content */}
      <article className="text-[1.0625rem] text-gray-700 max-w-none prose prose-blue prose-pre:bg-[#0d1117] prose-pre:text-[#e6edf3] prose-pre:border prose-pre:border-[#30363d] prose-pre:p-5 prose-pre:rounded-xl">
        {content}
      </article>
    </div>
  );
}
