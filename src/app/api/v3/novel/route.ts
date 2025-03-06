'use server';

import { getNovelsAll, getNovelFromId, getNovelsFromAuthor, getNovelsFromGenre, getNovelsFromTags } from "@/lib/novel";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import NovelGenre from "@/types/genre";
import authUser from "@/lib/auth";
import Novel from "@/interface/novel";

interface NovelAuthor {
    id: number;
    email: string;
    novel_id: string;
    is_admin: boolean;
    created_at: string;
}

interface NovelResult {
    work: Novel;
    authors: NovelAuthor[];
}

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const workId: string = searchParams.get("work") as string;
    const authorEmail: string = searchParams.get("author") as string;
    const genre: NovelGenre = searchParams.get("genre") as NovelGenre;
    const tags: string[] = (searchParams.get("tags") as string).split(" ");
    const novels: NovelResult[] = [];

    if (workId) {
        novels.push(await getNovelFromId(workId) as NovelResult);
    } else if (authorEmail) {
        novels.push(... await getNovelsFromAuthor(authorEmail) as NovelResult[]);
    } else if (genre) {
        novels.push(... await getNovelsFromGenre(genre) as NovelResult[]);
    } else if (tags) {
        novels.push(... await getNovelsFromTags(tags) as NovelResult[]);
    } else {
        novels.push(... await getNovelsAll() as NovelResult[]);
    }

    return apiResponse(
        true,
        'Success to get novels',
        novels
    );
}