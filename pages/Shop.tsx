import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { apiFetch } from '../services/api';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

interface ShopProps {
  fixedCategory?: string;
  categoryTitle?: string;
}

export const Shop: React.FC<ShopProps> = ({ fixedCategory, categoryTitle }) => {
  const { query, navigate } = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    fixedCategory || query.category || 'all'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(query.search || '');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('featured');

  useEffect(() => {
    if (fixedCategory) {
      setSelectedCategory(fixedCategory);
    } else if (query.category) {
      setSelectedCategory(query.category);
    }
    if (query.search) {
      setSearchQuery(query.search);
    }
  }, [fixedCategory, query.category, query.search]);

  // Fetch Categories
  useEffect(() => {
    apiFetch<ICategory[]>('/categories')
      .then((cats) => setCategories(cats || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Products with filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        if (selectedSubcategory && selectedSubcategory !== 'all') {
          params.set('subcategory', selectedSubcategory);
        }
        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }
        if (selectedDiameter && selectedDiameter !== 'all') {
          params.set('diameter', selectedDiameter);
        }
        if (selectedMaterial && selectedMaterial !== 'all') {
          params.set('material', selectedMaterial);
        }
        if (inStockOnly) {
          params.set('inStock', 'true');
        }
        if (sortOption) {
          params.set('sort', sortOption);
        }
        params.set('page', String(page));
        params.set('limit', '12');

        const res = await apiFetch<{
          products: IProduct[];
          total: number;
          totalPages: number;
        }>(`/products?${params.toString()}`);

        setProducts(res.products || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Failed fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    selectedDiameter,
    selectedMaterial,
    inStockOnly,
    sortOption,
    page,
  ]);

  const handleResetFilters = () => {
    if (!fixedCategory) {
      setSelectedCategory('all');
    }
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSelectedDiameter('all');
    setSelectedMaterial('all');
    setInStockOnly(false);
    setSortOption('featured');
    setPage(1);
  };

  const diameters = ['all', '1/2 inch', '3/4 inch', '1 inch', '1.25 inch', '1.5 inch', '2 inch', '3 inch', '4 inch', '6 inch'];
  const materials = ['all', 'uPVC', 'Schedule 40', 'PVC-U', 'Galvanized', 'PPR-C', 'CPVC', 'HDPE'];

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Header / Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-spec mb-1">
              <span onClick={() => navigate('/')} className="hover:underline cursor-pointer">
                Home
              </span>
              <span aria-hidden="true">/</span>
              <span className="text-[#005B96] font-semibold">
                {categoryTitle || (selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'STORE CATALOG')}
              </span>
            </div>
            <h1 className="font-tech text-2xl sm:text-3xl font-bold uppercase text-[#17212B]">
              {categoryTitle || (selectedCategory !== 'all' ? selectedCategory.replace('-', ' ').toUpperCase() : 'ALL PVC & PLUMBING PRODUCTS')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-mono-spec">
              Showing {total} product item{total === 1 ? '' : 's'} in database catalog
            </p>
          </div>

          {/* Search bar inside Shop */}
          <div className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-2 bg-white border border-slate-300 rounded text-slate-700 hover:text-[#005B96] flex items-center gap-1.5 text-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Left Filter Panel + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded p-5 space-y-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 font-tech font-bold text-sm text-[#17212B] uppercase">
                <SlidersHorizontal className="w-4 h-4 text-[#005B96]" />
                <span>Filters &amp; Sizing</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 hover:text-[#005B96] flex items-center gap-1 font-mono-spec cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter (if not fixed) */}
            {!fixedCategory && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Category
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setPage(1);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#005B96] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setPage(1);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded transition-colors flex justify-between items-center ${
                        selectedCategory === c.slug
                          ? 'bg-[#005B96] text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{c.name}</span>
                      {c.productCount !== undefined && (
                        <span className="text-[10px] opacity-75 font-mono-spec">
                          ({c.productCount})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Diameter Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Nominal Diameter
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono-spec">
                {diameters.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDiameter(d);
                      setPage(1);
                    }}
                    className={`px-2 py-1 text-center rounded border transition-colors cursor-pointer ${
                      selectedDiameter === d
                        ? 'border-[#005B96] bg-[#005B96] text-white font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {d === 'all' ? 'Any Dia' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Pipe Material
              </label>
              <div className="space-y-1 text-xs font-mono-spec">
                {materials.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMaterial(m);
                      setPage(1);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                      selectedMaterial === m
                        ? 'bg-[#00A6A6] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {m === 'all' ? 'All Materials' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded text-[#005B96] focus:ring-[#005B96]"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* MAIN PRODUCT AREA */}
          <main className="lg:col-span-9 space-y-6">
            {/* Sorting & Result Counts Bar */}
            <div className="bg-white border border-slate-200 rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-mono-spec">
                Showing {products.length} of {total} products
              </span>

              <div className="flex items-center gap-2">
                <label className="text-slate-500 font-medium">Sort By:</label>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#005B96]"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Additions</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded p-12 text-center space-y-4">
                <p className="text-base font-bold text-slate-800">No products match your filters</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing some filter criteria, adjusting diameter requirements, or searching for general product terms like uPVC or Class C.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold rounded uppercase cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-300 rounded text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono-spec text-slate-700 px-3">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-300 rounded text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-tech font-bold text-sm uppercase">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                Nominal Diameter
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono-spec">
                {diameters.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDiameter(d);
                      setPage(1);
                      setMobileFilterOpen(false);
                    }}
                    className={`px-2 py-1.5 text-center rounded border ${
                      selectedDiameter === d
                        ? 'bg-[#005B96] text-white font-bold'
                        : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
