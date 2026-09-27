import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Tag, Share2, BookOpen } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { apiFetch } from '../services/api';
import { IBlogPost } from '../types';

interface BlogDetailsProps {
  slug: string;
}

export const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<IBlogPost>(`/blog/${slug}`)
      .then((data) => setPost(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs font-mono-spec text-slate-500">
        Loading article content...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Guide Not Found</h1>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
        >
          Return to Blog Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#005B96] font-mono-spec cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <article className="bg-white border border-slate-200 rounded p-8 sm:p-12 shadow-xs">
          {/* Header Metadata */}
          <div className="flex items-center gap-2 text-xs font-mono-spec text-slate-500 mb-3">
            <span className="text-[#005B96] font-bold uppercase">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="font-tech text-2xl sm:text-4xl font-bold text-[#17212B] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="p-4 bg-slate-50 border-l-4 border-[#005B96] border border-slate-200 rounded text-xs sm:text-sm text-slate-700 font-mono-spec mb-8">
            {post.excerpt}
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 font-normal">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-tech text-base sm:text-lg font-bold uppercase text-[#17212B] pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n').map((li) => li.replace('- ', ''));
                return (
                  <ul key={idx} className="space-y-1.5 list-disc pl-5 text-slate-700">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono-spec text-slate-500">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate('/request-quote')}
              className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
            >
              Inquire About Matching Pipes
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
