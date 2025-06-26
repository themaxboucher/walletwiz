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
        hostname: "media-cldnry.s-nbcnews.com",
        pathname: "/image/upload/**",
      },
    ],
  },
};

export default config;
