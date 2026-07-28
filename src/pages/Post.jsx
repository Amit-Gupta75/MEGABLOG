import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Calendar, Edit, Trash2, ArrowLeft, Clock, Share2, Check } from "lucide-react";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? (post.userId === userData.$id || userData.$id.startsWith('demo-user')) : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((res) => {
                if (res) {
                    setPost(res);
                } else {
                    // Local fallback search
                    const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]');
                    const found = localPosts.find(p => p.$id === slug);
                    if (found) {
                        setPost(found);
                    } else {
                        // Sample posts search
                        const samples = [
                            {
                                $id: "getting-started-with-react-19",
                                title: "Mastering React 19: Actions, Server Components & Hooks",
                                content: "<p>React 19 introduces game-changing primitives like Actions, optimistic updates, and built-in asset loading. Learn how to leverage these features in your modern web applications.</p><h3>Key Features in React 19</h3><ul><li><strong>Actions:</strong> Simplify async state transitions and form submissions.</li><li><strong>useActionState &amp; useFormStatus:</strong> Clean hooks for tracking pending states.</li><li><strong>Server Components:</strong> Reduced client bundle size and instant server-side data fetching.</li></ul>",
                                featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
                                status: "active",
                                userId: userData?.$id || "demo-author",
                                $createdAt: new Date().toISOString()
                            },
                            {
                                $id: "building-scalable-cloud-architecture",
                                title: "Building Resilient Cloud Architecture with Serverless & Microservices",
                                content: "<p>Discover best practices for designing auto-scaling, fault-tolerant microservices architectures using modern cloud tools and decoupled databases.</p><p>Microservices allow teams to deploy independently while serverless compute eliminates idle infrastructure expenses.</p>",
                                featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
                                status: "active",
                                userId: userData?.$id || "demo-author",
                                $createdAt: new Date(Date.now() - 86400000).toISOString()
                            },
                            {
                                $id: "designing-accessible-ui-components",
                                title: "The Art of Accessible & Fast Modern Web User Interfaces",
                                content: "<p>Accessibility isn't an afterthought. Learn typography scaling, color contrast mathematics, and keyboard navigation to craft inclusive user experiences.</p>",
                                featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
                                status: "active",
                                userId: userData?.$id || "demo-author",
                                $createdAt: new Date(Date.now() - 172800000).toISOString()
                            }
                        ];
                        const sampleFound = samples.find(s => s.$id === slug);
                        if (sampleFound) {
                            setPost(sampleFound);
                        } else {
                            navigate("/");
                        }
                    }
                }
            }).catch(() => {
                navigate("/");
            }).finally(() => {
                setLoading(false);
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate, userData]);

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            appwriteService.deletePost(post.$id).then((status) => {
                if (status && post.featuredImage) {
                    appwriteService.deleteFile(post.featuredImage);
                }
                // Clean up local storage as well
                const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]');
                const filtered = localPosts.filter(p => p.$id !== post.$id);
                localStorage.setItem('megablog_posts', JSON.stringify(filtered));

                navigate("/");
            });
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedDate = post?.$createdAt 
        ? new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Recent';

    const wordCount = post?.content ? post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return loading ? (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
        </div>
    ) : post ? (
        <div className="py-8 text-left">
            <Container>
                {/* Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to articles
                    </button>

                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        {copied ? "Link Copied!" : "Share"}
                    </button>
                </div>

                <article className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden">
                    {/* Header Image */}
                    <div className="w-full h-72 sm:h-96 relative bg-slate-900">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md ${
                            post.status === 'active' 
                                ? 'bg-emerald-500/90 text-white' 
                                : 'bg-amber-500/90 text-white'
                        }`}>
                            {post.status || 'published'}
                        </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                {readTime} min read
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Author Actions */}
                        {isAuthor && (
                            <div className="mb-8 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                                <span className="text-xs font-medium text-indigo-900 dark:text-indigo-300 pl-2">
                                    Author Controls
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button bgColor="bg-indigo-600 hover:bg-indigo-500" className="text-xs px-3 py-1.5">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit Post
                                        </Button>
                                    </Link>
                                    <Button bgColor="bg-rose-600 hover:bg-rose-500" className="text-xs px-3 py-1.5" onClick={deletePost}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Formatted Article Body */}
                        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base space-y-4">
                            {typeof post.content === 'string' ? parse(post.content) : post.content}
                        </div>
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}
