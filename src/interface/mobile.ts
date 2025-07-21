import { headers } from "next/headers";

export async function isMobile(): Promise<boolean> {
    const header = await headers(); 
    const userAgent = header.get("user-agent") || "";

    // モバイルデバイスのキーワードリスト
    const mobileKeywords = [
        "Android", "iPhone", "iPad", "iPod", "Windows Phone", "BlackBerry", "Mobile"
    ];

    // ユーザーエージェントにモバイルデバイスのキーワードが含まれているか判定
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));

    return isMobile;
}