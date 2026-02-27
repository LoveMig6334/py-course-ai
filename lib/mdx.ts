import fs from "fs";
import matter from "gray-matter";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content");
const CATEGORIES = ["basic", "application"] as const;

export type Category = (typeof CATEGORIES)[number];

export interface LessonMeta {
  title: string;
  description?: string;
  order?: number;
  category: Category;
  tags?: string[];
}

export interface LessonData {
  slug: string; // format: "basic_01-intro"
  source: string;
  frontmatter: LessonMeta;
}

/**
 * Encodes a category + filename into a URL slug: "basic_01-intro"
 */
export function encodeSlug(category: Category, filename: string): string {
  return `${category}_${filename}`;
}

/**
 * Decodes a slug "basic_01-intro" → { category: "basic", lesson: "01-intro" }
 */
export function decodeSlug(slug: string): {
  category: Category;
  lesson: string;
} | null {
  const underscoreIndex = slug.indexOf("_");
  if (underscoreIndex === -1) return null;
  const category = slug.slice(0, underscoreIndex) as Category;
  const lesson = slug.slice(underscoreIndex + 1);
  if (!CATEGORIES.includes(category)) return null;
  return { category, lesson };
}

/** Get all lesson slugs across all categories */
export function getAllLessonSlugs(): string[] {
  const slugs: string[] = [];
  for (const category of CATEGORIES) {
    const categoryDir = path.join(contentDirectory, category);
    if (!fs.existsSync(categoryDir)) continue;
    const files = fs.readdirSync(categoryDir);
    files
      .filter((f) => f.endsWith(".mdx"))
      .forEach((file) => {
        slugs.push(encodeSlug(category, file.replace(/\.mdx$/, "")));
      });
  }
  return slugs;
}

/** Get lesson by encoded slug */
export async function getLessonBySlug(
  slug: string,
): Promise<LessonData | null> {
  const decoded = decodeSlug(slug);
  if (!decoded) return null;

  const fullPath = path.join(
    contentDirectory,
    decoded.category,
    `${decoded.lesson}.mdx`,
  );
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    source: content,
    frontmatter: {
      ...data,
      category: decoded.category,
    } as LessonMeta,
  };
}

/** Get all lessons, optionally filtered by category */
export async function getAllLessons(
  category?: Category,
): Promise<LessonData[]> {
  const slugs = getAllLessonSlugs().filter((s) => {
    if (!category) return true;
    return s.startsWith(`${category}_`);
  });

  const lessons = await Promise.all(slugs.map((s) => getLessonBySlug(s)));
  return lessons
    .filter((l): l is LessonData => l !== null)
    .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99));
}
