'use client';

import { ReactElement } from "react";
import Link from "next/link";

interface ButtonProps {
    children?: any;
    href: string;
    className?: string;
}

export default function ButtonLink({ children, href, className, ...props }: ButtonProps): ReactElement<HTMLButtonElement> {
    return (
        <Link href={href}>
            <div className={`text-center border rounded px-3 py-2 ${className}`} { ...props }>
                { children }
            </div>
        </Link>
    )
}