import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  cacheHandlers: {
    remote: require.resolve("./cache-handler.js"),
  },
};

export default nextConfig;
