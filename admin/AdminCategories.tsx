import React, { useState, useEffect } from 'react';
import { Layers, RefreshCw } from 'lucide-react';
import { apiFetch } from '../services/api';
import { ICategory } from '../types';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<ICategory[]>('/categories');
      setCategories(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            PRODUCT CATEGORIES &amp; DIVISIONS
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Main product groups, subcategories, and live item counts
          </p>
        </div>
        <button
          onClick={loadCategories}
          className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 text-xs flex items-center gap-1 font-mono-spec"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="border border-slate-200 rounded p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-tech text-base font-bold uppercase text-[#17212B]">
                  {c.name}
                </h3>
                <span className="text-xs font-mono-spec text-[#005B96] font-bold">
                  {c.productCount ?? 0} Products
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono-spec text-slate-400 block mb-1">
                  Configured Subcategories:
                </span>
                <div className="flex flex-wrap gap-1">
                  {c.subcategories.map((sc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono-spec text-slate-700"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
