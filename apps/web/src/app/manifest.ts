import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shadow Journal",
    short_name: "ShadowJournal",
    description:
      "Journal privately with AI reflections inspired by Carl Jung—shadow work, archetypes, and patterns.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0014",
    theme_color: "#6c2bee",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/brandLogo.png",
        sizes: "560x560",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
