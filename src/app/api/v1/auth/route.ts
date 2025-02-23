'use server';

import { getUserFromEmail } from "@/lib/user";

import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";
import User from "@/interface/user";

export async function GET(): Promise<Response> {
    const authResult: string | false = await authUser();

    if (authResult) {
        const user: User | undefined = await getUserFromEmail(authResult);

        if (user) {
            delete user.password;
            
            return apiResponse(
                true,
                'You logged in',
                user
            );
        }
    }

    return apiResponse(
        false,
        'You not logged in'
    );
}