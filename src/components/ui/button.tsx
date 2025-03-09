'use client';

import { ReactElement } from "react";

interface ButtonProps {
    children?: any;
    className?: string;
    onClick?: Function;
    disbled?: boolean;
}

export default function Button({ children, className, onClick = (() => {}), disbled = false, ...props }: ButtonProps): ReactElement<HTMLButtonElement> {
    return (
        <button className={`border rounded px-3 py-2 ${className}`} disabled={disbled} { ...props } onClick={() => { onClick(); }}>
            { children }
        </button>
    )
}