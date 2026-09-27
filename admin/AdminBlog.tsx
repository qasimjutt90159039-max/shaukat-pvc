import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IBlogPost } from '../types';

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<IBlogPost> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IBlogPost[]>('/admin/blog');
      setPosts(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Plumbing Engineering',
      tags: ['Plumbing', 'PVC Pipes'],
      readTime: '5 min read',
      published: true,
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: IBlogPost) => {
    setEditingPost({ ...post });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await apiFetch(`/admin/blog/${id}`, { method: 'DELETE' });
      loadPosts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setErrorMsg(null);

    try {
      if (editingPost.id) {
        await apiFetch(`/admin/blog/${editingPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingPost),
        });
      } else {
        await apiFetch('/admin/blog', {
          method: 'POST',
          body: JSON.stringify(editingPost),
        });
      }
      setModalOpen(false);
      setEditingPost(null);
      loadPosts();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            EDUCATIONAL BLOG ARTICLES
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Publish technical guides on pipe classes, fitting standards, and plumbing sizing
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading articles...
        </div>
      ) : (
        <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-white flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-spec">
                  <span className="font-bold text-[#005B96] uppercase">{post.category}</span>
                  <span>·</span>
                  <span className={post.published ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-tech text-base font-bold text-slate-900">{post.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="p-1.5 text-slate-600 hover:text-[#005B96] border rounded"
                  title="Edit article"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 border rounded"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-300 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h2 className="font-tech text-base font-bold uppercase text-[#17212B]">
                {editingPost.id ? 'Edit Technical Article' : 'Compose Technical Guide'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={editingPost.readTime || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Guide Content *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Use paragraphs or markdown headers (###) for sections..."
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2.5 font-mono-spec"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingPost.published || false}
                  onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                />
                <span>Published &amp; Publicly Accessible</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded uppercase font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#005B96] text-white rounded uppercase font-bold"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
