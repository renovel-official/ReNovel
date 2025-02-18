'use client';

import { ReactElement, Ref, useState, useEffect, useRef } from "react";
import { Kaisei_Decol } from "next/font/google";

import ApiResponse from "@/interface/response";
import CheckIcon from '@mui/icons-material/Check';
import Input from "@/components/ui/input";
import Link from "next/link";

const kaisei_decol = Kaisei_Decol({ weight: "400" });

export default function LoginPage(): ReactElement {
    const mailRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const passwordRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    return (
        <>
        
        <div className="h-[20vh]"></div>

        <div className=" flex">
            <div className="w-1/4"></div>
            <div className={`w-full mt-3`}>
                <div className={`text-3xl text-center ${kaisei_decol.className}`}>
                    ログイン
                </div>

                <form action="">
                    <Input
                        type="email"
                        placeholder="メールアドレス"
                        ref={mailRef}
                    />
                    <Input
                        type="password"
                        placeholder="パスワード"
                        ref={passwordRef}
                    />

                    <button className="mt-3 border rounded px-4 py-2 w-full text-center bg-blue-400 hover:bg-blue-500">
                        ログイン<CheckIcon />
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