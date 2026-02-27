import fs from "fs";
import matter from "gray-matter";
import path from "path";

const challengesDir = path.join(process.cwd(), "challenges");

export type Difficulty = "easy" | "medium" | "hard";

export interface ChallengeMeta {
  title: string;
  description?: string;
  difficulty: Difficulty;
  order?: number;
  tags?: string[];
  starterCode?: string;
}

export interface ChallengeData {
  slug: string;
  source: string;
  frontmatter: ChallengeMeta;
}

export function getAllChallengeSlugs(): string[] {
  if (!fs.existsSync(challengesDir)) return [];
  return fs
    .readdirSync(challengesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getChallengeBySlug(
  slug: string,
): Promise<ChallengeData | null> {
  const fullPath = path.join(challengesDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    source: content,
    frontmatter: data as ChallengeMeta,
  };
}

export async function getAllChallenges(): Promise<ChallengeData[]> {
  const slugs = getAllChallengeSlugs();
  const all = await Promise.all(slugs.map((s) => getChallengeBySlug(s)));
  return all
    .filter((c): c is ChallengeData => c !== null)
    .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99));
}
