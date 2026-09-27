import React, { useState, useEffect } from 'react';
import { Building2, Search, RefreshCw, CheckCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IBulkOrder } from '../types';

export const AdminBulkOrders: React.FC = () => {
  const [bulkOrders, setBulkOrders] = useState<IBulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBulk, setSelectedBulk] = useState<IBulkOrder | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [status, setStatus] = useState<IBulkOrder['status']>('New');

  const statuses: IBulkOrder['status'][] = [
    'New',
    'Contacted',
    'Quoted',
    'In Progress',
    'Completed',
    'Closed',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IBulkOrder[]>('/admin/bulk-orders');
      setBulkOrders(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (b: IBulkOrder) => {
    setSelectedBulk(b);
    setInternalNotes(b.internalNotes || '');
    setStatus(b.status);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBulk) return;

    try {
      const updated = await apiFetch<IBulkOrder>(`/admin/bulk-orders/${selectedBulk.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, internalNotes }),
      });
      setBulkOrders((prev) => prev.map((b) => (b.id === selectedBulk.id ? updated : b)));
      setSelectedBulk(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const filtered = bulkOrders.filter(
    (b) =>
      b.bulkOrderNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.company && b.company.toLowerCase().includes(search.toLowerCase())) ||
      b.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            CONTRACTOR BULK INQUIRIES
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            High-volume commercial pipeline lots and infrastructure procurement
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search bulk inquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#005B96]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading bulk orders...
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse text-xs font-mono-spec">
            <thead>
              <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                <th className="py-2.5 px-3">Bulk ID</th>
                <th className="py-2.5 px-3">Contractor / Firm</th>
                <th className="py-2.5 px-3">Product / Sizing</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-[#005B96]">{b.bulkOrderNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{b.name}</span>
                    <span className="text-slate-400 text-[11px]">{b.company || b.phone}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-800 block truncate max-w-xs">{b.product}</span>
                    <span className="text-slate-500 text-[11px]">{b.requiredSize}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{b.requiredQuantity}</td>
                  <td className="py-2.5 px-3 text-slate-600">{b.deliveryCity}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#005B96] hover:text-white rounded text-[11px] font-bold uppercase transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBulk && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full p-6 space-y-4 border border-slate-300 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h2 className="font-tech text-base font-bold uppercase text-[#17212B]">
                Bulk Order: {selectedBulk.bulkOrderNumber}
              </h2>
              <button onClick={() => setSelectedBulk(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono-spec space-y-1">
              <div><span className="text-slate-400">Firm:</span> <strong className="text-slate-900">{selectedBulk.company || 'Private'}</strong> ({selectedBulk.name})</div>
              <div><span className="text-slate-400">Phone:</span> <span>{selectedBulk.phone}</span></div>
              <div><span className="text-slate-400">Requirement:</span> <span>{selectedBulk.product} · {selectedBulk.requiredSize} (Qty: {selectedBulk.requiredQuantity})</span></div>
              <div><span className="text-slate-400">City:</span> <span>{selectedBulk.deliveryCity}</span></div>
              {selectedBulk.message && <div className="text-slate-600 italic pt-1">"{selectedBulk.message}"</div>}
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono-spec">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Status Workflow:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IBulkOrder['status'])}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2 text-xs font-bold"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Internal Notes:</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBulk(null)}
                  className="px-4 py-2 border rounded uppercase font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#005B96] text-white rounded uppercase font-bold"
                >
                  Save Bulk Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
