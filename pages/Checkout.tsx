import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Truck } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { IOrder } from '../types';

export const Checkout: React.FC = () => {
  const { navigate } = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    area: '',
    city: 'Multan',
    postalCode: '',
    deliveryNotes: '',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<IOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] py-16">
        <div className="max-w-2xl mx-auto px-4 bg-white border border-slate-200 rounded p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono-spec text-[#00A6A6] font-bold uppercase tracking-wider block mb-1">
              ORDER CONFIRMED
            </span>
            <h1 className="font-tech text-2xl sm:text-3xl font-bold uppercase text-[#17212B]">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono-spec">
              Order Tracking ID: <span className="font-bold text-[#005B96]">{completedOrder.orderNumber}</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs font-mono-spec text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Contact Phone:</span>
              <span className="text-slate-900">{completedOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="text-slate-900">{completedOrder.address}, {completedOrder.city}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Payment Method:</span>
              <span className="text-slate-900 font-bold">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1">
              <span className="text-slate-900">Total Payable:</span>
              <span className="text-[#005B96]">PKR {completedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your piping supplies will be prepared for dispatch from Shaukat PVC Plastic Pipe Shop, Multan. Our dispatch coordinator will verify order details over phone (+92-61-4540198).
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
            >
              Continue Shopping
            </button>
            {user && (
              <button
                onClick={() => navigate('/account')}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-200 cursor-pointer"
              >
                View in Account Orders
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] py-16 text-center">
        <h1 className="text-lg font-bold text-slate-800">Your cart is empty</h1>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacingOrder(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        postalCode: formData.postalCode,
        deliveryNotes: formData.deliveryNotes,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          sku: i.variant?.sku || i.product.sku,
          quantity: i.quantity,
        })),
      };

      const res = await apiFetch<{ message: string; order: IOrder }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      clearCart();
      setCompletedOrder(res.order);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#005B96] font-mono-spec cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </button>
          <div className="text-xs font-mono-spec text-slate-500">
            Secure Checkout · Cash on Delivery
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customer & Delivery Details */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-6 shadow-xs space-y-6">
            <div>
              <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200 mb-4">
                1. CONTACT INFORMATION
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient / Site Supervisor"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number (For Delivery Confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200 mb-4">
                2. DELIVERY LOCATION &amp; SITE ADDRESS
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Street Address / Plot / Site Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Plot #, Street, Nearby Landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Colony / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hassan Parnana / Bosan Rd"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 60000"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Delivery Instructions / Unloading Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Call before dispatch, pipe unloading space available inside gate..."
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200 mb-3">
                3. PAYMENT METHOD
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-300 rounded flex items-start gap-3">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="mt-1 text-[#005B96] focus:ring-[#005B96]"
                />
                <div>
                  <label htmlFor="cod" className="font-bold text-xs text-slate-900 block cursor-pointer">
                    Cash on Delivery (COD)
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay in cash directly to our delivery courier or transport driver upon receiving your pipes and plumbing products. No online advance card required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-6 shadow-xs space-y-5 sticky top-24">
            <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200">
              PURCHASE SUMMARY ({items.length} ITEMS)
            </h2>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs font-mono-spec">
              {items.map((i) => (
                <div key={`${i.productId}-${i.variantId}`} className="py-2.5 flex justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-900 block line-clamp-1">{i.product.name}</span>
                    <span className="text-[11px] text-slate-500">
                      Qty: {i.quantity} {i.variant?.diameter ? `· ${i.variant.diameter}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">
                    PKR {(i.price * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs font-mono-spec">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Logistics:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold">
                <span className="text-slate-900">Total Payable at Delivery:</span>
                <span className="font-tech text-xl text-[#005B96]">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full py-3 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>{placingOrder ? 'PROCESSING ORDER...' : 'PLACE ORDER (CASH ON DELIVERY)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
