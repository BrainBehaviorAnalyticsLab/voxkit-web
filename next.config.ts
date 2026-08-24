import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /download became /installation when the page grew from a single download
  // panel into the stepped install sequence, and the "Getting Started" help
  // topic was folded into that same sequence rather than repeating it. Both
  // redirects are permanent, so the links already in the wild -- and anything a
  // search engine indexed -- keep working.
  async redirects() {
    return [
      {
        source: "/download",
        destination: "/installation",
        permanent: true,
      },
      {
        source: "/help/getting-started",
        destination: "/installation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
