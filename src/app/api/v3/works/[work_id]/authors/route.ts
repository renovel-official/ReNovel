'use server';

export async function generateStaticParams() {
    return []; // 空リストを返せばNext.jsは動的ルートと認識する
}
  

import { NovelResult, NovelAuthor } from "@/interface/novel";
import { getNovelFromId, isAuthor } from "@/lib/novel";
import { getUserFromSlug } from "@/lib/user";

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import User from "@/interface/user";

export async function GET(req: Request, context: { params: { work_id: string; } }) {
    const params = await context.params;
    const workId: string = params.work_id;
    
    const novel: NovelResult | null = await getNovelFromId(workId);

    if (novel) {
        return apiResponse(
            true,
            'Success to get authors',
            novel.authors
        );
    } else {
        return apiResponse(
            false,
            'The novel not found',
            null,
            404
        );
    }
}

export async function POST(req: Request, context: { params: { work_id: string; } }) {
    const params = await context.params;
    const workId: string = params.work_id;

    const login: false | string = await authUser();
    const novel: NovelResult | null = await getNovelFromId(workId);

    if (login && novel) {
        const author = await isAuthor(workId, login);

        if (author === "admin") {
            const { slug }: { slug: string } = await req.json();

            const user: User | undefined = await getUserFromSlug(slug);

            if (user) {
                const { error } = await supabaseClient
                    .from('author_novels')
                    .insert({
                        email: user.email,
                        novel_id: workId
                    });

                if (!error) return apiResponse(
                    true,
                    'Success to add author',
                    user
                );

            } else {
                return apiResponse(
                    false,
                    'User not found',
                    null,
                    404
                );
            }
        } else {
            return apiResponse(
                false,
                "You don't have permission"
            );
        }
    }

    return apiResponse(
        false,
        'Failed to add author'
    );
}

export async function DELETE(req: Request, context: { params: { work_id: string; } }) {
    const login: false | string = await authUser();

    if (login) {
        const params = await context.params;
        const workId: string = params.work_id;
        const novel: NovelResult | null = await getNovelFromId(workId);
        const isAdmin = (await isAuthor(workId, login)) == "admin" ;

        if (novel && isAdmin) {
            const { email }: { email: string } = await req.json();
            const author: NovelAuthor | undefined = novel.authors.find((author: NovelAuthor) => author.email == email);

            if (author && !author.is_admin) {
                const { error } = await supabaseClient
                    .from('author_novels')
                    .delete()
                    .eq('novel_id', workId)
                    .eq('email', email);

                if (!error) return apiResponse(
                    true,
                    'Success to delete user'
                );
            }
        }
    }

    return apiResponse(
        false,
        'Failed to delete user'
    );
}