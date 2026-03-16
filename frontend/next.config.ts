import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Electron 빌드 시에만 standalone 출력 (Vercel/웹에서는 불필요)
  ...(process.env.BUILD_TARGET === 'electron' ? { output: 'standalone' as const } : {}),
};

export default nextConfig;
