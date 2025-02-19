'use server';

import { randomBytes } from "crypto";

async function generateToken(length: number = 32): Promise<string> {
    return randomBytes(length).toString("hex"); // 16進数の文字列に変換
}

export {
    generateToken
};

