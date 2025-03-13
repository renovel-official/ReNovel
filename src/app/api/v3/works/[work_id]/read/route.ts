'use server';

import supabaseClient from "@/lib/supabase";
import apiResponse from "@/lib/response";

export async function GET(req: Request): Promise<Response> {
    return apiResponse(
        false,
        'Failed to add count'
    );
}