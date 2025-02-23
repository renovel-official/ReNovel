'use server';

import { getUserFromEmail, getUserFromSlug } from "@/lib/user";

import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";

import User from "@/interface/user";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const userId: string | null = searchParams.get('user');
    const email: string | null = searchParams.get('email');
    const user: User | undefined = 
        (await getUserFromSlug(userId ?? "")) ?? 
        (await getUserFromEmail(email ?? ""));

    if (user) {
        delete user.password;
        return apiResponse(
            true,
            'Success to get user',
            user
        );
    }


    return apiResponse(
        false,
        'User not found'
    );
}

export async function PUT(req: Request): Promise<Response> {
    const authResult: string | false = await authUser();
}