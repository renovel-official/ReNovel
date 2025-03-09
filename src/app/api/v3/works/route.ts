'use server';

import { getNovelsFromQuery, getNovelsAll, getNovelFromId, getNovelsFromAuthor, getNovelsFromGenre, getNovelsFromTags } from "@/lib/novel";
import { generateUniqueNumber } from "@/lib/random";
import { getFormattedDate } from "@/lib/date";
import { NovelResult } from "@/interface/novel";
import { getEpisodesFromNovel } from "@/lib/episode";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import NovelGenre, { NovelGenreList } from "@/types/genre";
import authUser from "@/lib/auth";

export async function GET(req: Request): Promise<Response> {
    const login = await authUser();
    const { searchParams } = new URL(req.url);
    const workId: string | null = searchParams.get("work");
    const query = searchParams.get("q");
    const authorEmail: string | null = searchParams.get("email");
    const authorSlug: string | null = searchParams.get("author");
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
    } else if (authorSlug) {
        const authorNovels = await getNovelsFromAuthor(authorSlug === "me" && login ? login : authorSlug);
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

    if (data.title && data.type && data.genre) {
        if (data.title.length > 20) return apiResponse(false, 'Title is too long', null, 400);
        if (data.phrase.length > 20) return apiResponse(false, 'Phrase is too long', null, 400);
        if (data.description.length > 1000) return apiResponse(false, 'Description is too long', null, 400);
        if (data.tags.length > 10) return apiResponse(false, 'Tags are too long', null, 400);
        if (data.type !== 'short' && data.type !== 'long') return apiResponse(false, 'Invalid type', null, 400);
        if (!NovelGenreList.includes(data.genre)) return apiResponse(false, 'Invalid genre', null, 400);

        if (data.title.length <= 1) return apiResponse(false, 'Title is too short', null, 400);

        const novelId: string = await generateUniqueNumber();
        const createNovelResult = await (async (novelId: string, novelData: any): Promise<boolean> => {
            const { error } = await supabaseClient
                .from('novels')
                .insert({
                    slug: novelId,
                    title: novelData.title,
                    phrase: novelData.phrase,
                    description: novelData.description,
                    type: novelData.type,
                    genre: novelData.genre,
                    tags: novelData.tags,
                    updated_at: await getFormattedDate('YYYY/MM/DD HH:mm:ss'),
                    created_at: await getFormattedDate('YYYY/MM/DD HH:mm:ss')
                });
            

            return error ? false : true;
        })(novelId, data);

        if (createNovelResult) {
            const appendAuthorResult = await (async (novelId: string, email: string): Promise<boolean> => {
                const { error } = await supabaseClient
                    .from('author_novels')
                    .insert({
                        email,
                        novel_id: novelId,
                        is_admin: true
                    });

                return error ? false : true;
            })(novelId, login);

            if (appendAuthorResult) return apiResponse(true, 'Success to create novel', { slug: novelId });
        }
    } else {
        return apiResponse(false, 'Invalid request', null, 400);
    }

    return apiResponse(false, 'Failed to create novel', null);
}