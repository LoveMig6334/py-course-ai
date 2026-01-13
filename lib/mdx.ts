import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Path to content directory
const contentDirectory = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description?: string;
  order?: number;
}

export interface LessonData {
  slug: string;
  source: string;
  frontmatter: LessonMeta;
}

/**
 * Get all lesson slugs from the content directory
 */
export function getAllLessonSlugs(): string[] {
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get lesson data by slug
 */
export async function getLessonBySlug(
  slug: string
): Promise<LessonData | null> {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    source: content,
    frontmatter: data as LessonMeta,
  };
}

/**
 * Get all lessons with their metadata
 */
export async function getAllLessons(): Promise<LessonData[]> {
  const slugs = getAllLessonSlugs();
  const lessons = await Promise.all(slugs.map((slug) => getLessonBySlug(slug)));

  return lessons.filter((lesson): lesson is LessonData => lesson !== null);
}
