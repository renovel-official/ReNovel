import { NextRequest, NextResponse } from "next/server";
import authUser from "./lib/auth";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
    const auth: string | false = await authUser();
    const url: URL = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/dashboard") && !auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    } else if ((path.startsWith("/login") || path.startsWith("/register")) && auth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

// dashboard へのアクセスを制限
export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};