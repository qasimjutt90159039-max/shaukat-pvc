import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../services/api';
import { IProduct } from '../types';

export const Wishlist: React.FC = () => {
  const { navigate } = useRouter();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch<{ products: IProduct[] }>('/products?limit=100');
        const matched = res.products.filter((p) => wishlistIds.includes(p.id));
        setProducts(matched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h1 className="font-tech text-2xl sm:text-3xl font-bold uppercase text-[#17212B]">
            MY SAVED ITEMS &amp; WISHLIST
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec mt-0.5">
            {wishlistIds.length} item{wishlistIds.length === 1 ? '' : 's'} saved for future procurement
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs font-mono-spec text-slate-500">
            Loading saved items...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-tech text-xl font-bold uppercase text-slate-800">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore our PVC pipes, high-pressure fittings, and valves catalog and click the heart icon on any product to save it here.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
            >
              Browse PVC Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const displayPrice = product.salePrice ?? product.price;
              const isInStock = product.stock > 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between shadow-xs hover:border-[#005B96] transition-all"
                >
                  <div>
                    <div className="aspect-4/3 bg-slate-50 border border-slate-100 rounded p-2 mb-3 flex items-center justify-center relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        title="Remove from Wishlist"
                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-600 rounded-full hover:bg-white shadow-xs cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] font-mono-spec text-[#005B96] font-semibold uppercase mb-1">
                      {product.category} · SKU: {product.sku}
                    </div>

                    <h3
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                      className="font-semibold text-xs sm:text-sm text-slate-900 hover:text-[#005B96] cursor-pointer line-clamp-2 mb-2"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      {displayPrice !== undefined ? (
                        <span className="font-tech text-base font-bold text-[#005B96]">
                          PKR {displayPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#00A6A6]">Quote Required</span>
                      )}
                      <span className="text-[11px] font-mono-spec text-slate-500">
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (!isInStock) return;
                        addToCart(product, product.variants?.[0], 1);
                        toggleWishlist(product.id);
                      }}
                      disabled={!isInStock}
                      className={`w-full py-2 px-3 text-xs font-tech font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isInStock
                          ? 'bg-[#005B96] hover:bg-[#004370] text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{isInStock ? 'Move to Cart' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
