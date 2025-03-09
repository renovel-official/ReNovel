'use server';

import { NovelResult, NovelAuthor } from "@/interface/novel";
import { getNovelFromId, isAuthor } from "@/lib/novel";
import { getEpisodesFromNovel } from "@/lib/episode";
import { generateUniqueNumber } from "@/lib/random";
import { getFormattedDate } from "@/lib/date";
import { NovelGenreList } from "@/types/genre";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import Episode from "@/interface/episode";


export async function GET(req: Request, context: { params: { work_id: string } }): Promise<Response> {
    const login: string | false = await authUser();
    const params = await context.params;
    const workId: string = params?.work_id ?? "";

    const novel: NovelResult | null = await getNovelFromId(workId);

    if (novel) {
        const episodes: Episode[] | null = await getEpisodesFromNovel(workId);
        if (episodes) {
            novel.episodes = episodes;
            const author: NovelAuthor | undefined = novel.authors.find((author) => author.email == login);
            novel.isAuthor = author ? true : false;
            novel.isAdmin = author ? author.is_admin : false;

            return apiResponse(
                true,
                'Success to fetch novel data',
                novel
            );
        } else {
            return apiResponse(
                false,
                'API Error',
                null,
                500
            );
        }
    }

    return apiResponse(
        false,
        'Failed to fetch novel',
        null,
        404
    );
}

export async function POST(req: Request, context: { params: { work_id: string } }): Promise<Response> {
    const login: string | false = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const author: false | "member" | "admin" = await isAuthor(workId, login);

        if (novel && author) {
            const { title, text, publicDate }: { title: string, text: string, publicDate: number } = await req.json();

            if (title.length === 0) return apiResponse(false, 'Title is so short');
            if (title.length >= 100) return apiResponse(false, 'Title is so long');

            const episodeId: string = await generateUniqueNumber();
            const now = await getFormattedDate();

            const { error } = await supabaseClient
                .from('episodes')
                .insert({ 
                    novel_id: workId, 
                    slug: episodeId, 
                    title, 
                    text, 
                    public_date: publicDate, 
                    created_at: now, 
                    updated_at: now 
                });

            if (!error) return apiResponse(
                true, 
                'Success to upload episode',
                { episodeId }
            );
        }
    } else {
        return apiResponse(
            false,
            'You not logged in',
            null,
            403
        );
    }

    return apiResponse(
        false,
        'Failed to upload story'
    );
}

export async function PATCH(req: Request, context: { params: { work_id: string } }): Promise<Response> {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        console.log(novel);
        const author: false | "member" | "admin" = await isAuthor(workId, login);

        if (novel && author == "admin") {
            const data = await req.json();

            if (data.title.length > 20) return apiResponse(false, 'Title is too long', null, 400);
            if (data.phrase.length > 20) return apiResponse(false, 'Phrase is too long', null, 400);
            if (data.description.length > 1000) return apiResponse(false, 'Description is too long', null, 400);
            if (data.tags.length > 10) return apiResponse(false, 'Tags are too long', null, 400);
            if (!NovelGenreList.includes(data.genre)) return apiResponse(false, 'Invalid genre', null, 400);

            const { error } = await supabaseClient
                .from('novels')
                .update({
                    title: data.title,
                    phrase: data.phrase,
                    description: data.description,
                    type: data.type,
                    genre: data.genre,
                    tags: data.tags,
                    updated_at: await getFormattedDate('YYYY/MM/DD HH:mm:ss'),
                })
                .eq('slug', workId);

            console.log(error);

            if (!error) return apiResponse(true, 'Success to update user');
        }
    }

    return apiResponse(
        false,
        'Failed to rewrite novel data'
    );
}

export async function PUT(req: Request, context: { params: { work_id: string } }): Promise<Response> {
    const login: string | false = await authUser();

    
}


export async function DELETE(req: Request, context: { params: { work_id: string } }): Promise<Response> {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params;
    }
}