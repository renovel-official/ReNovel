'use server';

import { cookies } from "next/headers";

import supabaseClient from "@/lib/supabase";

export async function GET(): Promise<Response> {
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get('session')?.value;

    if (token) {
        await supabaseClient
            .from('sessions')
            .delete()
            .eq('token', token);
    }

    return new Response(null, {
        status: 302, // 301だとキャッシュされる可能性があるので302に変更
        headers: {
            'Location': '/'
        }
    });
}
