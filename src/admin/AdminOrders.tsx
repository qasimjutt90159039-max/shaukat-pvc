import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Eye, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IOrder } from '../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const statuses: IOrder['orderStatus'][] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IOrder[]>('/admin/orders');
      setOrders(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: IOrder['orderStatus']) => {
    try {
      const updated = await apiFetch<IOrder>(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            ORDER FULFILLMENT &amp; LOGISTICS
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Track Cash on Delivery orders, delivery destinations, and dispatch progress
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search by Order #, Customer, or Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#005B96]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading orders...
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse text-xs font-mono-spec">
            <thead>
              <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Customer &amp; Phone</th>
                <th className="py-2.5 px-3">City / Address</th>
                <th className="py-2.5 px-3">Total (PKR)</th>
                <th className="py-2.5 px-3">Order Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-[#005B96]">{ord.orderNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                    <span className="text-slate-400 text-[11px]">{ord.phone}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-800 block truncate max-w-xs">{ord.address}</span>
                    <span className="text-slate-400 text-[11px]">{ord.city}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    PKR {ord.total.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value as IOrder['orderStatus'])
                      }
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-bold uppercase text-slate-800 focus:outline-none focus:border-[#005B96]"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1 text-[#005B96] hover:bg-slate-100 rounded"
                      title="Inspect items"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full p-6 space-y-4 border border-slate-300 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h2 className="font-tech text-base font-bold uppercase text-[#17212B]">
                Order Details: {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-spec">
              <div><span className="text-slate-400">Customer:</span> <strong className="text-slate-800">{selectedOrder.customerName}</strong> ({selectedOrder.phone})</div>
              <div><span className="text-slate-400">Address:</span> <span>{selectedOrder.address}, {selectedOrder.area || ''}, {selectedOrder.city}</span></div>
              {selectedOrder.deliveryNotes && (
                <div><span className="text-slate-400">Site Notes:</span> <span className="italic text-slate-700">{selectedOrder.deliveryNotes}</span></div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-xs font-bold uppercase text-slate-800 block mb-2">Item Breakdown:</span>
              <div className="space-y-1.5 text-xs font-mono-spec">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <div>
                      <span>{it.productName}</span>
                      <span className="text-slate-400 text-[11px] block">SKU: {it.sku} · Qty: {it.quantity}</span>
                    </div>
                    <span className="font-bold">PKR {(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                  <span>Delivery Logistics:</span>
                  <span>PKR {selectedOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#005B96]">PKR {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
