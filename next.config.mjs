/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home dir confuses Next's root inference; pin it.
  outputFileTracingRoot: import.meta.dirname,
  // The graphics route reads font TTFs with a runtime path.join, which Next's
  // tracer can't follow. Without this they're missing from the lambda and the
  // graphics silently fall back to the system sans in production.
  outputFileTracingIncludes: {
    "/graphics/list": ["./public/graphics/assets/fonts/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.espncdn.com" },
    ],
  },
};

export default nextConfig;
