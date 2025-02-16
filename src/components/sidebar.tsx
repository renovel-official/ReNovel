'use client';

import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { ReactElement, useState, useEffect } from "react";
import { toast } from "sonner";
import Option from "./ui/option";
import Link from "next/link";

const zen_kaku_gothic_new = Zen_Kaku_Gothic_New({ weight: "400" });

export default function Sidebar(): ReactElement {
    const [isLogin, setIsLogin] = useState<false | string>(false);
    const [genreOpen, setGenreOpen] = useState<boolean>(true);
    
    useEffect(() => {
        const checkLogin = (async (): Promise<false | string> => {
            const response: Response = await fetch('/api/auth');
            
            return false;
        });

        toast.success('index');
    }, []);

    return (
        <div className={`bg-gray-50 mt-2 mb-2 ml-2 mr-2 rounded-md px-4 py-4 text-center shadow-md h-full`}>
            <div className={`mt-1`}>
                <div className="text-gray-500">
                    全般
                </div>

                <div className={`${zen_kaku_gothic_new.className}`}>
                    <Option href={isLogin ? `/dashboard` : `/login`}>
                        { isLogin ? `Dashboard` : `Login` }
                    </Option>

                    <Option href="/search" className='mt-2'>
                        Search
                    </Option>

                    <Option href="/ranking" className='mt-2'>
                        Ranking
                    </Option>
                </div>

                <div 
                    className='text-gray-500 mt-2 items-center'
                    title={genreOpen ? 'クリックで閉じる' : 'クリックで開く'}
                    onClick={() => { setGenreOpen(!genreOpen); }} >
                    ジャンルから探す
                    {genreOpen ? <CloseOutlinedIcon /> : <ArrowDownwardOutlinedIcon />}
                </div>
                
                <div className={`${zen_kaku_gothic_new.className} ${genreOpen ? '' : 'hidden'}`}>
                    <Option href="/genre/fantasy" className='mt-2'>
                        異世界ファンタジー
                    </Option>

                    <Option href="/genre/action" className='mt-2'>
                        現代ファンタジー
                    </Option>

                    <Option href='/genre/sf' className='mt-2'>
                        SF
                    </Option>

                    <Option href="/genre/love" className='mt-2'>
                        恋愛
                    </Option>

                    <Option href='/genre/love_comedy' className='mt-2'>
                        ラブコメ
                    </Option>

                    <Option href='/genre' className='mt-2'>
                        その他
                    </Option>
                </div>

            </div>
        </div>
    );
}