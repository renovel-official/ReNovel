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
    <html lang="en">
      <body className="bg-white flex flex-col text-black h-screen">
        <Header login={login} hasNotifications={false} />
        <div className="flex flex-1">
          <div className="w-1/3 px-3 py-3">
            <Sidebar login={login} />
          </div>
          <div className="w-full px-3 py-3">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}