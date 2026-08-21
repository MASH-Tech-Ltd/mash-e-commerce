import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  compress: false, // Disables gzip to fix the MaxListenersExceededWarning memory leak in dev
};

export default nextConfig;

