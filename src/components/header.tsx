'use client';

import { ReactElement, useState } from "react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";

export default function Header(): ReactElement {
    const [hasNotifications, setHasNotifications] = useState<boolean>(false);
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

                <div className="">
                    { hasNotifications ? <NotificationsIcon /> : <NotificationsNoneIcon /> }
                </div>
                
            </div>
        </>
    )
}