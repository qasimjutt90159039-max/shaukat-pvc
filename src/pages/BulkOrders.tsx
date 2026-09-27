import React, { useState } from 'react';
import { Building2, Phone, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IBulkOrder } from '../types';

export const BulkOrders: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    product: '',
    requiredQuantity: '',
    requiredSize: '',
    deliveryCity: 'Multan',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<IBulkOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiFetch<{ message: string; bulkOrder: IBulkOrder }>('/bulk-orders', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccessOrder(res.bulkOrder);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit bulk order request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#17212B] text-white p-8 rounded-t border-b-4 border-[#005B96] bg-technical-dark-grid">
          <div className="flex items-center gap-2 text-xs font-mono-spec text-[#00A6A6] uppercase mb-2">
            <Building2 className="w-4 h-4" />
            <span>CONTRACTOR &amp; INSTITUTIONAL SUPPLY DIVISION</span>
          </div>
          <h1 className="font-tech text-3xl font-bold uppercase tracking-tight text-white mb-2">
            BULK PVC &amp; PLUMBING SUPPLIES
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            For contractors, housing projects, commercial towers, and agricultural irrigation networks. Submit your schedule of quantities for consolidated trade quotes and planned site deliveries.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-b p-8 shadow-xs">
          {successOrder ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-tech text-2xl font-bold text-slate-900 uppercase">
                Bulk Inquiry Received
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded max-w-md mx-auto text-xs font-mono-spec text-left space-y-1">
                <div><span className="text-slate-400">Reference:</span> <span className="font-bold text-[#005B96]">{successOrder.bulkOrderNumber}</span></div>
                <div><span className="text-slate-400">Representative:</span> <span className="text-slate-800">{successOrder.name} ({successOrder.company || 'Private'})</span></div>
                <div><span className="text-slate-400">Product:</span> <span className="text-slate-800">{successOrder.product}</span></div>
                <div><span className="text-slate-400">Qty / Sizing:</span> <span className="text-slate-800">{successOrder.requiredQuantity} · {successOrder.requiredSize}</span></div>
                <div><span className="text-slate-400">City:</span> <span className="text-slate-800">{successOrder.deliveryCity}</span></div>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your bulk inquiry has been registered in our system. A commercial plumbing manager from Shaukat PVC Plastic Pipe Shop will call your contact phone (+92-61-4540198).
              </p>
              <button
                onClick={() => {
                  setSuccessOrder(null);
                  setFormData({
                    name: '',
                    company: '',
                    phone: '',
                    email: '',
                    product: '',
                    requiredQuantity: '',
                    requiredSize: '',
                    deliveryCity: 'Multan',
                    message: '',
                  });
                }}
                className="px-6 py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
              >
                Submit Another Bulk Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Engineer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Company / Contracting Firm
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Multan Construction Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone Number *
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
                    placeholder="official@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              {/* Product & Quantity details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Product / Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. uPVC Class C Pipe, 90° Elbows"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Required Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 lengths / 1,000 pcs"
                    value={formData.requiredQuantity}
                    onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Required Size *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 inch x 20 ft, 110mm"
                    value={formData.requiredSize}
                    onChange={(e) => setFormData({ ...formData, requiredSize: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Delivery Destination City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multan, Shujabad, Khanewal"
                  value={formData.deliveryCity}
                  onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Detailed Project Specifications / Site Delivery Instructions
                </label>
                <textarea
                  rows={4}
                  placeholder="Include required delivery schedule, pressure class criteria, unloading requirements, or tender reference..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-3 text-xs focus:outline-none focus:border-[#005B96]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-sm uppercase tracking-wider rounded shadow transition-colors cursor-pointer"
                >
                  {submitting ? 'LOGGING BULK INQUIRY...' : 'REQUEST BULK QUOTE'}
                </button>

                <div className="text-right text-[11px] font-mono-spec text-slate-500">
                  <span>Urgent Queries: </span>
                  <a href="tel:+92614540198" className="text-[#005B96] font-bold">
                    +92-61-4540198
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
