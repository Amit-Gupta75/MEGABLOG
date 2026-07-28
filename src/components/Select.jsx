import React, { useId } from 'react'

function Select({
    options,
    label,
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full text-left'>
            {label && (
                <label htmlFor={id} className='inline-block mb-1.5 pl-1 text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                </label>
            )}
            <select
                {...props}
                id={id}
                ref={ref}
                className={`px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 duration-200 border border-slate-300 dark:border-slate-700 w-full text-sm cursor-pointer ${className}`}
            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)
