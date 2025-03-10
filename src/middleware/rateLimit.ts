import { NextRequest, NextResponse } from 'next/server';

const rateLimit = {
    windowMs: 2 * 60 * 1000, // 2分間のウィンドウ
    max: 200, // 各IPアドレスからの最大リクエスト数
    message: 'Too many requests from this IP, please try again after 15 minutes',
};

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

export function rateLimiter(req: NextRequest) {
    // `x-forwarded-for` ヘッダーから最初のIPを取得
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim();
    const now = Date.now();
    const requestInfo = ipRequestCounts.get(ip) || { count: 0, timestamp: now };

    // 時間ウィンドウが切り替わったらリセット
    if (now - requestInfo.timestamp > rateLimit.windowMs) {
        requestInfo.count = 1;
        requestInfo.timestamp = now;
    } else {
        requestInfo.count += 1;
    }

    ipRequestCounts.set(ip, requestInfo);

    if (requestInfo.count > rateLimit.max) {
        // レート制限を超えた場合は 429 とメッセージを返す
        const resetTime = new Date(requestInfo.timestamp + rateLimit.windowMs).toISOString();
        return NextResponse.json(
            { message: rateLimit.message },
            { status: 429, headers: { 'X-RateLimit-Reset': resetTime } }
        );
    }

    // 次の処理に進む
    return NextResponse.next();
}