import { getNovelFromId } from "@/lib/novel";
import authUser from "@/lib/auth";



export default async function Work(context: { params: Promise<{ work_id: string }> }) {
    const params = await context.params;
    const workId: string = params.work_id;
    const login = await authUser();
}