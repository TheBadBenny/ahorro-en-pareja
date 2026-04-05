import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES === "true" ? "/ahorro-en-pareja" : "",
  images: { unoptimized: true },
};

export default nextConfig;
