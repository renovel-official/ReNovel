'use client';

import Link from "next/link";

interface OptionProps {
    href: string;
    className?: string;
    children?: any;
}

export default function Option({ href, className, children, ...props }: OptionProps) {
    return (
        <Link href={href}>
            <div className={`text-2xl px-2 py-2 rounded-md hover:bg-gray-200 ${className}`} { ...props } >
                { children }
            </div>
        </Link>
    )
}