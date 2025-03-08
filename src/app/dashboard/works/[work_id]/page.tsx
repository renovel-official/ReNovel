'use client';

import { ReactElement, useState, useEffect, FormEvent } from "react";
import { Activity, UserRoundCheck, Eye } from "lucide-react";
import { Kaisei_Decol, Noto_Serif_JP } from "next/font/google";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Novel, { NovelAuthor, NovelResult } from "@/interface/novel";
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import SettingsIcon from '@mui/icons-material/Settings';
import ApiResponse from "@/interface/response";
import PersonIcon from '@mui/icons-material/Person';
import ButtonLink from "@/components/ui/buttonLink";
import NovelGenre from "@/types/genre";
import Episode from "@/interface/episode";
import NovelType from "@/types/novel";
import Input from "@/components/ui/input";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400", subsets: ["latin"] });
const noto_serif = Noto_Serif_JP({ subsets: ["latin"] });

export default function Novels(): ReactElement {
    const { work_id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [novel, setNovel] = useState<NovelResult>();
    const [isAdmin, setAdmin] = useState<boolean>(false);
    const [watchOnMouse, setWatchOnMouse] = useState<boolean>(false);
    const [followOnMouse, setFollowOnMouse] = useState<boolean>(false);
    const [pointOnMouse, setPointOnMouse] = useState<boolean>(false);
    const [selectedGenre, setSelectedGenre] = useState<NovelGenre>("action");
    const [novelType, setNovelType] = useState<NovelType>("long");


    useEffect(() => {
        const fetchNovel = async () => {
            setIsLoading(true);
            const response: Response = await fetch(`/api/v3/works/${work_id}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novelResult: NovelResult = data.body;
                if (!novelResult.isAuthor) window.location.href = `/dashboard/works/`;
                setAdmin(novelResult.isAdmin ?? false);
                setNovel(data.body);
                setSelectedGenre(novelResult.work.genre);
                setNovelType(novelResult.work.type ?? "long");
            } else {
                toast.error("小説の取得に失敗しました");
                window.location.href = `/dashboard/works/`;
            }
            setIsLoading(false);
        };

        fetchNovel();
    }, []);

    const updateNovel = (async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData: FormData = new FormData(e.currentTarget);
        const title: string = formData.get("title") as string;
        const phrase: string = formData.get("phrase") as string;
        const description: string = formData.get("description") as string;
        const genre: NovelGenre = formData.get("genre") as NovelGenre;
        const tags: string = formData.get("tags") as string;

        const response: Response = await fetch(`/api/v3/works/${work_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                phrase,
                description,
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
            <title>{`${novel?.work.title ?? "小説"} / 管理 / ReNovel`}</title>



            <div className={`mt-3 text-3xl text-center ${kaisei_decol.className}`}>
                {novel?.work.title}
            </div>

            <div className="flex mt-3">
                <div className="w-"></div>

                <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
                    <div className="spinner"></div>
                </div>

                <div className={`w-full ${isLoading ? "hidden" : ""}`}> { /* メイン画面 */}
                    <div className="flex">
                        <div className="w-1/3 px-1 py-2 ">
                            <div className="border rounded px-2 py-2">
                                <div className={`text-2xl justify-center flex items-center ${noto_serif.className}`}>
                                    <Activity />アナリティクス
                                </div>

                                <div className="w-full mt-3 text-center">
                                    <div className="text-2xl flex items-center justify-center border rounded py-1" title="閲覧数">
                                        <div onMouseOut={() => { setWatchOnMouse(!watchOnMouse); }}>
                                            {watchOnMouse ? <div className="ml-2 text-gray-500">閲覧数</div> : <Eye />}
                                        </div>

                                        <div className="ml-3">
                                            {novel?.view}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-2xl flex items-center justify-center border rounded py-1" title="閲覧数">
                                        <div onMouseOut={() => { setFollowOnMouse(!followOnMouse); }}>
                                            {followOnMouse ? <div className="ml-2 text-gray-500">フォロワー数</div> : <UserRoundCheck />}
                                        </div>

                                        <div className="ml-3">
                                            {novel?.follower}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-2xl flex items-center justify-center border rounded py-1" title="閲覧数">
                                        <div onMouseOut={() => { setPointOnMouse(!pointOnMouse); }}>
                                            {pointOnMouse ? <div className="ml-2 text-gray-500">総ポイント</div> : <SportsScoreIcon />}
                                        </div>

                                        <div className="ml-3">
                                            {novel?.work.point}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 px-1 py-2">
                            <div className={`border rounded px-2 py-2 ${isAdmin ? "" : "bg-gray-100"}`} title={isAdmin ? "編集可能" : "編集不可"}>
                                <div className={`text-2xl justify-center flex items-center ${noto_serif.className}`}>
                                    <SettingsIcon />小説設定
                                </div>

                                <form onSubmit={updateNovel}>
                                    <Input
                                        name="title"
                                        value={novel?.work.title}
                                        placeholder="タイトル"
                                        readOnly={!isAdmin}
                                    />

                                    <Input
                                        name="phrase"
                                        value={novel?.work.phrase}
                                        placeholder="一言紹介"
                                        readOnly={!isAdmin}
                                    />

                                    <textarea
                                        name="description"
                                        className="w-full mt-3 rounded border px-4 py-2"
                                        placeholder="説明"
                                        defaultValue={novel?.work.description}
                                        readOnly={!isAdmin}
                                    />

                                    <select 
                                        name="genre" 
                                        className="mt-3 border rounded px-3 py-2 w-full" 
                                        value={selectedGenre} 
                                        onChange={(e) => {setSelectedGenre(e.target.value as NovelGenre)}}
                                        disabled={!isAdmin}>
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
                                        readOnly={!isAdmin}
                                    />

                                    <button className={`mt-3 w-full rounded text-center py-2 border hover:bg-gray-100`} disabled={!isAdmin}>
                                        更新
                                    </button>
                                </form>

                                
                            </div>
                        </div>
                        <div className="w-1/3 px-1 py-2">
                            <div className={`border rounded px-2 py-2 ${isAdmin ? "" : "bg-gray-100"}`} title={isAdmin ? "編集可能" : "編集不可"}>
                                <div className={`text-2xl justify-center flex items-center ${noto_serif.className}`}>
                                    <PersonIcon />共同作者設定
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        { novelType == "long" ? (
                            <>
                            </>
                        ) : (
                            <>
                            </>
                        ) }
                    </div>
                </div>
                <div className="w-"></div>
            </div>


        </>
    );
}