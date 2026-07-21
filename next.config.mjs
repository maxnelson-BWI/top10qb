/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home dir confuses Next's root inference; pin it.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.espncdn.com" },
    ],
  },
};

export default nextConfig;
