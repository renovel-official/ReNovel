'use server';

import { cookies } from "next/headers";
import supabaseClient from "./supabase";

const authUser = (async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get('session')?.value;

    const { data, error } = await supabaseClient
        .from('sessions')
        .select('*')
        .eq('token', token)
        .single();

    return (!error && data) ? true : false;
});

export default authUser;