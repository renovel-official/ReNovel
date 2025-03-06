import { NextRequest, NextResponse } from 'next/server';

const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15分間のウィンドウ
    max: 100, // 各IPアドレスからの最大リクエスト数
    message: 'Too many requests from this IP, please try again after 15 minutes',
};

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

export function rateLimiter(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const requestInfo = ipRequestCounts.get(ip) || { count: 0, timestamp: now };

    if (now - requestInfo.timestamp > rateLimit.windowMs) {
        requestInfo.count = 1;
        requestInfo.timestamp = now;
    } else {
        requestInfo.count += 1;
    }

    ipRequestCounts.set(ip, requestInfo);

    if (requestInfo.count > rateLimit.max) {
        return NextResponse.json({ message: rateLimit.message }, { status: 429 });
    }

    return NextResponse.next();
}