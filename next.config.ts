import { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.giphy.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media2.giphy.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media3.giphy.com",
        pathname: "/media/**",
      },
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
    ],
  },
};

export default config;
