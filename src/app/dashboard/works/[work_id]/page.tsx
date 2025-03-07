'use client';

import { ReactElement, useState, useEffect } from "react";
import { Activity, UserRoundCheck } from "lucide-react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import OutboundIcon from '@mui/icons-material/Outbound';
import ApiResponse from "@/interface/response";
import ButtonLink from "@/components/ui/buttonLink";
import Novel, { NovelResult } from "@/interface/novel";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function Novels(): ReactElement {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [novels, setNovels] = useState<NovelResult[]>([]);
    
    useEffect(() => {
        const fetchNovels = async () => {
            setIsLoading(true);
            const response: Response = await fetch("/api/v3/works?author=me");
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novels = (data.body as NovelResult[]).sort((a, b) => (b.view ?? 0) - (a.view ?? 0))
                setNovels(data.body);
            } else {
                toast.error("小説の取得に失敗しました");
            }
            setIsLoading(false);
        };
        
        fetchNovels();
    }, []);

    return (
        <>
        <title>小説を管理 / ReNovel</title>


        <div className={`mt-3 text-3xl text-center ${kaisei_decol.className}`}>
            小説管理
        </div>


        <div className="mt-6">
            <ButtonLink href="/dashboard/works/new" className="hover:bg-gray-100">
                新規小説作成
            </ButtonLink>
        </div>

        <div className="flex mt-3">
            <div className="w-1/5"></div>
            <div className="w-full">
                {novels.map((novel, index) => {
                    const work: Novel = novel.work;

                    return (
                        <Link href={`/dashboard/works/${work.slug}`} key={`novel-${index}`} className="">
                            <div className="mt-3 border p-5 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-100">
                                <div className="flex items-center">
                                    <div className="w-1/2">
                                        <div className="text-lg font-bold text-indigo-600 mb-1">
                                            { work.title }
                                        </div>
                                    
                                        <div className="text-[1.5rm] text-gray-500 ml-3 mb-1">
                                            { work.phrase }
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex items-centertext-1.5xl font-bold text-orange-500" title="フォロワー数">
                                            <UserRoundCheck /> 
                                            <div className="ml-1">
                                                { novel.follower }
                                            </div>
                                        </div>

                                        <div className="text-1.5xl font-bold text-orange-500" title="総ポイント">
                                            <OutboundIcon /> { work.point }
                                        </div>

                                        <div className="flex items-center text-1.5xl font-bold text-orange-500" title="総閲覧数">
                                            <Activity /> 
                                            <div className="ml-1">
                                                { novel.view }
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            最終更新日: { work.updated_at }
                                        </div>
                                    </div>

                                    

                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="w-1/5"></div>
        </div>
        

        </>
    );
}