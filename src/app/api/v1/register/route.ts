'use server';

import { getUserFromEmail, getUserFromSlug } from "@/lib/user";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";

export async function POST(req: Request): Promise<Response> {
    const data = await req.json();

    if (data.name && data.slug && data.email && data.password) {
        const name = data.name;
        const slug = data.slug;
        const email = data.email;
        const password = data.password;

        if (name.length >= 1 && slug.length >= 1 && email.length >= 5 && password.length >= 4) {
            const existsUser = (await getUserFromEmail(email)) || (await getUserFromSlug(slug));
            console.log(existsUser);

            if (!existsUser) {
                const { error } = await supabaseClient
                    .from('accounts')
                    .insert({
                        name,
                        slug,
                        email,
                        password
                    });

                console.log(error);

                if (!error) return apiResponse(
                    true,
                    'Success to regist user'
                );
            }
        }
    }

    return apiResponse(
        false,
        'Failed to regist user'
    );
}