'use server';

import { NovelAuthor, NovelResult } from "@/interface/novel";
import { getNovelAllViwes } from "./episode";
import { NovelGenreList } from "@/types/genre";

import supabaseClient from "@/lib/supabase";
import NovelGenre from "@/types/genre";


const getNovelsAll = async (): Promise<NovelResult[] | null> => {
    const results: NovelResult[] = [];
    const { data, error } = await supabaseClient
        .from('novels')
        .select('*');

    if (error) {
        return null;
    }

    for (const novel of data ?? []) {
        const novelResult: NovelResult = await getNovelFromId(novel.slug ?? "") as NovelResult;
        results.push(novelResult);
    }

    return results;
};

const getNovelFromId = (async (workId: string): Promise<NovelResult | null> => {
    const novelData = await (async (workId) => {
        const { data, error } = await supabaseClient
            .from('novels')
            .select('*')
            .eq('slug', workId)
            .single();

        return error ? null : data;
    })(workId);

    if (novelData) {
        const authorData = await (async (workId: string): Promise<NovelAuthor[] | null> => {
            const { data, error } = await supabaseClient
                .from('author_novels')
                .select('*')
                .eq('novel_id', workId);

            if (data) {
                for (let i = 0; i < data?.length; i++) {
                    delete data[i].id;
                }
            }
            
            return error ? null : data;
        })(workId);

        const follower = await (async (workId: string): Promise<number> => {
            const { data, error } = await supabaseClient
                .from('follow_novels')
                .select('*')
                .eq('novel_id', workId);

            return error ? 0 : data?.length ?? 0;
        })(workId);

        const view = await getNovelAllViwes(workId) ?? 0;

        if (authorData) {
            return {
                work: novelData,
                authors: authorData,
                view,
                follower,
            };
        }
        
    }

    return null;
});

const getNovelsFromAuthor = (async (email: string): Promise<NovelResult[] | null> => {
    const authorNovelIds = await (async (email: string): Promise<NovelAuthor[] | null> => {
        const { data, error } = await supabaseClient
            .from('author_novels')
            .select('novel_id')
            .eq('email', email);

        return error ? null : data as NovelAuthor[];
    })(email);

    if (authorNovelIds) {
        const novels = await Promise.all(authorNovelIds.map(async (authorNovelData: NovelAuthor) => {
            return await getNovelFromId(authorNovelData.novel_id);
        }));

        return novels as NovelResult[];
    }

    return null;
});

const getNovelsFromGenre = (async (genre: NovelGenre): Promise<NovelResult[]> => {
    const novels = await getNovelsAll() ?? [];

    return novels?.filter((novel: NovelResult) => novel.work.genre === genre) ?? [];
});

const getNovelsFromTags = (async (tags: string[]): Promise<NovelResult[]> => {
    const novels = await getNovelsAll();
    const results: NovelResult[] = [];

    tags.forEach((tag: string) => {
        novels?.forEach((novel: NovelResult) => {
            if (novel.work.tags?.includes(tag)) {
                results.push(novel);
            }
        });
    });

    return results;
});

const getNovelsFromQuery = (async (queryText: string): Promise<NovelResult[]> => {
    const queris: string[] = queryText.split(' ');
    const novels = await getNovelsAll();
    const results: NovelResult[] = [];

    for (const query of queris) {
        for (const novel of novels ?? []) {
            if (novel.work.title.includes(query) || novel.work.description.includes(query)) {
                results.push(novel);
            }
            results.push(...(await getNovelsFromTags([query])));
            if (NovelGenreList.includes(query as NovelGenre)) results.push(...(await getNovelsFromGenre(query as NovelGenre)));
            results.push(...(await getNovelsFromAuthor(query) ?? []));
        };
    };

    return results.sort((a: NovelResult, b: NovelResult) => b.work.point - a.work.point);
});

export {
    getNovelsAll,
    getNovelFromId,
    getNovelsFromTags,
    getNovelsFromGenre,
    getNovelsFromQuery,
    getNovelsFromAuthor,
};