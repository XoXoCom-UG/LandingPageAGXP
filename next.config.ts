import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // There is a stray lockfile further up the user's home directory; without
  // this Next picks that as the workspace root and traces the wrong tree.
  outputFileTracingRoot: __dirname,
  // three.js ships untranspiled ESM examples; Next handles them fine, but the
  // r3f ecosystem is happier when they are treated as part of the app bundle.
  transpilePackages: ["three"],
};

export default nextConfig;
