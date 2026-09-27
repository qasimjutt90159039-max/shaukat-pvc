import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';
import { apiFetch } from '../services/api';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<CustomerRecord[]>('/admin/customers');
      setCustomers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            CUSTOMER DIRECTORY &amp; ACCOUNTS
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Registered customer accounts, contact details, and lifetime purchase totals
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
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#005B96]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading customer records...
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse text-xs font-mono-spec">
            <thead>
              <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                <th className="py-2.5 px-3">Customer Name</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Contact Phone</th>
                <th className="py-2.5 px-3">Total Orders</th>
                <th className="py-2.5 px-3">Total Spent (PKR)</th>
                <th className="py-2.5 px-3 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{c.email}</td>
                  <td className="py-2.5 px-3">{c.phone}</td>
                  <td className="py-2.5 px-3 font-bold">{c.orderCount}</td>
                  <td className="py-2.5 px-3 font-bold text-[#005B96]">
                    PKR {c.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
