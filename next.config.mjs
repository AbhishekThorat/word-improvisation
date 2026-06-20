/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site in ./out for surge deployment.
  output: 'export',
  reactStrictMode: true,
  // Static export cannot use the Next image optimizer.
  images: { unoptimized: true },
  // Pin the workspace root so a stray lockfile higher up isn't picked.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
