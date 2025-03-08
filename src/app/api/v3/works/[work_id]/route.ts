'use server';

import { NovelResult, NovelAuthor } from "@/interface/novel";
import { getEpisodesFromNovel } from "@/lib/episode";
import { getNovelFromId } from "@/lib/novel";

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

        const novel = await getNovelFromId(workId);

        if (novel) {
            const { title, text } = await req.json();
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