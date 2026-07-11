import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* ── Rendering ── */
  reactStrictMode: true,

  /* ── TypeScript & ESLint ── */
  typescript: {
    // Type errors surface in CI via `tsc --noEmit`, not during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint runs in CI separately; keep build fast
    ignoreDuringBuilds: true,
    dirs: ["src"],
  },

  /* ── Images ── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.yahoo.com",
      },
    ],
  },

  /* ── Webpack: mirror tsconfig path aliases ── */
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/app": path.resolve(__dirname, "src/app"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/agent": path.resolve(__dirname, "src/agent"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/store": path.resolve(__dirname, "src/store"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/constants": path.resolve(__dirname, "src/constants"),
      "@/styles": path.resolve(__dirname, "src/styles"),
    };
    return config;
  },

  /* ── Headers ── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
