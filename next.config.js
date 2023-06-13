const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  mdxRs: true,
};

module.exports = withMDX(nextConfig);
