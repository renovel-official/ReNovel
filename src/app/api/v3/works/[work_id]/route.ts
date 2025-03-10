'use server';

export async function generateStaticParams() {
    return []; // 空リストを返せばNext.jsは動的ルートと認識する
}  

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

export async function GET(req: Request, context: { params: { work_id: string; } }): Promise<Response> {
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

export async function POST(req: Request, context: { params: { work_id: string; } }): Promise<Response> {
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
            if (text.length === 0) return apiResponse(false, 'Text is so short');

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

            console.log(error);

            if (!error) return apiResponse(
                true, 
                'Success to upload episode',
                { episode_id: episodeId }
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

export async function PUT(req: Request, context: { params: { work_id: string; } }): Promise<Response> {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const author: false | "member" | "admin" = await isAuthor(workId, login);

        if (novel && author == "admin") {
            const data = await req.json();

            if (data.title.length > 20) return apiResponse(false, 'Title is too long', null, 400);
            if (data.phrase.length > 35) return apiResponse(false, 'Phrase is too long', null, 400);
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
                    is_public: data.is_public,
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

export async function PATCH(req: Request, context: { params: { work_id: string; } }): Promise<Response> {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;

        const novel: NovelResult | null = await getNovelFromId(workId);
        const author: false | "member" | "admin" = await isAuthor(workId, login);

        if (author) {
            const { text }: { text: string } = await req.json();

            const { error } = await supabaseClient
                .from('novels')
                .update({ text })
                .eq('slug', workId);


            if (!error) return apiResponse(
                true,
                'Success to update data'
            );

        }
    }

    return apiResponse(false, 'Failed to update story');
}

export async function DELETE(req: Request, context: { params: { work_id: string; } }): Promise<Response> {
    const login = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const isAdmin: boolean = (await isAuthor(workId, login)) == "admin";

        if (isAdmin) {
            const episodesDeleteResult: boolean = await (async (): Promise<boolean> => {
                const { error } = await supabaseClient
                    .from('episodes')
                    .delete()
                    .eq('novel_id', workId);

                return error ? false : true;
            })();

            if (episodesDeleteResult) {
                const authorsDeleteResult: boolean = await (async (): Promise<boolean> => {
                    const { error } = await supabaseClient
                        .from('author_novels')
                        .delete()
                        .eq('novel_id', workId);

                    return error ? false : true;
                })();

                if (authorsDeleteResult) {
                    const followDateDeleteResult: boolean = await (async (): Promise<boolean> => {
                        const { error } = await supabaseClient
                        .from('follow_novels')
                        .delete()
                        .eq('novel_id', workId);

                        return error ? false : true;
                    })();

                    if (followDateDeleteResult) {
                        const novelCommentsDeleteResult: boolean = await (async (): Promise<boolean> => {
                            const { error } = await supabaseClient
                                .from('novel_comments')
                                .delete()
                                .eq('novel_id', workId);

                            return error ? false : true;
                        })();

                        if (novelCommentsDeleteResult) {
                            const novelDeleteResult: boolean = await (async (): Promise<boolean> => {
                                const { error } = await supabaseClient
                                    .from('novels')
                                    .delete()
                                    .eq('slug', workId);

                                return error ? false : true;
                            })();

                            if (novelDeleteResult) {
                                return apiResponse(
                                    true,
                                    'Success to delete novel'
                                );
                            }
                        }
                    }
                }
            }

        } else {
            return apiResponse(
                false,
                "You don't have permission"
            );
        }
    }

    return apiResponse(
        false,
        'Failed to delete novel'
    );
}