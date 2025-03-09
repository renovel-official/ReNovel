'use client';

import { ChartLine, UserRoundCheck, Eye, ArrowLeft, Mail, User as UserImg, UserRoundX, ThumbsUp, WrapText } from "lucide-react";
import { ReactElement, useState, useEffect, FormEvent, Ref, useRef } from "react";
import { Kaisei_Decol, Noto_Serif_JP } from "next/font/google";
import { NovelAuthor, NovelResult } from "@/interface/novel";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AddUserDialog from "@/components/dialog";
import SettingsIcon from '@mui/icons-material/Settings';
import ApiResponse from "@/interface/response";
import PersonIcon from '@mui/icons-material/Person';
import ButtonLink from "@/components/ui/buttonLink";
import NovelGenre from "@/types/genre";
import Episode from "@/interface/episode";
import NovelType from "@/types/novel";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Link from "next/link";
import User from "@/interface/user";

const kaisei_decol = Kaisei_Decol({ weight: "400", subsets: ["latin"] });
const noto_serif = Noto_Serif_JP({ subsets: ["latin"] });

interface Author {
    email: string;
    name: string;
    [key: string]: string; // これを追加！
}

export default function Novel(): ReactElement {
    const { work_id }: { work_id: string } = useParams();

    const idRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const textRef: Ref<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

    const [followOnMouse, setFollowOnMouse] = useState<boolean>(false);
    const [authorOnMouse, setAuthorOnMouse] = useState<{ email: string; point: boolean }[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<NovelGenre>("action");
    const [pointOnMouse, setPointOnMouse] = useState<boolean>(false);
    const [watchOnMouse, setWatchOnMouse] = useState<boolean>(false);
    const [novelType, setNovelType] = useState<NovelType>("long");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setAdmin] = useState<boolean>(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [novel, setNovel] = useState<NovelResult>();
    const [text, setText] = useState<string>("");

    useEffect(() => {
        const fetchNovel = (async () => {
            setIsLoading(true);
            const response: Response = await fetch(`/api/v3/works/${work_id}`);
            const data: ApiResponse = await response.json();

            if (data.success) {
                const novelResult: NovelResult = data.body;
                if (!novelResult.isAuthor) window.location.href = `/dashboard/works/`;
                setAdmin(novelResult.isAdmin ?? false);
                setNovel(novelResult);
                setSelectedGenre(novelResult.work.genre);
                setNovelType(novelResult.work.type ?? "long");
                setText(novelResult.work.text ?? "");

                const authorPromises = novelResult.authors.map(async (author) => {
                    const response = await fetch(`/api/v2/user?email=${author.email}`);
                    const data: ApiResponse = await response.json();
                    return { email: author.email, name: data.body.name };
                });

                const authorData = await Promise.all(authorPromises);
                setAuthors(authorData);
            } else {
                toast.error("小説の取得に失敗しました");
                window.location.href = `/dashboard/works/`;
            }
            setIsLoading(false);
        });

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
        const isPublic: string = formData.get('isPublic') as string;

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
                tags: tags.split(" "),
                is_public: isPublic == 'true' ? true : false
            })
        });
        const data: ApiResponse = await response.json();

        if (data.success) {
            toast.success("小説を更新しました");
        } else {
            toast.error("小説の更新に失敗しました");
        }
        setIsLoading(false);
    });

    const openAuthorDialog = (() => { 
        if (isAdmin) { 
            setModalOpen(true); 
        } else {
            toast.error('貴方にはユーザーを管理する権限がありません');
        }
    });

    const addAuthor = (async () => {
        const authorId: string | undefined = idRef.current?.value;

        if (!authorId) {
            toast.error('作者のIDを入力してください');
            return;
        }

        const response: Response = await fetch(`/api/v3/works/${work_id}/authors`, {
            method: 'POST',
            body: JSON.stringify({ slug: authorId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();

        if (!data.success) {
            if (data.message == "User not found") {
                toast.error('存在するユーザーのIDを入力してください');
            } else {
                toast.error('ユーザーの追加に失敗しました。少し時間を空けて再試行してください');
            }
            
            return;
        }
        const user: User = data.body as User;

        const authorsTemp = [...authors, { email: user.email, name: user.name }];
        setAuthors(authorsTemp);
        novel?.authors.push({ email: user.email, novel_id: work_id, is_admin: false, created_at: "" });

        setModalOpen(false);
        toast.info('ユーザーの追加に成功しました');
    });

    const deleteAuthor = (async (email: string) => {
        const author: NovelAuthor | undefined = novel?.authors.find((author: NovelAuthor) => author.email == email);

        if (author) {
            if (author.is_admin) {
                toast.error('そのユーザーは小説管理権限保持者のため削除できません');
                return;
            }

            const response = await fetch(`/api/v3/works/${work_id}/authors`, {
                method: 'DELETE',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: ApiResponse = await response.json();

            if (data.success) {
                const updatedAuthors = authors.filter((author) => author.email !== email);
                setAuthors(updatedAuthors);
                toast.success('ユーザーの削除に成功しました');
            } else {
                toast.error('ユーザーの削除に失敗しました');
                return;
            }
        } else {
            toast.error('ユーザーの取得に失敗しました');
            return;
        }
    });

    const updateShortEpisode = (async (autoUpdate: boolean = false) => {
        const response: Response = await fetch(`/api/v3/works/${work_id}`, {
            method: 'PATCH',
            body: JSON.stringify({ text: textRef.current?.value }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data: ApiResponse = await response.json();

        if (!autoUpdate){
            if (data.success) {
                toast.success('小説を更新しました');
            } else {
                toast.error('小説の更新に失敗しました');
            }
        }
        
        return
    });

    useEffect(() => {
        textRef.current?.addEventListener('input', (e) => {
            e.preventDefault();
            const length: number = textRef.current?.value.length ?? 0;
            console.log(length);
    
            if ((length % 100) === 0) {
                updateShortEpisode(true);
                return;
            }
        });
    });

    return (
        <>
            <title>{`${novel?.work.title ?? "小説"} / 管理 / ReNovel`}</title>

            <AddUserDialog 
                open={modalOpen} 
                idRef={idRef}
                onCancel={() => { setModalOpen(false); }} 
                onOk={addAuthor} 
            />

            <div className="flex items-center justify-between mr-5">
                <Link href={`/dashboard/works`}>
                    <div className="flex items-center hover:underline hover:text-blue-500">
                        <ArrowLeft />作品一覧
                    </div>
                </Link>

                <div className={`mt-3 text-3xl text-center ${kaisei_decol.className} flex-grow`}>
                    {novel?.work.title}
                </div>
            </div>

            <div className="mt-3">
                <div className={`w-full text-center items-center justify-center h-screen ${isLoading ? "" : "hidden"}`}>
                    <div className="spinner"></div>
                </div>

                <div className={`w-full ${isLoading ? "hidden" : ""}`}> { /* メイン画面 */}
                    <div className="flex">
                        <div className="w-1/3 px-1 py-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
                            <div className="border rounded px-2 py-2 h-full">
                                <div className={`text-2xl justify-center flex items-center ${noto_serif.className}`}>
                                    <ChartLine />アナリティクス
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

                                    <div className="mt-2 text-2xl flex items-center justify-center border rounded py-1" title="フォロワー数">
                                        <div onMouseOut={() => { setFollowOnMouse(!followOnMouse); }}>
                                            {followOnMouse ? <div className="ml-2 text-gray-500">フォロワー数</div> : <UserRoundCheck />}
                                        </div>

                                        <div className="ml-3">
                                            {novel?.follower}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-2xl flex items-center justify-center border rounded py-1" title="総ポイント">
                                        <div onMouseOut={() => { setPointOnMouse(!pointOnMouse); }}>
                                            { pointOnMouse ? <div className="ml-2 text-gray-500">総ポイント</div> : <SportsScoreIcon /> }
                                        </div>

                                        <div className="ml-3">
                                            { novel?.work.point }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 px-1 py-2">
                            <div className={`border rounded px-2 py-2 h-full ${isAdmin ? "" : "bg-gray-100"}`} title={isAdmin ? "編集可能" : "編集不可"}>
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
                                        onChange={(e) => { setSelectedGenre(e.target.value as NovelGenre) }}
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

                                    { novelType == 'short' ? (
                                        <>
                                        <select 
                                            name="isPublic" 
                                            defaultValue={novel?.work.is_public ? 'true' : 'false'}
                                            className="mt-3 border rounded px-3 py-2 w-full">
                                            <option value='true'>公開</option>
                                            <option value='false'>非公開</option>
                                        </select>
                                        </>
                                    ) : <></> }

                                    <button className={`mt-3 w-full rounded text-center py-2 border hover:bg-gray-100`} disabled={!isAdmin}>
                                        更新
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="w-1/3 px-1 py-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
                            <div className={`border rounded px-2 py-2 h-full ${isAdmin ? "" : "bg-gray-100"}`} title={isAdmin ? "編集可能" : "編集不可"}>
                                <div className={`text-2xl justify-center flex items-center ${noto_serif.className}`}>
                                    <PersonIcon />共同作者設定
                                </div>

                                {authors.map((author: Author, index: number) => {
                                    const selfAuthorOnMouseIndex: number = authorOnMouse.findIndex((authorData: { email: string, point: boolean }) => authorData.email == author.email);
                                    if (selfAuthorOnMouseIndex === -1) {
                                        authorOnMouse.push({ email: author.email, point: false });
                                    }

                                    return (
                                        <div key={index} className="flex w-full mt-2 rounded border px-4 py-2 justify-between" id={`author-${author.email}`}>
                                            <div id="mail" className="text-gray-600">
                                                {authorOnMouse[selfAuthorOnMouseIndex]?.point ? author.email : author.name}
                                            </div>

                                            <div className="flex text-gray-500">
                                                <button className=""
                                                    title={authorOnMouse[selfAuthorOnMouseIndex]?.point ? "名前を表示" : "メールアドレスを表示"}
                                                    onClick={() => {
                                                        const updatedAuthorOnMouse = [...authorOnMouse];
                                                        updatedAuthorOnMouse[selfAuthorOnMouseIndex].point = !updatedAuthorOnMouse[selfAuthorOnMouseIndex].point;
                                                        setAuthorOnMouse(updatedAuthorOnMouse);
                                                    }}
                                                >
                                                    {authorOnMouse[selfAuthorOnMouseIndex]?.point ? <UserImg /> : <Mail />}
                                                </button>

                                                <button title="ユーザーを削除" className="ml-2" onClick={() => { deleteAuthor(author.email) }} disabled={!isAdmin}>
                                                    <UserRoundX />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button className="cursor-pointer text-center w-full mt-2 rounded border px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={openAuthorDialog}>
                                    ユーザーを追加
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 px-1">
                        {novelType == "long" ? (
                            <>
                            <div className={`mt-3 text-center text-2xl ${noto_serif.className}`}>
                                エピソード一覧
                            </div>

                            <ButtonLink href={`/dashboard/works/${work_id}/new`} className="mt-2 hover:bg-gray-100">
                                新規エピソード投稿
                            </ButtonLink>

                            { novel?.episodes?.map((episode: Episode) => {
                                return (
                                    <ButtonLink 
                                        href={`/dashboard/works/${work_id}/${episode.slug}`} 
                                        className="mt-2 flex hover:bg-gray-100"
                                        key={episode.slug} >

                                        <div className="w-2/3 text-left">
                                            { episode.title }
                                        </div>
                                        
                                        <div className="flex w-1/3 justify-between">

                                            <div className="ml-1 flex items-center hover:bg-gray-200" title="文字数">
                                                <WrapText />

                                                <div className="ml-1">
                                                    { episode.text.length }
                                                </div>
                                            </div>

                                            <div className="ml-1 flex items-center hover:bg-gray-200" title="閲覧数">
                                                <Eye />
                                                <div className="ml-1">
                                                    { episode.view }
                                                </div>
                                            </div>

                                            <div className="ml-2 flex items-center hover:bg-gray-200" title="いいね">
                                                <ThumbsUp />

                                                <div className="ml-1">
                                                    { episode.view }
                                                </div>
                                            </div>
                                        </div>
                                    </ButtonLink>
                                );
                            }) }
                            </>
                        ) : (
                            <>
                            <textarea 
                                className="w-full rounded border px-4 py-2 h-[50vh]"
                                placeholder="本文を入力"
                                defaultValue={text}
                                ref={textRef}
                            />

                            <Button className="w-full hover:bg-blue-100" onClick={updateShortEpisode}>更新</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}