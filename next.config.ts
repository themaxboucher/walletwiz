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
    ],
  },
};

export default config;
