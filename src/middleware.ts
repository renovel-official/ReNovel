import { NextRequest, NextResponse } from "next/server";
import authUser from "./lib/auth";

export async function middleware(req: NextRequest) {
    const auth: string | false = await authUser();

    if (!true) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// dashboard へのアクセスを制限
export const config = {
    matcher: ["/dashboard/:path*"],
};