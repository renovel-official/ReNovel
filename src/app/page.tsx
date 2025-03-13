'use client';
import { useEffect, useState } from "react";
import { Kaisei_Decol } from "next/font/google";

import Novel, { NovelResult, NovelAuthor } from "@/interface/novel";
import ApiResponse from "@/interface/response";
import Infomation from "@/interface/infomation";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400", subsets: ["latin"] });

function convertToTimestamp(dateString: string): number {
  return new Date(dateString).getTime();
}

export default function Home() {
  const [infomations, setInfomations] = useState<Infomation[]>([
    { title: "開発を開始しました", created_at: "2025-2/16" }
  ]);
  const [newNovels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getNovels = async () => {
      const response: Response = await fetch(`/api/v3/works`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        const novelsResult: NovelResult[] = data.body;
        const publicNovels: NovelResult[] = novelsResult.filter((novel: NovelResult) => 
          novel.work.type == "long" ? novel.isPublic : novel.work.is_public).sort(
            (a: NovelResult, b: NovelResult) => 
              convertToTimestamp(b.work.updated_at ?? "") - convertToTimestamp(a.work.updated_at ?? ""));

        setNovels(publicNovels.map((novel: NovelResult) => novel.work));

        setIsLoading(false);
      }
    };

    getNovels();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
        <div className="spinner"></div>
      </div>

      <div className={`py-6 ${isLoading ? "hidden" : ""}`}>
        {/* お知らせセクション */}
        <div className="w-full px-3 py-3 mt-3 border rounded bg-white shadow-md">
          <div className={`text-center text-3xl ${kaisei_decol.className}`}>
            お知らせ
          </div>
          <div>
            {infomations.map((infomation, index) => (
              <div key={`info-${index}`} className="flex items-center py-2 border-b">
                <div className="bg-amber-100 text-sm px-4 py-1 rounded font-medium">
                  {infomation.created_at}
                </div>
                <div className="ml-3 text-lg">
                  {infomation.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新着小説セクション */}
        <div className="w-full px-3 py-3 mt-6 border rounded bg-white shadow-md">
          <div className={`text-center text-3xl ${kaisei_decol.className}`}>
            新着小説
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {newNovels.map((novel, index) => (
              <Link href={`/works/${novel.slug}`} key={`new_novel-${index}`}>
                <div className="border p-5 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105">
                  <div className="text-lg font-bold text-indigo-600 mb-1">
                    { novel.title }
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    { novel.phrase }
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    評価ポイント: <span className="font-bold text-orange-500">{ novel.point.toLocaleString("en-US") }</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    最終更新: { novel.updated_at }
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}