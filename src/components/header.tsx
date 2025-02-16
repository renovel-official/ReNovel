'use client';

import { ReactElement } from "react";
import Link from "next/link";

export default function Header(): ReactElement {
    return (
        <>
            <div className="text-gray-600 flex shadow-md mt-3 ml-3 mr-3 px-4 py-4 rounded-md bg-white justify-between items-center">
                <Link href={`/`}>
                    <div className="font-bold text-3xl text-blue-500 hover:text-blue-400">
                        ReNovel
                    </div>
                </Link>

                <div className="">
                    さぁ、貴方も内なる中二病を解放しましょう
                </div>

                <div className=""></div>
                
            </div>
        </>
    )
}