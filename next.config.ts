import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // There is a stray lockfile further up the user's home directory; without
  // this Next picks that as the workspace root and traces the wrong tree.
  outputFileTracingRoot: __dirname,
  // three.js ships untranspiled ESM examples; Next handles them fine, but the
  // r3f ecosystem is happier when they are treated as part of the app bundle.
  transpilePackages: ["three"],
  // Baseline hardening. No CSP yet: the theme boot script is inline, and a
  // nonce-based policy is more machinery than a static page needs today.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
