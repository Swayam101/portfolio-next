import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Swayam Prajapat - Full-Stack Developer Portfolio",
    short_name: "Swayam Portfolio",
    description:
      "Full-stack developer with 3 years of experience. I build clean, fast web software from frontend to backend.",
    start_url: "/",
    display: "standalone",
    background_color: "#bee9e8",
    theme_color: "#1b4965",
    orientation: "portrait-primary",
    categories: ["portfolio", "developer", "technology"],
    lang: "en-US",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
