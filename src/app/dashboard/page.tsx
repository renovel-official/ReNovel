import { getUserFromEmail } from "@/lib/user";
import { redirect } from "next/navigation";

import DashboardPc from "@/components/screen/pc/dashboard/dashboard";
import authUser from "@/lib/auth";
import User from "@/interface/user";
import { metadata } from "../layout";



export default async function Dashboard() {
    const login = await authUser();
    const user: User | undefined = await getUserFromEmail(login ? login : "");
    metadata.title = "Dashboard / ReNovel";

    if (user) {
        return (
            <DashboardPc 
                username={user.name}
                userslug={user.slug}
            />
        )
    } else {
        redirect('/login')
    }
}