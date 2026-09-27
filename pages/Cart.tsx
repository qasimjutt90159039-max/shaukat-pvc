import React from 'react';
import { ShoppingCart, Trash2, ArrowRight, Heart, ShieldCheck } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Cart: React.FC = () => {
  const { navigate } = useRouter();
  const { items, subtotal, deliveryFee, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toggleWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h1 className="font-tech text-2xl font-bold uppercase text-[#17212B]">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You haven't added any PVC pipes, fittings, or valves to your order list yet. Browse our store catalog or request a quote for custom project sizing.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded cursor-pointer"
            >
              Browse PVC Products
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-6 py-2.5 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] text-xs font-bold uppercase rounded cursor-pointer"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="font-tech text-2xl sm:text-3xl font-bold uppercase text-[#17212B]">
              SHOPPING CART &amp; PROCUREMENT LIST
            </h1>
            <p className="text-xs text-slate-500 font-mono-spec mt-0.5">
              Review pipe lengths, fitting quantities, and calculated delivery fees
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-200">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                const variantDetails = item.variant
                  ? [item.variant.diameter, item.variant.length, item.variant.color]
                      .filter(Boolean)
                      .join(' · ')
                  : item.product.diameter;

                return (
                  <div
                    key={`${item.productId}-${item.variantId || 'base'}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] font-mono-spec text-slate-500 uppercase">
                          <span>SKU: {item.variant?.sku || item.product.sku}</span>
                          {variantDetails && (
                            <>
                              <span className="mx-1">·</span>
                              <span className="text-[#005B96] font-semibold">{variantDetails}</span>
                            </>
                          )}
                        </div>

                        <h3
                          onClick={() => navigate(`/product/${item.product.slug || item.product.id}`)}
                          className="font-semibold text-xs sm:text-sm text-slate-900 hover:text-[#005B96] cursor-pointer"
                        >
                          {item.product.name}
                        </h3>

                        <div className="text-xs font-tech text-[#005B96] font-bold">
                          PKR {item.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-300 rounded">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-mono-spec text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <span className="text-[10px] text-slate-400 block uppercase">Subtotal</span>
                        <span className="font-tech font-bold text-sm text-slate-900">
                          PKR {itemTotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            toggleWishlist(item.productId);
                            removeFromCart(item.productId, item.variantId);
                          }}
                          title="Save for later"
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          title="Remove item"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded p-6 shadow-xs space-y-4 sticky top-24">
            <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200">
              ORDER SUMMARY
            </h2>

            <div className="space-y-2 text-xs font-mono-spec">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-semibold text-slate-900">PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Logistics (Multan):</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? 'FREE (Over PKR 15,000)' : `PKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Discount / Promo:</span>
                <span className="font-semibold text-emerald-600">PKR 0</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Estimated Total:</span>
                <span className="font-tech text-xl font-bold text-[#005B96]">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#00A6A6]" />
                <span>Payment: Cash on Delivery (COD)</span>
              </div>
              <p>Pay upon inspection and physical delivery at your job site or address in Multan.</p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/request-quote')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-tech font-bold text-xs uppercase rounded text-center transition-colors cursor-pointer"
            >
              Convert Cart to Quotation (RFQ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
