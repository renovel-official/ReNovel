'use server';

import supabaseClient from "./supabase";
import Episode from "@/interface/episode";

const getNovelAllViwes = (async (workId: string): Promise<number> => {
    const { data, error } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('novel_id', workId);

    if (error) return 0;

    const views = (data as Episode[])?.reduce((acc, cur) => acc + cur.view.length, 0) ?? 0;
    return views;
});

const getEpisodesFromNovel = (async (workId: string): Promise<Episode[] | null> => {
    const { data, error } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('novel_id', workId);

    return error ? null : data;
});

const getEpisodeFromId = (async (episodeId: string): Promise<Episode | null> => {
    const { data, error } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('slug', episodeId)
        .single();

    return error ? null : data;
});

export { getNovelAllViwes, getEpisodesFromNovel, getEpisodeFromId };