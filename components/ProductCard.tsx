import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { IProduct } from '../types';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: IProduct;
  onQuickView?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [addedNotice, setAddedNotice] = useState(false);

  const isInStock = product.stock > 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInStock) return;
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addToCart(product, defaultVariant, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`);
  };

  const displayPrice = product.salePrice ?? product.price;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-slate-200 hover:border-[#005B96] rounded transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer relative"
    >
      {/* Top Banner for Demo Product Notice */}
      {product.isDemo && (
        <div className="bg-amber-100/90 text-amber-900 border-b border-amber-200 px-2.5 py-1 text-[10px] font-mono-spec font-medium text-center truncate">
          DEMO PRODUCT — VERIFY BEFORE LAUNCH
        </div>
      )}

      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Dynamic Status / Promo Badges (Clean square industrial badges) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.isSale && (
            <span className="bg-[#00A6A6] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#005B96] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#17212B] text-[#F5A623] text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors cursor-pointer ${
            wishlisted
              ? 'bg-red-50 text-red-600'
              : 'bg-white/80 text-slate-500 hover:text-red-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px] flex items-center gap-1 font-medium"
          >
            <Eye className="w-3.5 h-3.5 text-[#005B96]" />
            <span>Preview</span>
          </button>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100">
        <div>
          {/* Metadata: Category and SKU (Clean unboxed inline text) */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono-spec mb-1">
            <span className="uppercase text-[#005B96] font-semibold">{product.category.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>SKU: {product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-[#17212B] group-hover:text-[#005B96] transition-colors line-clamp-2 mb-1.5">
            {product.name}
          </h3>

          {/* Technical Specs Preview */}
          <div className="text-[11px] text-slate-600 space-y-0.5 mb-3 font-mono-spec bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Material:</span>
              <span className="font-medium text-slate-800 truncate ml-1">{product.material}</span>
            </div>
            {product.diameter && (
              <div className="flex justify-between">
                <span className="text-slate-400">Diameter:</span>
                <span className="font-medium text-slate-800 truncate ml-1">{product.diameter}</span>
              </div>
            )}
            {product.pressureRating && (
              <div className="flex justify-between">
                <span className="text-slate-400">Rating:</span>
                <span className="font-medium text-slate-800 truncate ml-1">{product.pressureRating}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Price & Stock Line */}
          <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 mb-3">
            <div>
              {displayPrice !== undefined ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-tech text-base font-bold text-[#005B96]">
                    PKR {displayPrice.toLocaleString()}
                  </span>
                  {product.salePrice && product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      PKR {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-[#00A6A6]">Quote On Request</span>
              )}
            </div>

            <div className="text-[11px] font-mono-spec flex items-center gap-1">
              {isInStock ? (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3 text-rose-500" /> Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`py-2 px-2 text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isInStock
                  ? addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#005B96] hover:bg-[#004370] text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{addedNotice ? 'Added!' : isInStock ? 'Add to Cart' : 'Sold Out'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/request-quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku)}`);
              }}
              className="py-2 px-2 border border-[#F5A623] hover:bg-[#F5A623] text-[#17212B] text-xs font-bold uppercase rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#F5A623] group-hover:text-[#17212B]" />
              <span>RFQ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
