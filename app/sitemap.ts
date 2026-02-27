import { getAllChallengeSlugs } from "@/lib/challenges";
import { getAllLessonSlugs } from "@/lib/mdx";
import type { MetadataRoute } from "next";

const baseUrl = "https://mixpie.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessonSlugs = getAllLessonSlugs();
  const challengeSlugs = getAllChallengeSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/course`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/challenge`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const lessonRoutes: MetadataRoute.Sitemap = lessonSlugs.map((slug) => ({
    url: `${baseUrl}/course/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const challengeRoutes: MetadataRoute.Sitemap = challengeSlugs.map((slug) => ({
    url: `${baseUrl}/challenge/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...lessonRoutes, ...challengeRoutes];
}
