import React, { useState } from 'react';
import { X, ShoppingCart, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { IProduct, IProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface QuickViewModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { navigate } = useRouter();

  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | undefined>(() => {
    return product?.variants && product.variants.length > 0 ? product.variants[0] : undefined;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const isAvailable = product.stock > 0;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-300 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {product.isDemo && (
          <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900 font-mono-spec text-center">
            DEMO PRODUCT — VERIFY BEFORE LAUNCH
          </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 flex items-center justify-center">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80';
              }}
              className="max-h-64 object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono-spec text-slate-500 uppercase mb-1">
                <span className="text-[#005B96] font-semibold">{product.category}</span> · SKU: {product.sku}
              </div>
              <h2 className="text-base font-bold text-[#17212B] leading-tight mb-2">
                {product.name}
              </h2>

              <p className="text-xs text-slate-600 mb-4 line-clamp-3">
                {product.shortDescription || product.description}
              </p>

              {/* Price */}
              <div className="mb-4">
                {currentPrice !== undefined ? (
                  <div className="flex items-baseline gap-2">
                    <span className="font-tech text-xl font-bold text-[#005B96]">
                      PKR {currentPrice.toLocaleString()}
                    </span>
                    {product.salePrice && product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        PKR {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-[#00A6A6]">Quote Required</span>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Select Sizing / Variant:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const label = [v.diameter, v.length, v.color].filter(Boolean).join(' · ');
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-2.5 py-1 text-xs font-mono-spec rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#005B96] bg-[#005B96] text-white font-bold'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {label} {v.price ? `(PKR ${v.price})` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <label className="text-xs font-semibold text-slate-700 uppercase">Quantity:</label>
                <div className="flex items-center border border-slate-300 rounded">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono-spec font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!isAvailable}
                  className={`py-2 px-3 text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isAvailable
                      ? added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#005B96] hover:bg-[#004370] text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{added ? 'Added!' : isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/request-quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku)}`);
                  }}
                  className="py-2 px-3 border border-[#F5A623] hover:bg-[#F5A623] text-[#17212B] text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#F5A623]" />
                  <span>Request Quote</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.slug || product.id}`);
                }}
                className="w-full text-center text-xs text-[#005B96] hover:underline font-semibold py-1 cursor-pointer"
              >
                View Full Technical Specifications &amp; Applications &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
