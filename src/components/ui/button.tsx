'use client';

import { ReactElement } from "react";

interface ButtonProps {
    children?: any;
    className?: string;
    disbled?: boolean;
}

export default function Button({ children, className, disbled=false, ...props }: ButtonProps): ReactElement<HTMLButtonElement> {
    return (
        <button className={`border rounded px-3 py-2 ${className}`} disabled={disbled} { ...props }>
            { children }
        </button>
    )
}