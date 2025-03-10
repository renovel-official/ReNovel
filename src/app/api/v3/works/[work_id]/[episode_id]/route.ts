'use server';

import Novel, { NovelResult, NovelAuthor } from "@/interface/novel";
import { getEpisodeFromId } from "@/lib/episode";
import { getNovelFromId } from "@/lib/novel";
import { isAuthor } from "@/lib/novel";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import Episode from "@/interface/episode";

interface Context {
    params: {
        work_id: string;
        episode_id: string;
    }
}

export async function GET(req: Request, context: Context) {  // 小説を取得
    const params = await context.params;
    const episodeId: string = params.episode_id;
    const episode: Episode | null = await getEpisodeFromId(episodeId);

    if (episode) {
        return apiResponse(
            true,
            'Success to get episode',
            episode
        );
    }

    return apiResponse(
        false,
        'Failed to get episode'
    );
}

export async function POST(req: Request, context: Context) { // 小説を公開

}

export async function PUT(req: Request, context: Context) {  // 小説の内容を更新
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const episodeId: string = params.episode_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const episode: Episode | null = await getEpisodeFromId(episodeId);
        const isAdmin = await isAuthor(workId, login);

        if (novel && episode && isAdmin) {
            
        }
    }

    return apiResponse(
        false,
        'Failed to update'
    );
}