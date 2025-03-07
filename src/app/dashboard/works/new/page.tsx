'use client';

import { ReactElement, Ref, useRef, useState, useEffect, FormEvent } from "react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import UpdateIcon from '@mui/icons-material/Update';
import NovelGenre from "@/types/genre";
import novelType from "@/types/novel";
import SyncIcon from '@mui/icons-material/Sync';
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";


const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function CreateNovelPage(): ReactElement {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createNovel = (async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData: FormData = new FormData(e.currentTarget);
        const title: string = formData.get("title") as string;
        const phrase: string = formData.get("phrase") as string;
        const description: string = formData.get("description") as string;
        const novelType: novelType = formData.get("novelType") as novelType;
        const genre: NovelGenre = formData.get("genre") as NovelGenre;
        const tags: string = formData.get("tags") as string;

        const response: Response = await fetch("/api/v3/works", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                phrase,
                description,
                type: novelType,
                genre,
                tags: tags.split(" ")
            })
        });
        const data: ApiResponse = await response.json();

        if (data.success) {
            toast.success("小説を作成しました");
            window.location.href = `/dashboard/works/${data.body.slug}`;
        } else {
            toast.error("小説の作成に失敗しました");
        }
        setIsLoading(false);
    });

    return (
        <>
        <title>新規小説作成 / ReNovel</title>

        <div className={`mt-3 text-3xl text-center ${kaisei_decol.className}`}>
            小説作成
        </div>
        <form onSubmit={createNovel} className="mt-3">
            <Input
                type="text"
                name="title"
                placeholder="タイトル"
            />

            <Input
                type="text"
                name="phrase"
                placeholder="一言紹介"
            />

            <textarea
                className="w-full border rounded mt-3 px-3 py-2 h-[30vh]"
                name="description"
                placeholder="説明"
            />

            <select name="novelType" className="mt-3 border rounded px-3 py-2 w-full">
                <option value="long">連載</option>
                <option value="short">短編</option>
            </select>

            <select name="genre" className="mt-3 border rounded px-3 py-2 w-full">
                <option value="action">現代ファンタジー</option>
                <option value="fantasy">異世界ファンタジー</option>
                <option value="love">現代恋愛</option>
                <option value="fantasy-love">異世界恋愛</option>
                <option value="sf">SF</option>
                <option value="horror">ホラー</option>
                <option value="mystery">ミステリー</option>
                <option value="adventure">冒険</option>
                <option value="comedy">コメディ</option>
                <option value="thriller">スリラー</option>
                <option value="history">歴史</option>
                <option value="other">その他</option>
            </select>

            <Input
                type="text"
                name="tags"
                placeholder="タグ 半角スペースで区切ります ハッシュタグはいりません"
                required={false}
            />

            <Button
                className={`mt-3 w-full ${isLoading ? "bg-gray-100" : "hover:bg-blue-100"}`}
                disbled={isLoading}
            >
                作成 {isLoading ? <UpdateIcon />: <SyncIcon />}
            </Button>
        </form>
        </>
    );
}