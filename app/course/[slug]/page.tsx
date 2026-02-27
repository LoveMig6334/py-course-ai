import CodeRunner from "@/components/mdx/CodeRunner";
import Mermaid from "@/components/mdx/Mermaid";
import { getAllLessonSlugs, getLessonBySlug, LessonMeta } from "@/lib/mdx";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

const components = {
  CodeRunner,
  Mermaid,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mdx-h1" {...props} />
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
    <div className="lesson-page">
      {/* Breadcrumb */}
      <nav className="lesson-breadcrumb">
        <Link href="/">หน้าหลัก</Link>
        <span>/</span>
        <Link href="/course">คอร์สเรียน</Link>
        <span>/</span>
        <span className={`category-badge ${categoryClass}`} style={{ fontSize: "0.75rem" }}>
          {categoryLabel}
        </span>
      </nav>

      {/* Header */}
      <header className="lesson-header">
        <h1 className="lesson-title">{lesson.frontmatter.title}</h1>
        {lesson.frontmatter.description && (
          <p className="lesson-description">{lesson.frontmatter.description}</p>
        )}
      </header>

      {/* Content */}
      <article className="mdx-body">{content}</article>
    </div>
  );
}
