'use client';

import { ReactElement, useState, useEffect, useRef } from "react";
import { textToHtmlConvert } from "@/lib/convert";
import { getNowDateNumber } from "@/lib/date";
import { Star, BadgePlus } from "lucide-react";
import { NovelResult } from "@/interface/novel";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import StarBorderIcon from '@mui/icons-material/StarBorder';
import NovelGenre, { NovelGenreData } from "@/types/genre";
import StarIcon from '@mui/icons-material/Star';
import ApiResponse from "@/interface/response";
import ErrorIcon from '@mui/icons-material/Error';
import Button from "@/components/ui/button";
import Episode from "@/interface/episode";
import Link from "next/link";

export default function Work(): ReactElement {
    const { work_id }: { work_id: string } = useParams();

    const [novel, setNovel] = useState<NovelResult>();
    const [novelNotFound, setNovelNotFound] = useState<boolean>(false);
    const [publicEpisodes, setPublicEpisodes] = useState<Episode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [points, setPoints] = useState<boolean[]>([false, false, false, false, false]);
    const [login, setLogin] = useState<boolean>(true);
    const mainRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getNovel = async () => {
            const response: Response = await fetch(`/api/v3/works/${work_id}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novelData: NovelResult = data.body;
                setNovel(novelData);

                const nowDateNumber = await getNowDateNumber();
                const filteredEpisodes = (novelData.episodes ?? []).filter((episode: Episode) => {
                    return episode.public_date && episode.public_date <= nowDateNumber;
                });
                setPublicEpisodes(filteredEpisodes);
            } else {
                setNovelNotFound(true);
            }

            setIsLoading(false);
        };

        getNovel();
    }, [work_id]);

    useEffect(() => {
        if (mainRef.current && subRef.current) {
            subRef.current.style.height = `${mainRef.current.clientHeight}px`;
        }
    }, [novel]);

    useEffect(() => {
        const getNovelPoint = (async () => {
            const response: Response = await fetch(`/api/v3/works/${work_id}/rating`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const pointsData = points;
                for (let i = 0; i < data.body.point; i++) {
                    pointsData[i] = true;
                }
                setPoints(pointsData);
            }
        });

        getNovelPoint();
    }, []);

    useEffect(() => {
        const addReadCount = (async () => {
            const log: string[] = JSON.parse(localStorage.getItem('renovel_read_log') ?? "[]");

            if (novel?.work.type == "short" && !log.includes(work_id ?? "")) {
                const response = await fetch(`/api/v3/works/${work_id}/read`);
                log.push(work_id);
            }
        });

        addReadCount();
    }, []);

    const addPoint = (async () => {
        const response: Response = await fetch(`/api/v3/works/${work_id}/rating`, {
            method: 'POST'
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
            try {
                const point = Number(data.body.point);
                const pointsData = [false, false, false, false, false];

                for (let i = 0; i < point; i++) {
                    pointsData[i] = true;
                }

                setPoints(pointsData);
                toast.success('ポイントの付与に成功しました');
            } catch {
                toast.error('処理中にエラーが発生しました');
            }


        } else {
            if (data.message == "You not logged in") {
                toast.error('ログインしてから試行してください');
                setLogin(false);
            } else {
                toast.error('エラーが発生しました');
            }
        }
    });

    return (
        <>
            <title>{novel?.work.title ?? "名称未設定"} / ReNovel</title>

            <div className="mt-3">
                <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
                    <div className="spinner"></div>
                </div>

                <div className={isLoading ? "hidden" : ""}>
                    {novelNotFound ? (
                        <>
                            <div className="text-center text-2xl text-red-500 flex items-center justify-center">
                                <ErrorIcon />
                                <div className="ml-1">
                                    小説が見つかりませんでした。
                                </div>
                            </div>

                            <div className="mt-2 text-gray-600 text-center">
                                小説が存在しない、またはAPIの利用制限の可能性があります。<br />
                                2分まって再試行してください。
                            </div>
                        </>
                    ) : (
                        <div className="text-center items-center">
                            <h1 className="text-3xl font-bold">{novel?.work.title}</h1>

                            <div className="mt-3 flex px-2 py-2" id="info">
                                <div className="w-1/2 border rounded px-4 py-2 mr-1 ml-1" id="main" ref={mainRef}>
                                    <div className="text-orange-600 text-2xl font-bold hover:underline">
                                        {novel?.work.phrase}
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex border rounded text-center items-center">
                                            <div className="w-1/2 px-2 py-2 border-r">評価ポイント</div>
                                            <div className="w-1/2">{novel?.work.point}</div>
                                        </div>

                                        <div className="flex border rounded text-center items-center">
                                            <div className="w-1/2 px-2 py-2 border-r">ジャンル</div>
                                            <div className="w-1/2">{NovelGenreData[novel?.work.genre as NovelGenre]}</div>
                                        </div>

                                        <div className="flex border rounded text-center items-center">
                                            <div className="w-1/2 px-2 py-2 border-r">短編 / 連載</div>
                                            <div className="w-1/2">{novel?.work.type == "long" ? "連載" : "短編"}</div>
                                        </div>

                                        {novel?.work.type == "long" ? (
                                            <div className="flex border rounded text-center items-center">
                                                <div className="w-1/2 px-2 py-2 border-r">公開エピソード数 / 非公開エピソード数</div>
                                                <div className="w-1/2">{publicEpisodes.length} / {novel.episodes?.length}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="w-1/2 border rounded px-4 py-2 ml-1 mr-1 text-gray-700 overflow-auto" id="sub" ref={subRef}>
                                    <div className="text-gray-600 text-2xl font-bold hover:underline">
                                        簡単紹介
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: textToHtmlConvert(novel?.work.description ?? "") }} className="mt-3" />
                                </div>
                            </div>

                            <div className="mt-2 w-full px-2 py-2">
                                <div className="ml-1 mr-1 border rounded px-4 py-2">
                                    <div className="text-3xl font-bold">
                                        操作
                                    </div>

                                    <div className="flex mt-2">
                                        <div className="w-1/2 border-r px-2 py-2">
                                            <div className="text-2xl font-bold">
                                                フォロー
                                            </div>

                                            <button className="w-full border px-4 py-2 rounded mt-3">
                                                フォロー
                                            </button>
                                        </div>

                                        <div className="w-1/2 border-r px-2 py-2">
                                            <div className="text-2xl font-bold">
                                                評価
                                            </div>

                                            <div className="flex justify-center mt-3 items-center ">
                                                {points[0] ? <StarIcon style={{ fontSize: "50px" }} /> : <StarBorderIcon style={{ fontSize: "50px" }} />}
                                                {points[1] ? <StarIcon style={{ fontSize: "50px" }} /> : <StarBorderIcon style={{ fontSize: "50px" }} />}
                                                {points[2] ? <StarIcon style={{ fontSize: "50px" }} /> : <StarBorderIcon style={{ fontSize: "50px" }} />}
                                                {points[3] ? <StarIcon style={{ fontSize: "50px" }} /> : <StarBorderIcon style={{ fontSize: "50px" }} />}
                                                {points[4] ? <StarIcon style={{ fontSize: "50px" }} /> : <StarBorderIcon style={{ fontSize: "50px" }} />}
                                            </div>

                                            <div className="mt-2 flex justify-center hover:text-gray-500">
                                                <button title="評価する" className="text-2xl" onClick={() => { addPoint(); }} disabled={!login}>
                                                    <BadgePlus size={30} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {novel?.work.type === "long" ? (
                                <div className="mt-3 text-center">
                                    <div className="text-2xl custom-text font-bold">
                                        エピソード一覧
                                    </div>

                                    <div className="flex justify-center mt-3">
                                        <div id="episodes" className="w-3/4">
                                            {publicEpisodes.map((episode: Episode) => (
                                                <Link href={`/works/${work_id}/episodes/${episode.slug}`} className="mt-1 flex justify-between px-4 py-2 border rounded text-blue-500 hover:underline hover:text-blur-600" key={episode.slug}>
                                                    {episode.title}

                                                    <div className="text-gray-600">
                                                        最終更新日: {episode.updated_at}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mt-3 text-2xl custom-text font-bold">
                                        本文
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <div className="w-3/4 px-2 py-2 custom-text text-left">
                                            <div dangerouslySetInnerHTML={{ __html: textToHtmlConvert(novel?.work.text ?? "") }} className="mt-3" />
                                        </div>
                                    </div>
                                </>

                            )}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}