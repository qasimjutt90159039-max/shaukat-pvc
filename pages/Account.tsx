import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { IOrder } from '../types';

export const Account: React.FC = () => {
  const { navigate } = useRouter();
  const { user, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const res = await apiFetch<IOrder[]>('/orders/my-orders');
        setOrders(res || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user, navigate]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setProfileMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-spec text-[#005B96]">
              <span>CUSTOMER ACCOUNT PORTAL</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{user.role}</span>
            </div>
            <h1 className="font-tech text-2xl sm:text-3xl font-bold uppercase text-[#17212B]">
              WELCOME, {user.name}
            </h1>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-300 rounded text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded p-4 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#005B96] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#005B96] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile &amp; Password</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#005B96] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="lg:col-span-9 bg-white border border-slate-200 rounded p-6 shadow-xs">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h2 className="font-tech text-base font-bold text-[#17212B] uppercase">
                    Your Purchases &amp; Invoices
                  </h2>
                  <span className="text-xs font-mono-spec text-slate-500">
                    Payment Method: Cash on Delivery
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-12 text-xs font-mono-spec text-slate-500">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-xs text-slate-500">No orders placed yet.</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="px-4 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded"
                    >
                      Browse Store Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="border border-slate-200 rounded p-4 hover:border-slate-400 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs font-mono-spec">
                          <div>
                            <span className="font-bold text-[#005B96]">{ord.orderNumber}</span>
                            <span className="text-slate-400 mx-2">·</span>
                            <span className="text-slate-500">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              {ord.orderStatus}
                            </span>
                            <span className="text-slate-800 font-bold">
                              PKR {ord.total.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="py-3 text-xs space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-600 font-mono-spec">
                              <span>
                                {item.productName} (x{item.quantity})
                              </span>
                              <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono-spec">
                            Dest: {ord.city} ({ord.address})
                          </span>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-[#005B96] hover:underline font-bold"
                          >
                            View Order Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200">
                  Profile Details
                </h2>

                {profileMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded">
                    {profileMessage}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    {profileError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h3 className="font-tech text-xs font-bold uppercase text-slate-800">
                    Change Password (Optional)
                  </h3>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Current Password:</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">New Password:</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <h2 className="font-tech text-base font-bold text-[#17212B] uppercase pb-2 border-b border-slate-200">
                  Saved Delivery Sites &amp; Addresses
                </h2>
                <div className="p-4 border border-slate-200 rounded bg-slate-50 text-xs font-mono-spec">
                  <div className="font-bold text-slate-800 mb-1">Default Site Address</div>
                  <div className="text-slate-600">
                    12-B Bosan Road Commercial Area, Multan
                  </div>
                  <div className="text-slate-500 mt-1">Phone: {user.phone || '+92-300-1234567'}</div>
                </div>
                <p className="text-xs text-slate-500">
                  New job site addresses can also be designated during checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded max-w-lg w-full p-6 space-y-4 border border-slate-300 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h3 className="font-tech text-base font-bold uppercase text-[#17212B]">
                  Invoice: {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono-spec">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-[#005B96] uppercase">{selectedOrder.orderStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery To:</span>
                  <span>{selectedOrder.address}, {selectedOrder.city}</span>
                </div>
                {selectedOrder.deliveryNotes && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notes:</span>
                    <span className="text-slate-700 italic">{selectedOrder.deliveryNotes}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <span className="text-xs font-bold uppercase text-slate-800 block mb-2">Item Breakdown:</span>
                <div className="space-y-1.5 text-xs font-mono-spec">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span>{it.productName} (x{it.quantity})</span>
                      <span>PKR {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-slate-500 pt-1">
                    <span>Delivery Fee:</span>
                    <span>PKR {selectedOrder.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                    <span>Total:</span>
                    <span className="text-[#005B96]">PKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
