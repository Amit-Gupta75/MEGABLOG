import React from 'react'

export default function Button({
    children,
    type = 'button',
    bgColor = 'bg-indigo-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
