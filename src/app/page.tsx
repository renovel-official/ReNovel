import { getNovelsAll } from "@/lib/novel";
import { headers } from "next/headers";


import Novel, { NovelResult, NovelAuthor } from "@/interface/novel";
import ApiResponse from "@/interface/response";
import Infomation from "@/interface/infomation";
import HomePc from "@/components/screen/pc/home";
import Link from "next/link";

function convertToTimestamp(dateString: string): number {
  return new Date(dateString).getTime();
}

export default async function Home() {
  const infomations: Infomation[] = [
    { title: "開発を開始しました", created_at: "2025-2/16" }
  ];
  const novels: NovelResult[] | null= await getNovelsAll();
  
  const publicNovels: NovelResult[] = (novels ?? []).filter((novel: NovelResult) =>
    novel.work.type == "long" ? novel.isPublic : novel.work.is_public).sort(
      (a: NovelResult, b: NovelResult) =>
        convertToTimestamp(b.work.updated_at ?? "") - convertToTimestamp(a.work.updated_at ?? ""));

  return (
    <>
      <HomePc newNovels={ publicNovels.map((novel: NovelResult) => novel.work) } infomations={[]}/>
    </>
  );
}