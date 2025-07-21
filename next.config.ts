import { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nyc.cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**/preview",
      },
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
        pathname: "/**",
      },
    ],
  },
};

export default config;
