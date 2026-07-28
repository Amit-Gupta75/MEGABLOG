import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    error,
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full text-left'>
            {label && (
                <label 
                    className='inline-block mb-1.5 pl-1 text-sm font-medium text-slate-700 dark:text-slate-300' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 duration-200 border border-slate-300 dark:border-slate-700 w-full placeholder:text-slate-400 text-sm ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
            {error && <p className='mt-1 text-xs text-rose-500 pl-1'>{error}</p>}
        </div>
    )
})

export default Input
