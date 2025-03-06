'use server';

import { NovelGenreList } from "@/types/genre";

import supabaseClient from "@/lib/supabase";
import Novel from "@/interface/novel";
import NovelGenre from "@/types/genre";

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

const getNovelsAll = (async (): Promise<NovelResult[]> => {
    const results: NovelResult[] = [];
    const { data, error } = await supabaseClient
        .from('novels')
        .select('*');

    if (error) {
        return null;
    }

    data?.forEach(async (novel: Novel) => {
        results.push(await getNovelFromId(novel.slug ?? "") as NovelResult);
    });

    return results;
});

const getNovelFromId = (async (workId: string): Promise<NovelResult> => {
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

            return error ? null : data;
        })(workId);

        if (authorData) {
            return {
                work: novelData,
                authors: authorData
            };
        }
        
    }

    return null;
});

const getNovelsFromAuthor = (async (email: string): Promise<NovelResult[]> => {
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
    const novels = await getNovelsAll();

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
            results.push(...(await getNovelsFromAuthor(query)));
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