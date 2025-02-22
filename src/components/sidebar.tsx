'use client';

import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { ReactElement, useState } from "react";
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Option from "./ui/option";

interface SidebarProps {
    login: boolean;
}

const zen_kaku_gothic_new = Zen_Kaku_Gothic_New({ weight: "400" });

export default function Sidebar({ login }: SidebarProps): ReactElement {
    const [genreOpen, setGenreOpen] = useState<boolean>(true);


    return (
        <div className={`bg-gray-50 mt-2 mb-2 ml- mr-2 rounded-md px-4 py-4 shadow-md h-full`}>
            <div className={`mt-1`}>
                <div className="text-gray-500 text-center">
                    全般
                </div>

                <div className={`${zen_kaku_gothic_new.className}`}>
                    <Option href={login ? `/dashboard` : `/login`}>
                        { login ? `ダッシュボード` : `ログイン` }
                    </Option>

                    <Option href="/search" className='mt-2'>
                        検索
                    </Option>

                    <Option href="/ranking" className='mt-2'>
                        ランキング
                    </Option>
                </div>

                <div 
                    className='text-gray-500 mt-2 items-center text-center'
                    title={genreOpen ? 'クリックで閉じる' : 'クリックで開く'}
                    onClick={() => { setGenreOpen(!genreOpen); }} >
                    { genreOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon /> }
                    ジャンルから探す
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