'use server';

import Session from "@/interface/session";
import supabaseClient from "./supabase";
import { generateToken } from "./random";

async function getSessionFromToken(token: string): Promise<Session | undefined> {
    const { data } = await supabaseClient
        .from('sessions')
        .select('*')
        .eq('token', token)
        .single();

    return data ?? undefined;
}

async function getSessionFromEmail(email: string): Promise<Session | undefined> {
    const { data } = await supabaseClient
        .from('sessions')
        .select('*')
        .eq('email', email)
        .single();

    return data ?? undefined;
}

async function registSession(email: string): Promise<string | undefined> {
    const isExists: Session | undefined = await getSessionFromEmail(email);

    if (isExists) {
        return isExists.token;
    }

    const token: string = await generateToken();

    const { error } = await supabaseClient
        .from('sessions')
        .insert({ email, token });

    if (error) throw new Error(error.message);
    return error ? undefined : token;
}

export {
    getSessionFromEmail,
    getSessionFromToken,
    registSession
};