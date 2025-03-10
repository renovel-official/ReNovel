'use server';

import Novel, { NovelResult, NovelAuthor } from "@/interface/novel";
import { getEpisodeFromId } from "@/lib/episode";
import { getFormattedDate } from "@/lib/date";
import { getNovelFromId } from "@/lib/novel";
import { isAuthor } from "@/lib/novel";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import Episode from "@/interface/episode";

export async function GET(req: Request, context: { params: { work_id: string; episode_id: string; } }) {  // 小説を取得
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

export async function POST(req: Request, context: { params: { work_id: string; episode_id: string; } }) { // 小説を公開

}

export async function PUT(req: Request, context: { params: { work_id: string; episode_id: string; } }) {  // 小説の内容を更新
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const episodeId: string = params.episode_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const episode: Episode | null = await getEpisodeFromId(episodeId);
        const isAdmin = await isAuthor(workId, login);

        if (novel && episode && isAdmin) {
            const { title, text } = await req.json();
            const updated_at = await getFormattedDate();

            const { error } = await supabaseClient
                .from('episodes')
                .update({ title, text, updated_at })
                .eq('novel_id', workId)
                .eq('slug', episodeId);

            console.log(error);


            if (!error) return apiResponse(
                true,
                'Success to update novel',
                { title, text, updated_at }
            );
        }
    }

    return apiResponse(
        false,
        'Failed to update'
    );
}

export async function DELETE(req: Request, context: { params: { work_id: string; episode_id: string; } }) {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const episodeId: string = params.episode_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const episode: Episode | null = await getEpisodeFromId(episodeId);
        const isAdmin = (await isAuthor(workId, login)) == "admin";

        if (isAdmin && novel && episode) {
            const { error } = await supabaseClient
                .from('episodes')
                .delete()
                .eq('novel_id', workId)
                .eq('slug', episodeId);

            if (!error) return apiResponse(
                true,
                'Success to delete episode'
            );
        }
    }

    return apiResponse(
        false,
        'Failed to delete episode'
    );
}