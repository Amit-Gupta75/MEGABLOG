import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
import { Edit3 } from 'lucide-react'

function EditPost() {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((res) => {
                if (res) {
                    setPost(res)
                } else {
                    // Check local storage fallback
                    const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
                    const found = localPosts.find(p => p.$id === slug)
                    if (found) {
                        setPost(found)
                    } else {
                        navigate('/')
                    }
                }
            }).catch(() => {
                const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
                const found = localPosts.find(p => p.$id === slug)
                if (found) {
                    setPost(found)
                } else {
                    navigate('/')
                }
            }).finally(() => {
                setLoading(false)
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    return loading ? (
        <div className="w-full min-h-[50vh] flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
        </div>
    ) : post ? (
        <div className='py-8'>
            <Container>
                <div className='mb-6 text-left border-b border-slate-200 dark:border-slate-800 pb-4'>
                    <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1'>
                        <Edit3 className='w-4 h-4' />
                        Editor Studio
                    </div>
                    <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>
                        Edit Article
                    </h1>
                    <p className='text-slate-600 dark:text-slate-400 text-sm mt-1'>
                        Update content, status, or featured image for &ldquo;{post.title}&rdquo;.
                    </p>
                </div>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost
