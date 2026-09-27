import React, { useState, useEffect } from 'react';
import { Warehouse, RefreshCw, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IInventoryHistory } from '../types';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price?: number;
  variantsCount: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<IInventoryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [reason, setReason] = useState('Stock count adjustment');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ inventory: InventoryItem[]; history: IInventoryHistory[] }>(
        '/admin/inventory'
      );
      setInventory(res.inventory || []);
      setHistory(res.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    try {
      await apiFetch('/admin/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          productId: adjustingItem.id,
          newStock: newStockVal,
          reason,
        }),
      });
      setAdjustingItem(null);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Adjustment failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            INVENTORY &amp; WAREHOUSE STOCK CONTROL
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Real-time stock levels, threshold warnings, and audit adjustment logs
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 cursor-pointer font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading inventory status...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left border-collapse text-xs font-mono-spec">
              <thead>
                <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Threshold Status</th>
                  <th className="py-2.5 px-3 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.sku}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 text-sm">{item.stock}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setAdjustingItem(item);
                          setNewStockVal(item.stock);
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-[#005B96] hover:text-white rounded text-[11px] font-bold uppercase transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit History Log */}
          <div className="border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 font-tech text-xs font-bold uppercase text-slate-800">
              <History className="w-4 h-4 text-[#005B96]" />
              <span>Recent Inventory Adjustments &amp; Audit Logs</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-mono-spec">
              {history.slice(0, 8).map((h) => (
                <div key={h.id} className="py-2 flex justify-between items-center text-slate-700">
                  <div>
                    <span className="font-bold">{h.productName}</span>
                    <span className="text-slate-400 block text-[11px]">Reason: {h.reason}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${h.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.change >= 0 ? `+${h.change}` : h.change} units
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      New Total: {h.newStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full p-5 space-y-4 border border-slate-300 shadow-xl">
            <h3 className="font-tech text-base font-bold uppercase text-[#17212B]">
              Adjust Stock: {adjustingItem.sku}
            </h3>
            <p className="text-xs text-slate-600 font-mono-spec">{adjustingItem.name}</p>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Total Stock Level:</label>
                <input
                  type="number"
                  required
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(parseInt(e.target.value, 10))}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2 text-sm font-bold font-mono-spec"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adjustment Reason:</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-3 py-1.5 border rounded uppercase font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005B96] text-white rounded uppercase font-bold"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
