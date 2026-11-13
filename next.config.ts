import type { NextConfig } from "next";

/**
 * NEXT_EXPORT=1 genera una versión estática (carpeta /out) para vistas previas.
 * En Vercel o v0 se usa el build normal, con optimización de imágenes activa.
 */
const isExport = process.env.NEXT_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    unoptimized: isExport,
    formats: ["image/avif", "image/webp"],
    // Dominios permitidos para fotos remotas (Pinterest, Unsplash, tienda oficial).
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.zephyrclothing.com.ar" },
    ],
  },
};

export default nextConfig;
