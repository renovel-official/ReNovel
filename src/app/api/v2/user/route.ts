'use server';

import { getUserFromEmail, getUserFromSlug, updateUserFromEmail } from "@/lib/user";

import { hashPassword } from "@/lib/password";
import apiResponse from "@/lib/response";
import authUser from "@/lib/auth";

import User from "@/interface/user";
import { ValueOf } from "next/dist/shared/lib/constants";

const userKeys: string[] = ["name", "email", "description", "password", "role"];

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

    if (authResult) {
        const data: any = await req.json();
        const target: string = data.target ?? authResult;
        const user: User | undefined = await getUserFromEmail(target);

        if (user) {
            if (target == authResult && user) {
                userKeys.forEach(async (key: string) => {
                    if (data[key as keyof User] && key != "role" && key != "id" && key != "password") {
                        user[key as keyof User] = data[key as keyof User] as never;
                    } else if (key == "password" && data[key]) {
                        if (data[key].length >= 4) {
                            user["password"] = await hashPassword(data[key]);
                        }
                    }
                });
            } else {
                if (user?.role == "admin") {
                    userKeys.forEach(async (key: string) => {
                        if (data[key as keyof User] && key != "id" && key != "password") {
                            user[key as keyof User] = data[key as keyof User] as never;
                        } else if (key == "password" && data[key]) {
                            if (data[key].length >= 4) {
                                user["password"] = await hashPassword(data[key]);
                            }
                        }
                    });
                }
            }

            const result: boolean = await updateUserFromEmail(user.email, user);
            console.log(result);

            if (result) {
                return apiResponse(
                    true,
                    'Success to update user',
                    user
                );
            }
        }
    }

    return apiResponse(
        false,
        'Failed to update user'
    );
}

export async function DELETE(req: Request): Promise<Response> {
    return apiResponse(
        false,
        'Failed to delete user',
    );
}