import type { NextConfig } from "next";

// Images uploaded through the admin panel are served by the backend
// (see NEXT_PUBLIC_API_URL) from its `/uploads` path, so next/image needs
// that host allow-listed before it will optimize them. Derived from the
// same env var the frontend already uses to talk to the backend, so this
// works unchanged in dev (http://localhost:4000) and in production
// (whatever the deployed backend URL is).
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const api = new URL(apiUrl);

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks optimizing images from loopback/private IPs as an
    // SSRF guard. In local dev the backend is http://localhost:4000
    // (resolves to 127.0.0.1 / ::1), so opt in there only — a deployed
    // backend sits on a public host and never needs this.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: api.protocol.replace(":", "") as "http" | "https",
        hostname: api.hostname,
        port: api.port || undefined,
        pathname: "/uploads/**",
      },
      // Kept for the leftover Sanity Studio route; nothing on the public
      // site serves content images from here anymore.
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
