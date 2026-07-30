import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "110.90.24.133",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tqyxhxopmbtnhdlkvdmd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
