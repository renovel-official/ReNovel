'use server';

import apiResponse from "@/lib/response";

export async function GET(): Promise<Response> {
    return apiResponse(
        false,
        'Not Found',
        null,
        404
    );
}