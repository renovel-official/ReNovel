'use client';

import { ReactElement, useState, useEffect } from "react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import ApiResponse from "@/interface/response";
import ButtonLink from "@/components/ui/buttonLink";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function Dashboard(): ReactElement {
    const [username, setUsername] = useState<string>("unknown");
    const [userslug, setUserslug] = useState<string>("unknown");

    useEffect(() => {
        const getUserinfo = (async () => {
            const response: Response = await fetch('/api/v1/auth');
            try {
                const data: ApiResponse = await response.json();

                if (data.success) {
                    setUsername(data.body.name);
                    setUserslug(data.body.slug);
                    return;
                } else {
                    toast.error('データの取得に失敗しました。リロードしてください');
                }
            } catch {
                toast.error('データの取得に失敗しました。リロードしてください');
            }
            
            
        });

        getUserinfo();
    });
    
    return (
        <>
        <div className={`mt-3 text-3xl text-center ${kaisei_decol.className}`}>
            ダッシュボード
        </div>

        <div className="mt-5 flex px-2">
            <div className="w-1/3 px-2 py-2 border mr-2 rounded items-center">
                <div className="text-2xl text-center">
                    ユーザー情報変更
                </div>

                <Input
                    placeholder="name"
                    value={username}
                    name="name"
                    id="name"
                />

                <Input 
                    placeholder="slug"
                    name="slug"
                    id="slug"
                />

                <Input 
                    type="password"
                    placeholder="password"
                    name="password"
                    id="password"
                />

                <div className="mt-5 text-center">
                    <Button className="w-full hover:bg-blue-100">
                        変更
                    </Button>
                </div>

                <div className="mt-3 text-center text-gray-500">
                    詳細はアカウント設定から
                </div>
                
            </div>

            <div className="flex w-full">
                <div className="w-1/2 px-2 py-2 border mr-1 rounded">

                    <div className="text-2xl text-center ">
                        作品パネル
                    </div>

                    <div className="mt-2">
                        <div className="text-[2.5vh] text-center">
                            小説
                        </div>

                        <ButtonLink className="mt-3 w-full hover:bg-gray-100" href="/dashboard/novels/new">
                            新規作品を作成
                        </ButtonLink>

                        <ButtonLink className="mt-3 w-full hover:bg-gray-100" href="/dashboard/novels">
                            作品を管理
                        </ButtonLink>

                        <div className="mt-3 text-[2.5vh] text-center">
                            ブログ
                        </div>

                        <ButtonLink className="mt-3 w-full hover:bg-gray-100" href="/dashboard/blogs/new">
                            ブログを新規投稿
                        </ButtonLink>

                        <ButtonLink className="mt-3 w-full hover:bg-gray-100" href="/dashboard/blogs">
                            ブログを管理
                        </ButtonLink>
                    </div>
                    
                </div>

                <div className="w-1/2 px-2 py-2 border ml-1 rounded">

                    <div className="text-2xl text-center">
                        フォローパネル
                    </div>
                    
                    <ButtonLink href="">
                        
                    </ButtonLink>
                </div>
            </div>

            
        </div>

        <div className="mt-3 px-2 py-2">
            <div className="border border-red-500 px-2 rounded py-2">
                <div className="text-center text-2xl">
                    アカウント設定
                </div>

                <ButtonLink href="/dashboard/account" className="mt-3 w-full text-red-600 hover:bg-red-100">
                    アカウント設定
                </ButtonLink>

                <ButtonLink href="/dashboard/account/delete" className="mt-3 w-full text-red-600 hover:bg-red-100">
                    アカウント削除
                </ButtonLink>

                <ButtonLink href="/dashboard/logout" className="mt-3 w-full text-red-600 hover:bg-red-100">
                    ログアウト
                </ButtonLink>
            </div>
        </div>
        </>
    )
}