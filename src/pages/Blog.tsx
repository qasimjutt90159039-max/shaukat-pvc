import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Tag, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { apiFetch } from '../services/api';
import { IBlogPost } from '../types';

export const Blog: React.FC = () => {
  const { navigate } = useRouter();
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<IBlogPost[]>('/blog')
      .then((data) => setPosts(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-slate-200">
          <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
            PLUMBING ENGINEERING &amp; EDUCATIONAL GUIDES
          </div>
          <h1 className="font-tech text-3xl sm:text-4xl font-bold uppercase text-[#17212B]">
            PVC TECHNICAL &amp; SIZING ARTICLES
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Educational references on pipe pressure classes, hydraulic flow calculations, fitting geometries, and maintenance practices.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div className="mb-8 p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 font-mono-spec">
          NOTE: The following articles are provided for general educational purposes. Actual plumbing installations should be verified with qualified site engineers and local building codes.
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs font-mono-spec text-slate-500">
            Loading technical guides...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-white border border-slate-200 rounded p-6 shadow-xs hover:border-[#005B96] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono-spec text-slate-500 mb-2">
                    <span className="text-[#005B96] font-bold uppercase">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-tech text-xl font-bold text-[#17212B] hover:text-[#005B96] transition-colors leading-snug mb-3">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1.5 font-mono-spec text-[10px] text-slate-500">
                    {post.tags.map((t) => (
                      <span key={t}>#{t}</span>
                    ))}
                  </div>

                  <span className="font-bold text-[#005B96] flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
