import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Turbopack native bindings are unavailable on this platform; use Webpack. */
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;