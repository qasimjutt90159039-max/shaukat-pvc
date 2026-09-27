import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Check, X, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IProduct, ICategory } from '../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<IProduct> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch<{ products: IProduct[] }>('/products?limit=100'),
        apiFetch<ICategory[]>('/categories'),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      slug: '',
      category: categories[0]?.slug || 'pvc-pipes',
      subcategory: 'Water Supply Pipes',
      sku: `SH-PVC-${Math.floor(100 + Math.random() * 900)}`,
      price: 1000,
      stock: 50,
      material: 'uPVC',
      diameter: '1 inch',
      length: '10 ft',
      color: 'White',
      application: 'Water Supply',
      pressureRating: 'Class C (9.0 Bar)',
      shortDescription: '',
      description: '',
      images: ['https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'],
      isNew: true,
      isFeatured: false,
      isSale: false,
      isDemo: false,
      variants: [],
      technicalSpecifications: {
        material: 'uPVC Grade 1',
        connectionType: 'Solvent Weld Socket',
        pressureRating: '9.0 Bar',
        operatingTemp: '0°C to 50°C',
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod: IProduct) => {
    setEditingProduct({ ...prod });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setErrorMsg(null);

    try {
      if (editingProduct.id) {
        // Update
        await apiFetch(`/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingProduct),
        });
      } else {
        // Create
        await apiFetch('/admin/products', {
          method: 'POST',
          body: JSON.stringify(editingProduct),
        });
      }
      setModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="font-tech text-xl font-bold uppercase text-[#17212B]">
            PRODUCT CATALOG MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec">
            Add, modify dimensions, adjust prices, or remove PVC supplies
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Filter by name, SKU or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#005B96]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
          Loading products...
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17212B] text-white font-tech uppercase text-[11px]">
                <th className="py-2.5 px-3">Item / Image</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Price (PKR)</th>
                <th className="py-2.5 px-3">Stock</th>
                <th className="py-2.5 px-3">Badges</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono-spec">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 flex items-center gap-2">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-8 h-8 object-contain bg-slate-50 rounded border border-slate-200"
                    />
                    <div className="truncate max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                      <span className="text-slate-400 text-[10px]">{p.material} · {p.diameter || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[#005B96] font-semibold">{p.category}</td>
                  <td className="py-2.5 px-3">{p.sku}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {p.salePrice ? p.salePrice.toLocaleString() : p.price ? p.price.toLocaleString() : 'Quote'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.stock > 10
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.stock > 0
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 space-x-1">
                    {p.isFeatured && <span className="text-[10px] font-bold text-[#F5A623]">FEAT</span>}
                    {p.isNew && <span className="text-[10px] font-bold text-[#005B96]">NEW</span>}
                    {p.isDemo && <span className="text-[10px] font-bold text-amber-600">DEMO</span>}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1 text-slate-600 hover:text-[#005B96]"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-slate-600 hover:text-rose-600"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-300 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h2 className="font-tech text-base font-bold uppercase text-[#17212B]">
                {editingProduct.id ? 'Edit Product Specification' : 'Add New PVC Item'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Warehouse Stock *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="e.g. uPVC, Schedule 40"
                    value={editingProduct.material || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Diameter</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 inch (25mm)"
                    value={editingProduct.diameter || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, diameter: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pressure Rating</label>
                  <input
                    type="text"
                    placeholder="e.g. PN16 / Class C"
                    value={editingProduct.pressureRating || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pressureRating: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2 font-mono-spec"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                  />
                  <span>Mark as New</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSale || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isSale: e.target.checked })}
                  />
                  <span>Mark on Sale</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#005B96] hover:bg-[#004370] text-white rounded uppercase font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
