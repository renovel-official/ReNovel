'use client';
import { useState } from "react";
import { Kaisei_Decol } from "next/font/google";

import Infomation from "@/interface/infomation";
import Novel from "@/interface/novel";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function Home() {
  const [infomations, setInfomations] = useState<Infomation[]>([
    { title: "開発を開始しました", created_at: "2025-2/16" }
  ]);

  const [newNovels, setNovels] = useState<Novel[]>([
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" },
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" },
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" },
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" },
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" },
    { slug: 'example', title: "転生したらスライムだった件", phrase: "異世界転生ファンタジー", point: "14,556", updated_at: "2025-2/17" }
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-6">
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
                    評価ポイント: <span className="font-bold text-orange-500">{ novel.point }</span>
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
