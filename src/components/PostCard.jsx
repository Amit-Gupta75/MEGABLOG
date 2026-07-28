import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

function PostCard({ $id, title, featuredImage, content, status, $createdAt }) {
  const imageUrl = appwriteService.getFilePreview(featuredImage);
  
  // Clean content snippet
  const snippet = content 
    ? content.replace(/<[^>]*>?/gm, '').slice(0, 100) + (content.length > 100 ? '...' : '') 
    : '';

  const formattedDate = $createdAt 
    ? new Date($createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  return (
    <Link to={`/post/${$id}`} className="group h-full flex flex-col">
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group-hover:-translate-y-1">
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
            }}
          />
          {status && (
            <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${
              status === 'active' 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-amber-500/90 text-white'
            }`}>
              {status}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
            {title}
          </h2>

          {snippet && (
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 flex-grow">
              {snippet}
            </p>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
            Read article
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
