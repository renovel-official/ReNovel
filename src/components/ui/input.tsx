'use client';

import { ReactElement, HTMLInputTypeAttribute, Ref } from "react";

interface InputProps {
    type?: HTMLInputTypeAttribute;
    placeholder: string;
    name?: string;
    ref?: Ref<HTMLInputElement>;
}

export default function Input({ type = "text", placeholder, ...props }: InputProps) {
    return (
        <input
            type={type}
            className="mt-3 border rounded px-4 py-2 w-full"
            placeholder={placeholder}
            required
            { ...props }
        />
    )
}