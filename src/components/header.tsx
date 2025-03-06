'use client';

import { ReactElement } from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    login: boolean;
    hasNotifications: boolean;
}

export default function Header({ login, hasNotifications }: HeaderProps): ReactElement {
    return (
        <>
            <div className="text-gray-600 flex shadow-md mt-3 ml-3 mr-3 px-4 py-4 rounded-md bg-white justify-between items-center">
                <Link href={`/`} className="flex items-center hover:underline">
                    <Image src={"/icon.png"} width={50} height={50} alt="" title={`logo`}/>
                    <div className="font-bold text-3xl text-black">
                        ReNovel
                    </div>
                </Link>

                <div className="">
                    さぁ、貴方も内なる中二病を解放しましょう
                </div>

                <div className="items-center flex">
                    <form action="/search" method="get" className="border rounded px-2 py-2">
                        <input type="text" name="q"placeholder="小説を検索" />
                        <button type="submit">
                            <SearchIcon />
                        </button>
                    </form>
                    <div className="ml-3">
                        { 
                            login ? 
                                <Link href={`/dashboard/notfications`}>
                                    { 
                                        hasNotifications ? 
                                            <NotificationsIcon /> : 
                                            <NotificationsNoneIcon /> 
                                    }
                                </Link> : 
                                
                                <Link href={`/login`}>
                                    <LoginIcon />
                                </Link> 
                        }
                    </div>
                </div>
                
            </div>
        </>
    )
}