'use client';
import { useState, useEffect } from "react";
import { Kaisei_Decol } from "next/font/google";

import Infomation from "@/interface/infomation";
import Novel from "@/interface/novel";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function Home() {
  const [infomations, setInfomations] = useState<Infomation[]>([{ title: "開発を開始しました", created_at: "2025 - 2/16" }]);
  const [newNovels, setNovels] = useState<Novel[]>([{ title: "転生したらスライムだった件", phrase: "転生したらスライムだった件" }])
  return (
    <>

      <div className="w-full px-3 py-3 mt-3 border rounded">
        <div className={`text-center text-3xl ${kaisei_decol.className}`}>
          お知らせ
        </div>

        <div>
          {infomations.map((infomation: Infomation, index: number) => (
            <div key={`info-${index}`} className="flex">
              <div className="text-left bg-amber-100 px-4 py-2">
                {infomation.created_at}
              </div>

              <div className="ml-3 px-2 py-2">
                {infomation.title}
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="w-full px-3 py-3 mt-3 border rounded">
        <div className={`text-center text-3xl ${kaisei_decol.className}`}>
          新着小説
        </div>

        <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newNovels.map((novel: Novel, index: number) => (
            <div key={`new_novel-${index}`} className="flex">
              <div className="">
                { novel.phrase }
              </div>

              <div className="">
                { novel.title }
              </div>

              <div className="">
                { novel.updated_at }
              </div>
            </div>
          ))}

        </div>
      </div>


    </>
  );
}
