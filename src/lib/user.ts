'use server';

import supabaseClient from "./supabase";

async function getUserFromEmail(email: string) {
    const { data } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('email', email)
        .single();

    return data ?? undefined;
}

async function getUserFromSlug(slug: string) {
    const { data } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('slug', slug)
        .single();

    return data ?? undefined;
}

export {
    getUserFromEmail,
    getUserFromSlug
};