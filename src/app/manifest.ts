import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'isola dei giochi",
    short_name: "Isola giochi",
    description: "Giochi educativi per bambini, anche offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "it",
    theme_color: "#7ec8e3",
    background_color: "#fff8f0",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}