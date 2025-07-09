// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // 新增的 compiler 配置
  compiler: {
    // 這會在生產環境建置時自動移除所有 console.* 語句。
    // 開發環境 (npm run dev) 會保留，方便除錯。
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;