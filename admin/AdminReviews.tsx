import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IReview } from '../types';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IReview[]>('/admin/reviews');
      setReviews(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApprove = async (id: string, current: boolean) => {
    try {
      const updated = await apiFetch<IReview>(`/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved: !current }),
      });
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await apiFetch(`/admin/reviews/${id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            PRODUCT REVIEW MODERATION
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Verify submitted customer feedback. Only approved reviews appear publicly on product pages.
          </p>
        </div>
        <button
          onClick={loadReviews}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-500">No reviews found.</div>
      ) : (
        <div className="divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 bg-white flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{r.customerName}</span>
                  <span className="text-slate-400 text-[11px] font-mono-spec">on {r.productName}</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed max-w-xl">"{r.comment}"</p>

                <div className="flex items-center gap-2 text-[11px] font-mono-spec text-slate-400">
                  <span>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className={r.isApproved ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {r.isApproved ? 'Approved & Public' : 'Pending Approval'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApprove(r.id, r.isApproved)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                    r.isApproved
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {r.isApproved ? 'Unpublish' : 'Approve Review'}
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
