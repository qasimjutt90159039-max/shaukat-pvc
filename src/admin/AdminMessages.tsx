import React, { useState, useEffect } from 'react';
import { Mail, Phone, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IContactMessage } from '../types';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IContactMessage[]>('/admin/messages');
      setMessages(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleUpdateStatus = async (id: string, status: IContactMessage['status']) => {
    try {
      const updated = await apiFetch<IContactMessage>(`/admin/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer inquiry?')) return;
    try {
      await apiFetch(`/admin/messages/${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            STORE CONTACT INQUIRIES
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Messages submitted via the store contact form
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-500">No messages in inbox.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded border transition-colors ${
                m.status === 'unread'
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs font-mono-spec">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                  <a href={`tel:${m.phone}`} className="text-[#005B96] font-bold hover:underline">
                    {m.phone}
                  </a>
                  {m.email && <span className="text-slate-500">{m.email}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.status === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : m.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m.status}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {m.subject && (
                <div className="pt-2 font-bold text-xs text-slate-800">
                  Subject: {m.subject}
                </div>
              )}

              <p className="text-xs text-slate-700 leading-relaxed py-2">
                {m.message}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {m.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'replied')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold uppercase"
                    >
                      Mark Replied
                    </button>
                  )}
                  {m.status === 'unread' && (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'read')}
                      className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-[11px] font-bold uppercase"
                    >
                      Mark Read
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                  title="Delete message"
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
