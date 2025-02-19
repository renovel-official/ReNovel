import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";

import authUser from "@/lib/auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: {
    default: "ReNovel | 小説家の卵を発掘する小説投稿サイト",
    template: "%s / ReNovel"
  },
  description: "ReNovelは、新しい才能を発掘する小説投稿サイトです。あなたの物語を世界に届けましょう。",
  openGraph: {
    title: {
      default: "ReNovel | 小説家の卵を発掘する小説投稿サイト",
      template: "%s / ReNovel"
    },
    description: "ReNovelは、新しい才能を発掘する小説投稿サイトです。あなたの物語を世界に届けましょう。",
    url: "https://renovel.com", // ドメイン確定後に変更
    type: "website",
    images: [
      {
        url: "https://renovel.com/icon.jpg", // 画像URLを適宜変更
        width: 1200,
        height: 630,
        alt: "ReNovelのロゴ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ReNovel", // 公式Twitterアカウントがあれば変更
    title: {
      default: "ReNovel | 小説家の卵を発掘する小説投稿サイト",
      template: "%s / ReNovel"
    },
    description: "ReNovelは、新しい才能を発掘する小説投稿サイトです。あなたの物語を世界に届けましょう。",
    images: ["https://renovel.com/icon.jpg"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): Promise<ReactElement> {
  const login: boolean = await authUser();

  return (
    <html lang="ja">
      <body className="bg-white flex flex-col h-screen pt-16 text-black">
        {/* ヘッダーを固定 */}
        <header className="fixed top-0 left-0 w-full z-50">
          <Header login={login} hasNotifications={false} />
        </header>

        <div className="flex mt-10">
          {/* サイドバーを固定し、スクロール可能に */}
          <div className="fixed top-20 left-0 w-1/4 h-[calc(100vh-5rem)] px-3 py-3 overflow-y-auto overflow-y-hidden">
            <Sidebar login={login} />
          </div>

          {/* メインコンテンツ */}
          <div className="w-full ml-[25%] px-3 py-3">
            {children}
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}