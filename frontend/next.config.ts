import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
    localPatterns: [
      {
        pathname: "/api/proxy/**",
      },
      {
        pathname: "/api/proxy",
      },
    ],
  },
};

export default nextConfig;
