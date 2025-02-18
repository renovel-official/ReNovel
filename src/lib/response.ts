'use server';

async function apiResponse(success: boolean, message: string, body?: any, status?: number): Promise<Response> {
    return new Response(
        JSON.stringify({ success, message, body }),
        {
            status: status ?? (success ? 200 : 400),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

export default apiResponse;