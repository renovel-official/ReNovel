import { getNovelsFromAuthor } from "@/lib/novel";
import { NovelResult } from "@/interface/novel";
import DashboardWorksPc from "@/components/screen/pc/dashboard/works";
import authUser from "@/lib/auth";


export default async function Work() {
    const login = await authUser();
    const novels: NovelResult[] = await getNovelsFromAuthor(login ? login : "") ?? [];
    const sortedNovels = novels.sort((a, b) => (b.work.point ?? 0) - (a.work.point ?? 0));

    return (
        <DashboardWorksPc novels={sortedNovels} />
    )
}