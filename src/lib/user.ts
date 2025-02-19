'use server';

import User from "@/interface/user";
import supabaseClient from "./supabase";

async function getUserFromEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('email', email)
        .single();

    console.log(error);

    return data ?? undefined;
}

async function getUserFromSlug(slug: string): Promise<User | undefined> {
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