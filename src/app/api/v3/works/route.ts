'use server';

import { getNovelsFromQuery, getNovelsAll, getNovelFromId, getNovelsFromAuthor, getNovelsFromGenre, getNovelsFromTags } from "@/lib/novel";

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
    const workId: string | null = searchParams.get("work");
    const query = searchParams.get("q");
    const authorEmail: string | null = searchParams.get("author");
    const genre: string | null = searchParams.get("genre");
    const tags: string | null = searchParams.get("tags");
    const novels: NovelResult[] = [];

    if (workId) {
        const novel = await getNovelFromId(workId);
        if (novel) novels.push(novel);
    } else if (query) {
        const searchNovels = await getNovelsFromQuery(query);
        if (searchNovels) novels.push(...searchNovels);
    } else if (authorEmail) {
        const authorNovels = await getNovelsFromAuthor(authorEmail);
        if (authorNovels) novels.push(...authorNovels);
    } else if (genre) {
        const genreNovels = await getNovelsFromGenre(genre as NovelGenre);
        if (genreNovels) novels.push(...genreNovels);
    } else if (tags) {
        const tagNovels = await getNovelsFromTags(tags.split(' '));
        if (tagNovels) novels.push(...tagNovels);
    } else {
        const allNovels = await getNovelsAll();
        if (allNovels) novels.push(...allNovels);
    }

    return apiResponse(
        true,
        'Success to get novels',
        novels
    );
}

export async function POST(req: Request): Promise<Response> {
    const login: string | false = await authUser();
    if (!login) return apiResponse(false, 'Unauthorized', null, 401);

    // { title, phrase, description, type, genre, tags }
    const data = await req.json();
}