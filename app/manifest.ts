import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Looky",
    short_name: "Looky",
    description: "Гардероб, лента и стилист",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#fb5607",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
