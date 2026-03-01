import type { MetadataRoute } from "next";
import MY_PROJECTS from "@/data/projects";

const BASE_URL = "https://www.swayam.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = MY_PROJECTS.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...projects,
  ];
}
