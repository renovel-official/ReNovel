'use client';

import { ReactElement, Ref, useState, useEffect, useRef, FormEvent } from "react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import AutorenewIcon from '@mui/icons-material/Autorenew';
import ApiResponse from "@/interface/response";
import CheckIcon from '@mui/icons-material/Check';
import Input from "@/components/ui/input";
import Link from "next/link";


const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function RegisterPage(): ReactElement {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registHandler = (async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData: FormData = new FormData(e.currentTarget);
        const query: any = {
            name:     formData.get('name') as string,
            slug:     formData.get('slug') as string,
            email:    formData.get('email') as string,
            password: formData.get('password') as string,
        }

        try {
            const response: Response = await fetch('/api/v1/register', {
                method: 'POST',
                body: JSON.stringify(query),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: ApiResponse = await response.json();

            if (data.success) {
                toast.success('登録に成功しました');
                window.location.href = '/login';
            } else {
                throw new Error('used slug')
            }
        } catch (e: any) {
            console.error(e);
            toast.error(
                e.message == "used slug" ? 
                    'スラッグか、メールアドレスが既に使われています' : '登録に失敗しました'
            );


        }

        setIsLoading(false);
    });

    return (
        <>
        
        <div className="h-[15vh]"></div>

        <div className="flex">
            <div className="w-1/4"></div>
            <div className={`w-full mt-3`}>
                <div className={`text-3xl text-center ${kaisei_decol.className}`}>
                    アカウント登録
                </div>

                <form onSubmit={registHandler}>
                    <Input
                        type="text"
                        placeholder="ユーザー名"
                        name="name"
                    />
                    <Input
                        type="text"
                        placeholder="スラッグ"
                        name="slug"
                    />
                    <Input
                        type="email"
                        placeholder="メールアドレス"
                        name="email"
                    />
                    <Input
                        type="password"
                        placeholder="パスワード (4文字以上)"
                        name="password"
                    />

                    <button className={`mt-3 border rounded px-4 py-2 w-full text-center items-center ${ isLoading ? "bg-gray-300" : "bg-blue-400 hover:bg-blue-500" }`} disabled={ isLoading }>
                        アカウント登録{ isLoading ? <AutorenewIcon /> : <CheckIcon /> }
                    </button>

                    <Link href={`/login`}>
                        <div className="mt-3 text-blue-500 hover:text-blue-600 hover:underline">
                            ログインはこちら
                        </div>
                    </Link>
                </form>

                
            </div>
            <div className="w-1/4"></div>
        </div>

        </>
    )
}