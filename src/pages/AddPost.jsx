import React from 'react'
import { Container, PostForm } from '../components'
import { PenTool } from 'lucide-react'

function AddPost() {
  return (
    <div className='py-8'>
        <Container>
            <div className='mb-6 text-left border-b border-slate-200 dark:border-slate-800 pb-4'>
                <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1'>
                    <PenTool className='w-4 h-4' />
                    Content Creator
                </div>
                <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>
                    Create New Article
                </h1>
                <p className='text-slate-600 dark:text-slate-400 text-sm mt-1'>
                    Compose your article using rich text, select cover images, and publish to MegaBlog.
                </p>
            </div>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost
