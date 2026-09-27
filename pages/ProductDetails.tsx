import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  FileText,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowLeft,
  Star,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { IProduct, IProductVariant, IReview } from '../types';
import { SpecificationTable } from '../components/SpecificationTable';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  slug: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await apiFetch<IProduct>(`/products/${slug}`);
        setProduct(prod);
        setSelectedImage(prod.images[0] || '');
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }

        // Fetch related and reviews
        const [relRes, revRes] = await Promise.all([
          apiFetch<IProduct[]>(`/products/related/${slug}`),
          apiFetch<IReview[]>(`/reviews?productId=${prod.id}`),
        ]);
        setRelated(relRes || []);
        setReviews(revRes || []);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#005B96] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-mono-spec">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Product Not Found</h1>
        <p className="text-xs text-slate-500">The requested pipe or fitting specification could not be located.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const isAvailable = product.stock > 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewMessage('Please log in with a customer account to submit a verified product review.');
      return;
    }
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment: reviewComment.trim(),
        }),
      });
      setReviewMessage('Review submitted! It will appear publicly upon administrative moderation.');
      setReviewComment('');
    } catch (err: unknown) {
      setReviewMessage(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#005B96] font-mono-spec cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>

          <div className="text-[11px] font-mono-spec text-slate-500">
            <span>Shop</span> / <span className="uppercase text-[#005B96] font-semibold">{product.category}</span> / <span>{product.sku}</span>
          </div>
        </div>

        {/* Demo Product Notice Banner */}
        {product.isDemo && (
          <div className="mb-6 p-3 bg-amber-100 border border-amber-300 rounded text-amber-900 text-xs font-mono-spec flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider">DEMO PRODUCT — VERIFY BEFORE LAUNCH</span>
              <span className="hidden md:inline text-amber-700">| Sample specs for development testing. Confirm pricing &amp; stock with store.</span>
            </div>
            <a href="tel:+92614540198" className="font-bold underline hover:text-amber-950">
              Call Shop: +92-61-4540198
            </a>
          </div>
        )}

        {/* Main Product Layout: Gallery (Left) + Details & Options (Right) */}
        <div className="bg-white border border-slate-200 rounded p-6 lg:p-8 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isSale && (
                    <span className="bg-[#00A6A6] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      SALE
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-[#005B96] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      NEW SPEC
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded border bg-slate-50 p-1 overflow-hidden transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#005B96] ring-2 ring-[#005B96]/30'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Name, SKU, Pricing, Variants & Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-spec text-slate-500 mb-2">
                  <span className="uppercase text-[#005B96] font-bold">{product.category.replace('-', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>SKU: {selectedVariant?.sku || product.sku}</span>
                  {product.brand && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Brand: {product.brand}</span>
                    </>
                  )}
                </div>

                <h1 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] leading-tight mb-3">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {product.shortDescription || product.description}
                </p>

                {/* Price Display */}
                <div className="py-3 px-4 bg-slate-50 border border-slate-200 rounded mb-6 flex items-baseline justify-between">
                  <div>
                    {currentPrice !== undefined ? (
                      <div className="flex items-baseline gap-3">
                        <span className="font-tech text-2xl sm:text-3xl font-bold text-[#005B96]">
                          PKR {currentPrice.toLocaleString()}
                        </span>
                        {product.salePrice && product.price && (
                          <span className="text-sm text-slate-400 line-through">
                            PKR {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[#00A6A6]">
                        Contact Store for Custom Quote
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Cash on Delivery · Standard Multan Delivery Available
                    </span>
                  </div>

                  <div className="text-right">
                    {isAvailable ? (
                      <span className="text-xs font-mono-spec text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="text-xs font-mono-spec text-rose-600 font-semibold flex items-center gap-1 justify-end">
                        <AlertCircle className="w-4 h-4 text-rose-500" /> Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Variants Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Select Diameter / Length / Sizing Variant:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        const label = [v.diameter, v.length, v.color].filter(Boolean).join(' · ');
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`p-2.5 text-left border rounded text-xs font-mono-spec transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#005B96] bg-[#005B96] text-white shadow-xs'
                                : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                            }`}
                          >
                            <div className="font-semibold">{label}</div>
                            <div className="text-[11px] opacity-80 flex justify-between mt-1">
                              <span>SKU: {v.sku}</span>
                              {v.price && <span>PKR {v.price}</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-300 rounded bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-mono-spec font-bold text-xs text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!isAvailable}
                      className={`flex-1 py-3 px-6 text-xs font-tech font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer ${
                        isAvailable
                          ? addedNotice
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#005B96] hover:bg-[#004370] text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{addedNotice ? 'Added to Cart!' : isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Wishlist"
                      className={`p-3 border rounded transition-colors cursor-pointer ${
                        wishlisted
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-slate-300 text-slate-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  {/* Secondary Quotes CTA */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/request-quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(
                            selectedVariant?.sku || product.sku
                          )}&size=${encodeURIComponent(selectedVariant?.diameter || product.diameter || '')}`
                        )
                      }
                      className="py-2.5 px-4 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] text-xs font-tech font-bold uppercase rounded text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Request a Quote</span>
                    </button>

                    <a
                      href="tel:+92614540198"
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-tech font-bold uppercase rounded text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-[#00A6A6]" />
                      <span>Call +92-61-4540198</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Store Guarantee Strip */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-mono-spec text-slate-500">
                <span className="flex items-center gap-1 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-[#00A6A6]" /> Genuine Polymer
                </span>
                <span>·</span>
                <span>Payment: Cash on Delivery</span>
                <span>·</span>
                <span>Multan Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections: Description, Technical Specs, Applications */}
        <div className="space-y-8 mb-12">
          {/* TECHNICAL SPECIFICATIONS TABLE */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <h2 className="font-tech text-lg font-bold text-[#17212B] uppercase">
                TECHNICAL SPECIFICATIONS
              </h2>
              <span className="text-xs font-mono-spec text-slate-400">· Factory Data Sheet</span>
            </div>
            <SpecificationTable product={product} />
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
            <h2 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-3 pb-2 border-b border-slate-200">
              PRODUCT DESCRIPTION
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{product.description}</p>
              {product.shortDescription && <p className="italic text-slate-500">{product.shortDescription}</p>}
            </div>
          </div>

          {/* APPLICATIONS */}
          {product.application && (
            <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
              <h2 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-3 pb-2 border-b border-slate-200">
                RECOMMENDED APPLICATIONS
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono-spec">
                {product.application}
              </p>
            </div>
          )}

          {/* REVIEWS & RATINGS */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h2 className="font-tech text-lg font-bold text-[#17212B] uppercase">
                CUSTOMER REVIEWS &amp; VERIFIED FEEDBACK
              </h2>
              <span className="text-xs font-mono-spec text-slate-500">
                {reviews.length} Approved Review{reviews.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* List Reviews */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic mb-6">
                No customer reviews submitted for this specification yet.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{rev.customerName}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 font-mono-spec block mt-1">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-200 max-w-lg space-y-3">
              <h3 className="font-tech text-xs font-bold uppercase text-slate-800">
                Submit Product Review
              </h3>

              {reviewMessage && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 text-[#005B96] text-xs rounded">
                  {reviewMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1 to 5):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback Comment:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details on pressure holding, socket jointing, or wall thickness..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer hover:bg-[#004370]"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review for Approval'}
              </button>
            </form>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-tech text-xl font-bold uppercase text-[#17212B]">
              RELATED PIPE SPECIFICATIONS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
