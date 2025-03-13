import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // スタンドアロンで実行
  reactStrictMode: false, // 厳密モードを無効化
  typescript: {
    ignoreBuildErrors: true, // 型エラーを無視
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint エラーを無視
  },
  optimizeFonts: false, // フォントの最適化を無効化
  poweredByHeader: false, // "Powered by Next.js" ヘッダーを無効化
  trailingSlash: false, // 末尾のスラッシュを統一
  swcMinify: false, // SWC の minify を無効化
  productionBrowserSourceMaps: true, // ソースマップを有効化
};

export default nextConfig;
