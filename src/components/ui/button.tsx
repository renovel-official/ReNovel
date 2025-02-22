'use client';

import { ReactElement } from "react";

interface ButtonProps {
    children?: any;
    className?: string;
}

export default function Button({ children, className, ...props }: ButtonProps): ReactElement<HTMLButtonElement> {
    return (
        <button className={`border rounded px-3 py-2 ${className}`} { ...props }>
            { children }
        </button>
    )
}