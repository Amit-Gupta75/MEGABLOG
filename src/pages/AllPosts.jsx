import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { Search, Grid, Filter } from 'lucide-react'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        appwriteService.getPosts([]).then((res) => {
            let fetched = []
            if (res && res.documents) {
                fetched = res.documents
            }
            const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
            const combined = [...fetched]
            localPosts.forEach(lp => {
                if (!combined.some(p => p.$id === lp.$id)) {
                    combined.unshift(lp)
                }
            })

            // Default fallback list
            if (combined.length === 0) {
                setPosts([
                    {
                        $id: "getting-started-with-react-19",
                        title: "Mastering React 19: Actions, Server Components & Hooks",
                        content: "React 19 introduces game-changing primitives like Actions, optimistic updates, and built-in asset loading.",
                        featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
                        status: "active",
                        $createdAt: new Date().toISOString()
                    },
                    {
                        $id: "building-scalable-cloud-architecture",
                        title: "Building Resilient Cloud Architecture with Serverless & Microservices",
                        content: "Discover best practices for designing auto-scaling, fault-tolerant microservices architectures.",
                        featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
                        status: "active",
                        $createdAt: new Date(Date.now() - 86400000).toISOString()
                    },
                    {
                        $id: "designing-accessible-ui-components",
                        title: "The Art of Accessible & Fast Modern Web User Interfaces",
                        content: "Learn typography scaling, color contrast mathematics, and keyboard navigation.",
                        featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
                        status: "active",
                        $createdAt: new Date(Date.now() - 172800000).toISOString()
                    }
                ])
            } else {
                setPosts(combined)
            }
        }).catch(() => {
            const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
            setPosts(localPosts)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const filtered = posts.filter(post => {
        const matchesSearch = post.title?.toLowerCase().includes(search.toLowerCase()) ||
            post.content?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterStatus === 'all' ? true : post.status === filterStatus;
        return matchesSearch && matchesFilter;
    })

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='mb-8 text-left'>
                    <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-1'>
                        <Grid className='w-4 h-4' />
                        Article Collection
                    </div>
                    <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>
                        All Published Articles
                    </h1>
                    <p className='text-slate-600 dark:text-slate-400 text-sm mt-1'>
                        Browse through our complete repository of community posts and technical stories.
                    </p>
                </div>

                {/* Filter and Search Bar */}
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm'>
                    <div className='relative w-full sm:w-80'>
                        <Search className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input
                            type='text'
                            placeholder='Search title or content...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>

                    <div className='flex items-center gap-2 w-full sm:w-auto'>
                        <Filter className='w-4 h-4 text-slate-400' />
                        <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Status:</span>
                        <div className='flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl'>
                            {['all', 'active', 'inactive'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                        filterStatus === status
                                            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-80 w-full" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                        <p className="text-slate-500 dark:text-slate-400">No articles match your criteria.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filtered.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts
