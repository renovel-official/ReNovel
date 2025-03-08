'use client';

import { ReactElement, useState, FormEvent } from "react";
import { Kaisei_Decol } from "next/font/google";
import { toast } from "sonner";

import AutorenewIcon from '@mui/icons-material/Autorenew';
import ApiResponse from "@/interface/response";
import CheckIcon from '@mui/icons-material/Check';
import Input from "@/components/ui/input";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400", subsets: ["latin"] });

export default function LoginPage(): ReactElement {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginHandler = (async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData: FormData = new FormData(e.currentTarget);
        const query = {
            email:    formData.get('email') as string,
            password: formData.get('password') as string
        };

        try {
            const response: Response = await fetch('/api/v1/login', {
                method: 'POST',
                body: JSON.stringify(query),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: ApiResponse = await response.json();

            if (data.success) {
                toast.success('ログインに成功しました');
                window.location.href = '/';
            } else {
                throw new Error()
            }
        } catch (e: any) {
            console.error(e);
            toast.error('メールアドレスまたはパスワードが違います');
        }

        setIsLoading(false);
    });

    return (
        <>
        
        <div className="h-[20vh]"></div>

        <div className=" flex">
            <div className="w-1/4"></div>
            <div className={`w-full mt-3`}>
                <div className={`text-3xl text-center ${kaisei_decol.className}`}>
                    ログイン
                </div>

                <form onSubmit={loginHandler}>
                    <Input
                        type="email"
                        placeholder="メールアドレス"
                        name="email"
                    />
                    <Input
                        type="password"
                        placeholder="パスワード"
                        name="password"
                    />

                    <button className={`mt-3 border rounded px-4 py-2 w-full text-center items-center ${ isLoading ? "bg-gray-300" : "bg-blue-400 hover:bg-blue-500" }`} disabled={ isLoading }>
                        ログイン{ isLoading ? <AutorenewIcon /> : <CheckIcon /> }
                    </button>

                    <Link href={`/register`}>
                        <div className="mt-3 text-blue-500 hover:text-blue-600 hover:underline">
                            まだ登録していない人はこちら
                        </div>
                    </Link>
                </form>

                
            </div>
            <div className="w-1/4"></div>
        </div>

        </>
    )
}