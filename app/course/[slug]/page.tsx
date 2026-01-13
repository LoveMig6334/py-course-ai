import CodeRunner from "@/components/mdx/CodeRunner";
import Mermaid from "@/components/mdx/Mermaid";
import { getAllLessonSlugs, getLessonBySlug, LessonMeta } from "@/lib/mdx";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

// Custom MDX components
const components = {
  CodeRunner,
  Mermaid,
  // Override default elements for better styling
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="lesson-h1" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="lesson-h2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="lesson-h3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="lesson-p" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="lesson-ul" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="lesson-ol" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="lesson-code" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="lesson-pre" {...props} />
  ),
};

// Generate static params for all lessons
export async function generateStaticParams() {
  const slugs = getAllLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    return {
      title: "บทเรียนไม่พบ",
    };
  }

  return {
    title: `${lesson.frontmatter.title} | Python Course`,
    description: lesson.frontmatter.description || "เรียนรู้ Python ภาษาไทย",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  // Compile MDX with custom components
  const { content } = await compileMDX<LessonMeta>({
    source: lesson.source,
    components,
    options: {
      parseFrontmatter: false,
    },
  });

  return (
    <main className="lesson-container">
      <nav className="lesson-nav">
        <Link href="/" className="lesson-back-link">
          <ArrowLeft size={20} />
          กลับหน้าหลัก
        </Link>
      </nav>

      <article className="lesson-content">
        <header className="lesson-header">
          <h1 className="lesson-title">{lesson.frontmatter.title}</h1>
          {lesson.frontmatter.description && (
            <p className="lesson-description">
              {lesson.frontmatter.description}
            </p>
          )}
        </header>

        <div className="lesson-body">{content}</div>
      </article>
    </main>
  );
}
