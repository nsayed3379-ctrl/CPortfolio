import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows next/image to optimize images served from Sanity's asset CDN
    // once real product/work/labs photography is uploaded through the
    // Studio (see src/components/ui/MediaFrame.tsx for how this is used).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
