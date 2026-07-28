import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sparkles, PenTool, Search, ArrowRight, BookOpen } from 'lucide-react'

// Initial featured sample posts if database has no records yet
const SAMPLE_POSTS = [
  {
    $id: "getting-started-with-react-19",
    title: "Mastering React 19: Actions, Server Components & Hooks",
    content: "React 19 introduces game-changing primitives like Actions, optimistic updates, and built-in asset loading. Learn how to leverage these features in your modern web applications.",
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    status: "active",
    $createdAt: new Date().toISOString()
  },
  {
    $id: "building-scalable-cloud-architecture",
    title: "Building Resilient Cloud Architecture with Serverless & Microservices",
    content: "Discover best practices for designing auto-scaling, fault-tolerant microservices architectures using modern cloud tools and decoupled databases.",
    featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    $id: "designing-accessible-ui-components",
    title: "The Art of Accessible & Fast Modern Web User Interfaces",
    content: "Accessibility isn't an afterthought. Learn typography scaling, color contrast mathematics, and keyboard navigation to craft inclusive user experiences.",
    featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    status: "active",
    $createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        appwriteService.getPosts().then((res) => {
            let fetched = []
            if (res && res.documents) {
                fetched = res.documents
            }
            
            // Merge with localStorage demo posts
            const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
            const combined = [...fetched]
            localPosts.forEach(lp => {
                if (!combined.some(p => p.$id === lp.$id)) {
                    combined.unshift(lp)
                }
            })

            if (combined.length === 0) {
                setPosts(SAMPLE_POSTS)
            } else {
                setPosts(combined)
            }
        }).catch(() => {
            const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]')
            setPosts(localPosts.length > 0 ? localPosts : SAMPLE_POSTS)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const filteredPosts = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='w-full py-8 min-h-[75vh] flex flex-col justify-between'>
            {/* Hero Section */}
            <div className="mb-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Full-Stack Publishing Platform
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                        Share Knowledge. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
                            Inspire Developers &amp; Creators.
                        </span>
                    </h1>
                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                        Write, edit, and publish rich technical articles and stories. Powered by React, Redux Toolkit, and Appwrite backend architecture.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        {authStatus ? (
                            <Link 
                                to="/add-post" 
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
                            >
                                <PenTool className="w-5 h-5" />
                                Write New Article
                            </Link>
                        ) : (
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                        <Link 
                            to="/all-posts" 
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition-all duration-200"
                        >
                            <BookOpen className="w-5 h-5" />
                            Explore All Posts
                        </Link>
                    </div>
                </div>
            </div>

            {/* Articles Section */}
            <Container>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Latest Articles
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Discover stories, tutorials, and technical insights from the community.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-80 w-full" />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                        <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No articles found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                            {searchTerm ? `No posts match "${searchTerm}". Try a different search.` : "Be the first to publish a post on MegaBlog!"}
                        </p>
                        {authStatus && (
                            <Link 
                                to="/add-post"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500"
                            >
                                <PenTool className="w-4 h-4" />
                                Create First Post
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home
