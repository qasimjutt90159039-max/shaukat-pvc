import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  FileText,
  Building2,
  AlertTriangle,
  Mail,
  Star,
  ArrowRight,
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { IOrder, IQuotation, IProduct } from '../types';

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    totalQuotations: number;
    totalBulkOrders: number;
    lowStockProducts: number;
    unreadMessages: number;
    pendingReviews: number;
  };
  recentOrders: IOrder[];
  recentQuotations: IQuotation[];
  lowStockList: IProduct[];
}

export const AdminDashboard: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardData>('/admin/dashboard')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-16 text-center text-xs font-mono-spec text-slate-500">
        Loading real-time store metrics...
      </div>
    );
  }

  const { stats, recentOrders, recentQuotations, lowStockList } = data;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-[#005B96]', bg: 'bg-[#005B96]/10' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-[#00A6A6]', bg: 'bg-[#00A6A6]/10' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Revenue (PKR)', value: stats.totalRevenue.toLocaleString(), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Quote RFQs', value: stats.totalQuotations, icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Bulk Requests', value: stats.totalBulkOrders, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Low Stock Items', value: stats.lowStockProducts, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-2xl font-bold uppercase text-[#17212B]">
            STORE DASHBOARD &amp; OPERATIONS
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Live database records for Shaukat PVC Plastic Pipe Shop, Multan
          </p>
        </div>
        <div className="text-xs font-mono-spec text-slate-500">
          Last Synced: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 10 Live Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded p-3.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono-spec text-slate-500 uppercase font-semibold">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded ${card.bg} ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="font-tech text-xl font-bold text-slate-900">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alerts */}
      {lowStockList.length > 0 && (
        <div className="border border-rose-200 bg-rose-50/50 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase font-mono-spec">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Low Inventory Alert (&le; 15 units remaining)</span>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-rose-700 hover:underline font-semibold"
            >
              Manage Inventory &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockList.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-rose-200 rounded p-2.5 text-xs font-mono-spec flex justify-between items-center"
              >
                <div className="truncate mr-2">
                  <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                  <span className="text-slate-400 text-[11px]">SKU: {p.sku}</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-xs">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tables: Recent Orders & Recent Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="border border-slate-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-tech text-sm font-bold uppercase text-[#17212B]">
              Recent Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-[11px] text-[#005B96] hover:underline font-semibold"
            >
              View All Orders &rarr;
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs font-mono-spec">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">{ord.orderNumber}</span>
                    <span className="text-slate-500 block text-[11px]">
                      {ord.customerName} · {ord.city}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#005B96] block">
                      PKR {ord.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded uppercase font-semibold">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quotation Requests */}
        <div className="border border-slate-200 rounded p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-tech text-sm font-bold uppercase text-[#17212B]">
              Recent Quotation RFQs
            </h3>
            <button
              onClick={() => onNavigateTab('quotations')}
              className="text-[11px] text-[#005B96] hover:underline font-semibold"
            >
              View All RFQs &rarr;
            </button>
          </div>

          {recentQuotations.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No quotes logged yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs font-mono-spec">
              {recentQuotations.map((q) => (
                <div key={q.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">{q.quoteNumber}</span>
                    <span className="text-slate-500 block text-[11px]">
                      {q.name} ({q.company || 'Private'})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-600 block truncate max-w-36">
                      {q.productName || 'Custom'}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1 rounded font-bold uppercase">
                      {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
