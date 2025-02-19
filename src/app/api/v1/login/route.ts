'use server';

import { getUserFromEmail } from "@/lib/user";
import { verifyPassword } from "@/lib/password";
import { registSession } from "@/lib/session";
import { cookies } from "next/headers";

import apiResponse from "@/lib/response";
import User from "@/interface/user";

export async function POST(req: Request): Promise<Response> {
    const data = await req.json();
    console.log(data);

    if (data.email && data.password) {
        const user: undefined | User = await getUserFromEmail(data.email);
        console.log(user);
        
        if (user) {
            const verify = await verifyPassword(data.password, user.password);
            console.log(`Verify: ${verify}`);
            if (verify) {
                const token: string = await registSession(data.email);
                console.log(`Token: ${token}`);
                const cookieStore = await cookies();

                cookieStore.set('session', token);

                return apiResponse(
                    true,
                    'Success to login',
                    { token }
                );
            }   
        }
    }

    return apiResponse(
        false,
        'Failed to login'
    );
}