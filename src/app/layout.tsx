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
  metadataBase: new URL("https://renovel.jp"),

  openGraph: {
    title: {
      default: "ReNovel | 小説家の卵を発掘する小説投稿サイト",
      template: "%s / ReNovel"
    },
    description: "ReNovelは、新しい才能を発掘する小説投稿サイトです。あなたの物語を世界に届けましょう。",
    url: "https://renovel.jp", // ドメイン確定後に変更
    type: "website",
    images: [
      {
        url: "https://renovel.jp/icon.png", // 画像URLを適宜変更
        width: 600,
        height: 600,
        alt: "ReNovelのロゴ",
      },
      {
        url: "https://renovel.jp/renovel_ogp.png", // 画像URLを適宜変更
        width: 1200,
        height: 630,
        alt: "ReNovelのOGP",
      }
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
    images: ["https://renovel.jp/renovel_ogp.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico"
  }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): Promise<ReactElement> {
  const login: string | false = await authUser();

  return (
    <html lang="ja">
      <body className="bg-white flex flex-col h-screen pt-16 text-black">
        {/* ヘッダーを固定 */}
        <header className="fixed top-0 left-0 w-full z-50">
          <Header login={login ? true : false} hasNotifications={false} />
        </header>

        <div className="flex">
          {/* サイドバーを固定し、スクロール可能に */}
          <div className="fixed left-0 w-1/6 h-screen overflow-y-auto overflow-y-hidden">
            <Sidebar login={login ? true : false} />
          </div>

          {/* メインコンテンツ */}
          <div className="w-full ml-[17%] px-3 py-3 mt-10 mr-3">
            {children}
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}