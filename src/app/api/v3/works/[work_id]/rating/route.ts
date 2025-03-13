'use server';

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import { NovelResult } from "@/interface/novel";
import { getNovelFromId } from "@/lib/novel";

interface ReqContext {
    params: Promise<{
        work_id: string;
    }>
}

export async function GET(req: Request, context: ReqContext) {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;

        const { data, error } = await supabaseClient
            .from('point_user')
            .select('*')
            .eq('novel_id', workId)
            .eq('email', login)
            .single();

        if (!error) {
            return apiResponse(
                true,
                'Success to get your assesment',
                data ?? { email: login, point: 0 }
            );
        }
    } else {
        return apiResponse(
            false,
            'You not logged in'
        );
    }

    return apiResponse(
        false,
        'Failed to get your assesment'
    );
}

export async function POST(req: Request, context: ReqContext) {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const novel: NovelResult | null = await getNovelFromId(workId);

        if (novel) {
            const data = await (async () => {
                const { data } = await supabaseClient
                    .from('point_user')
                    .select('*')
                    .eq('novel_id', workId)
                    .eq('email', login)
                    .single();
    
                return data;
            })();
    
            if (data) {
                if (data.point == 5) {
                    data.point = 0;
                    novel.work.point -= 5;
                } else {
                    data.point += 1;
                    novel.work.point += 1;
                }

                await (async () => {
                    await supabaseClient
                        .from('novels')
                        .update({ point: novel.work.point })
                        .eq('slug', workId);
                })();

                await (async () => {
                    await supabaseClient
                        .from('novels')
                        .update({ point: novel.work.point })
                        .eq('slug', workId);
                })();
    
                const { error } = await supabaseClient
                    .from('point_user')
                    .update({ point: data.point })
                    .eq('novel_id', workId)
                    .eq('email', login);
                    
                if (error) {
                    return apiResponse(false, 'Failed to add point', { point: data.point });
                } else {
                    return apiResponse(true, 'Success to add point', { point: data.point });
                }

            } else {
                const { error } = await supabaseClient
                    .from('point_user')
                    .insert({ point: 1, novel_id: workId, email: login });

                await (async () => {
                    await supabaseClient
                        .from('novels')
                        .update({ point: novel.work.point + 1 })
                        .eq('slug', workId);
                })();
    
                if (error) {
                    return apiResponse(false, 'Failed to add point', { point: 1 });
                } else {
                    return apiResponse(true, 'Success to add point', { point: 1 });
                }
            }
        }

    } else {
        return apiResponse(
            false,
            'You not logged in'
        );
    }
}