'use server';

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

const getNovelsAll = (async (): Promise<NovelResult[] | null> => {
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

const getNovelsFromGenre = (async (genre: NovelGenre): Promise<NovelResult[] | null> => {
    const novels = await getNovelsAll();

    return novels?.filter((novel: NovelResult) => novel.work.genre === genre) ?? [];
});

const getNovelsFromTags = (async (tags: string[]): Promise<NovelResult[] | null> => {
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

const searchNovels = (async (query: string): Promise<NovelResult[] | null> => {
    
    return null;
});

export {
    getNovelsAll,
    getNovelFromId,
    getNovelsFromAuthor,
    getNovelsFromGenre
};