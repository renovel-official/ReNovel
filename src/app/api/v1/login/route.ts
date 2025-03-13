'use server';

import { getUserFromEmail } from "@/lib/user";
import { verifyPassword } from "@/lib/password";
import { registSession } from "@/lib/session";
import { cookies } from "next/headers";

import apiResponse from "@/lib/response";
import User from "@/interface/user";

export async function POST(req: Request): Promise<Response> {
    const data = await req.json();

    if (data.email && data.password) {
        const user: undefined | User = await getUserFromEmail(data.email);
        
        if (user) {
            const verify = await verifyPassword(data.password, user.password ?? "");
            if (verify) {
                const token: string | undefined = await registSession(data.email);

                if (token) {
                    const cookieStore = await cookies();

                    cookieStore.set('session', token);
    
                    return apiResponse(
                        true,
                        'Success to login',
                        { token }
                    );
                } else {
                    return apiResponse(
                        false,
                        'Failed to login action'
                    );
                }
                
            }   
        }
    }

    return apiResponse(
        false,
        'Failed to login'
    );
}