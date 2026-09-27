import React, { useState, useEffect } from 'react';
import { FileText, Search, Edit2, CheckCircle, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IQuotation } from '../types';

export const AdminQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<IQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<IQuotation | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<IQuotation['status']>('New');
  const [editQuotedAmount, setEditQuotedAmount] = useState<number | undefined>(undefined);

  const statuses: IQuotation['status'][] = [
    'New',
    'Contacted',
    'Quoted',
    'Negotiation',
    'Approved',
    'Rejected',
    'Completed',
  ];

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IQuotation[]>('/admin/quotations');
      setQuotations(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleOpenEdit = (q: IQuotation) => {
    setSelectedQuote(q);
    setEditNotes(q.internalNotes || '');
    setEditStatus(q.status);
    setEditQuotedAmount(q.quotedAmount);
  };

  const handleSaveQuoteUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    try {
      const updated = await apiFetch<IQuotation>(`/admin/quotations/${selectedQuote.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
          quotedAmount: editQuotedAmount,
        }),
      });

      setQuotations((prev) => prev.map((q) => (q.id === selectedQuote.id ? updated : q)));
      setSelectedQuote(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const filtered = quotations.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      (q.company && q.company.toLowerCase().includes(search.toLowerCase())) ||
      q.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            QUOTATIONS &amp; ESTIMATION RFQs
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Review customer project inquiries, set offered amounts, and log follow-up notes
          </p>
        </div>
        <button
          onClick={loadQuotes}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search RFQs by number, contractor, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#005B96]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading quotations...
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse text-xs font-mono-spec">
            <thead>
              <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                <th className="py-2.5 px-3">Quote #</th>
                <th className="py-2.5 px-3">Customer / Company</th>
                <th className="py-2.5 px-3">Product / Qty</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-[#005B96]">{q.quoteNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{q.name}</span>
                    <span className="text-slate-400 text-[11px]">{q.company || q.phone}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-800 block truncate max-w-xs">{q.productName || 'Custom'}</span>
                    <span className="text-slate-500 text-[11px]">{q.quantity} {q.size ? `· ${q.size}` : ''}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{q.deliveryLocation}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.status === 'Quoted' || q.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : q.status === 'New'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#005B96] hover:text-white rounded text-[11px] font-bold uppercase transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Quotation Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full p-6 space-y-4 border border-slate-300 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h2 className="font-tech text-base font-bold uppercase text-[#17212B]">
                Manage RFQ: {selectedQuote.quoteNumber}
              </h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono-spec space-y-1">
              <div><span className="text-slate-400">Client:</span> <strong className="text-slate-900">{selectedQuote.name}</strong> ({selectedQuote.phone})</div>
              <div><span className="text-slate-400">Firm:</span> <span>{selectedQuote.company || 'Private'}</span></div>
              <div><span className="text-slate-400">Products:</span> <span>{selectedQuote.productName} · Qty: {selectedQuote.quantity} ({selectedQuote.size || 'N/A'})</span></div>
              <div><span className="text-slate-400">Location:</span> <span>{selectedQuote.deliveryLocation}</span></div>
              {selectedQuote.message && (
                <div className="pt-1 border-t border-slate-200 text-slate-600 italic">"{selectedQuote.message}"</div>
              )}
            </div>

            <form onSubmit={handleSaveQuoteUpdates} className="space-y-4 text-xs font-mono-spec">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Status Workflow:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as IQuotation['status'])}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2 text-xs font-bold text-slate-800"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Quoted Amount (PKR):</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={editQuotedAmount ?? ''}
                  onChange={(e) => setEditQuotedAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Internal Notes &amp; Follow-up Details:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Called contractor, offered 5% volume rebate on Class C pipe lengths..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border rounded uppercase font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#005B96] hover:bg-[#004370] text-white rounded uppercase font-bold"
                >
                  Save RFQ Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
