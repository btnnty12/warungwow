import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.88.236",
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
