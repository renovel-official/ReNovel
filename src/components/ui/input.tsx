'use client';

import { ReactElement, HTMLInputTypeAttribute, forwardRef, useState, useEffect } from "react";

interface InputProps {
    className?: string;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
    value?: string;
    name?: string;
    id?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", placeholder = "", value = "", name = "", id = "", onChange, ...props }, ref): ReactElement<HTMLInputElement> => {
    const [v, setValue] = useState<string>(value);

    // 外部の value が変わったら内部状態を更新
    useEffect(() => {
        setValue(value);
    }, [value]);

    return (
        <input
            type={type}
            className={`mt-3 border rounded px-4 py-2 w-full ${className}`}
            placeholder={placeholder}
            required
            name={name}
            ref={ref}
            id={id}
            value={v}
            onChange={(e) => {
                setValue(e.target.value);
                if (onChange) onChange(e); // 外部の `onChange` も呼び出す
            }}
            { ...props }
        />
    );
});

Input.displayName = "Input"; // forwardRef を使う場合は displayName を設定

export default Input;