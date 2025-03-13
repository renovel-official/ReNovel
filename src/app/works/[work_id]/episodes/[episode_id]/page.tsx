'use client';

import { ReactElement, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { NovelResult } from "@/interface/novel";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Head from 'next/head';

import ApiResponse from "@/interface/response";
import Episode from "@/interface/episode";
import Link from "next/link";
import { textToHtmlConvert } from "@/lib/convert";
import { getNowDateNumber } from "@/lib/date";

export default function Novel(): ReactElement {
    const { work_id, episode_id } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [episode, setEpisode] = useState<Episode>();
    const [novel, setNovel] = useState<NovelResult>();
    const [lastEpisodeId, setLastEpisodeId] = useState<string | null>(null);
    const [nextEpisodeId, setNextEpisodeId] = useState<string | null>(null);

    useEffect(() => {
        const fetchNovel = async () => {
            setIsLoading(true);
            const response: Response = await fetch(`/api/v3/works/${work_id}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novelResult: NovelResult = data.body;
                const thisEpisodeIndex: number | undefined = novelResult.episodes?.findIndex((episode: Episode) => episode.slug == episode_id);
                console.log(thisEpisodeIndex);
                if (thisEpisodeIndex != undefined) {
                    const thisEpisode: Episode | undefined = (novelResult.episodes ?? [])[thisEpisodeIndex];

                    if (!thisEpisode) window.location.href = `/works/${work_id}`;
                    if (novelResult.work.type == "short") window.location.href = `/works/${work_id}`;
                    const nowDate = await getNowDateNumber();

                    if (thisEpisodeIndex > 0) {
                        const lastEpisodeIndex = thisEpisodeIndex - 1;
                        const lastEpisode: Episode = (novelResult.episodes ?? [])[lastEpisodeIndex];

                        if (lastEpisode && lastEpisode.public_date && lastEpisode.public_date >= nowDate) setLastEpisodeId(lastEpisode.slug);
                    }

                    if (thisEpisodeIndex < (novelResult.episodes ?? []).length) {
                        const nextEpisodeIndex = thisEpisodeIndex + 1;
                        const nextEpisode: Episode | undefined = (novelResult.episodes ?? [])[nextEpisodeIndex];

                        if (nextEpisode && nextEpisode.public_date && nextEpisode.public_date >= nowDate) setLastEpisodeId(nextEpisode.slug);
                    }
    
                    setNovel(novelResult);
                    setEpisode(thisEpisode ?? {} as Episode);
                    setIsLoading(false);
                }
                
            } else {
                toast.error("小説の取得に失敗しました");
                window.location.href = `/works/${work_id}`;
            }
        };

        fetchNovel();
    }, [work_id, episode_id]);

    return (
        <>
            <Head>
                <title>{`${novel?.work.title ?? "小説"} / ${episode?.title ?? "エピソード"} / ReNovel`}</title>
            </Head>

            <div className="mt-3 w-full text-center">
                <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
                    <div className="spinner"></div>
                </div>

                {!isLoading && (
                    <>
                    { lastEpisodeId && (
                        <Link href={`/works/${work_id}/${lastEpisodeId}`}>
                            <div className="w-full bg-gray-100 text-center text-2xl px-4 py-4 hover:bg-gray-300">
                                前へ
                            </div>
                        </Link>
                    ) }

                    <div className="mt-3 text-center flex items-center justify-center">
                        <Link href={`/works/${work_id}`}>
                            <div className="flex items-center hover:underline hover:text-blue-500">
                                <ArrowLeft /> {novel?.work.title} へ戻る
                            </div>
                        </Link>
                    </div>

                    <div className="mt-2 px-2 py-2 text-2xl text-center flex justify-center">
                        {episode?.title}    
                    </div>

                    <div className="mt-5 text-left w-2/3 px-2 py-2 custom-text mx-auto">
                        <div dangerouslySetInnerHTML={{ __html: textToHtmlConvert(episode?.text ?? "") }} />
                    </div>

                    
                    { nextEpisodeId && (
                        <Link href={`/works/${work_id}/${nextEpisodeId}`}>
                            <div className="w-full bg-gray-100 text-center text-2xl px-4 py-4 hover:bg-gray-300">
                                次へ
                            </div>
                        </Link>
                    ) }
                    </>
                )}
            </div>
        </>
    );
}