'use client';

import { ReactElement, useState, useEffect, useRef, Ref } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { NovelResult } from "@/interface/novel";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Novel(): ReactElement {
    const { work_id }: { work_id: string } = useParams();

    const titleRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const textRef: Ref<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

    const [textLength, setTextLength] = useState<number>(0);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [novel, setNovel] = useState<NovelResult>();

    useEffect(() => {
        const fetchNovel = async () => {
            setIsLoading(true);
            const response: Response = await fetch(`/api/v3/works/${work_id}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novelResult: NovelResult = data.body;
                setNovel(novelResult);
                if (!novelResult.isAuthor) window.location.href = `/dashboard/works/`;
                if (novelResult.work.type == "short") window.location.href = `/dashboard/works/${work_id}`;
            } else {
                toast.error("小説の取得に失敗しました");
                window.location.href = `/dashboard/works/`;
            }
            setIsLoading(false);
        };

        fetchNovel();
    }, []);

    const handleSave = (async () => {
        const title: string | undefined = titleRef.current?.value;
        const text: string | undefined = textRef.current?.value;

        if (title && text) {
            const response = await fetch(`/api/v3/works/${work_id}`, {
                method: 'POST',
                body: JSON.stringify({ title, text }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: ApiResponse = await response.json();

            if (data.success) {
                window.location.href = `/dashboard/works/${work_id}/${data.body.episode_id}`;
                toast.success("エピソードが保存されました");
            } else {
                toast.error('エピソードの保存に失敗しました');
            }
            
        } else {
            toast.error('タイトルとエピソード両方入力してください');
        }

        return;
    });

    textRef.current?.addEventListener('input', () => {
        const text: string = (textRef.current?.value ?? "").replaceAll(' ', '').replaceAll('\n', '');
        setTextLength(text.length ?? 0);
    });

    return (
        <>
            <title>{`${novel?.work.title ?? "小説"} / 新規エピソード投稿 / ReNovel`}</title>

            <div className="mt-3">
                <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
                    <div className="spinner"></div>
                </div>

                <div className={`mt-5 text-center`}>
                    <Link href={`/dashboard/works/${work_id}`}>
                        <div className="flex items-centerhover:underline hover:text-blue-500">
                            <ArrowLeft />{ novel?.work.title } へ戻る
                        </div>
                    </Link>

                    <input 
                        type="text"
                        className="border-b w-1/2 px-2 py-2 text-2xl focus:outline-none focus:border-black"
                        placeholder="エピソードタイトルを入力"
                        ref={titleRef}
                    /><br />

                    <textarea
                        className="mt-5 w-3/4 px-2 py-2 h-[calc(100vh-15rem)] custom-text focus:outline-none"
                        placeholder="本文を入力"
                        ref={textRef}
                    />
                    
                    <div className="text-gray-500">
                        { textLength } 文字
                    </div>
                    
                    <br />

                    <Button 
                        className={`flex items-center justify-center mt-5 px-4 py-2 w-full rounded ${isSaving ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                        disbled={isSaving}
                        onClick={handleSave}
                    >
                        保存 { isSaving ? <Loader className="ml-1" /> : '' }
                    </Button>
                </div>
            </div>
        </>
    );
}