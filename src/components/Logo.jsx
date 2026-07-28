import React from 'react'
import { BookOpen } from 'lucide-react'

function Logo({ width = '100px' }) {
  return (
    <div className='flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white tracking-tight' style={{ width }}>
      <div className='bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-xl shadow-sm flex items-center justify-center'>
        <BookOpen className='w-5 h-5' />
      </div>
      <span>Mega<span className='text-indigo-600 dark:text-indigo-400'>Blog</span></span>
    </div>
  )
}

export default Logo
