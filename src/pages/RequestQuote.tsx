import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertCircle, Phone, MapPin } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { apiFetch } from '../services/api';
import { IQuotation } from '../types';

export const RequestQuote: React.FC = () => {
  const { query, navigate } = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product: '',
    quantity: '',
    size: '',
    requiredDate: '',
    deliveryLocation: 'Multan',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successQuote, setSuccessQuote] = useState<IQuotation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (query.product || query.sku || query.size) {
      setFormData((prev) => ({
        ...prev,
        product: query.product ? `${decodeURIComponent(query.product)} ${query.sku ? `(${decodeURIComponent(query.sku)})` : ''}` : prev.product,
        size: query.size ? decodeURIComponent(query.size) : prev.size,
      }));
    }
  }, [query.product, query.sku, query.size]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiFetch<{ message: string; quotation: IQuotation }>('/quotations', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccessQuote(res.quotation);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit quotation request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#005B96] text-white p-8 rounded-t border-b-4 border-[#F5A623] bg-technical-dark-grid">
          <div className="flex items-center gap-2 text-xs font-mono-spec text-cyan-200 uppercase mb-2">
            <FileText className="w-4 h-4 text-[#F5A623]" />
            <span>OFFICIAL PRICE ESTIMATION &amp; TENDER RFQ</span>
          </div>
          <h1 className="font-tech text-3xl font-bold uppercase tracking-tight text-white mb-2">
            REQUEST A FORMAL QUOTATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Need pricing on custom PVC specifications, fitting assortments, or non-standard diameters? Submit your project requirements to receive a verified price quote from our Multan shop.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200 rounded-b p-8 shadow-xs">
          {successQuote ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-tech text-2xl font-bold text-slate-900 uppercase">
                Quote Request Submitted
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded max-w-md mx-auto text-xs font-mono-spec text-left space-y-1">
                <div><span className="text-slate-400">Quote ID:</span> <span className="font-bold text-[#005B96]">{successQuote.quoteNumber}</span></div>
                <div><span className="text-slate-400">Client:</span> <span className="text-slate-800">{successQuote.name} {successQuote.company ? `(${successQuote.company})` : ''}</span></div>
                <div><span className="text-slate-400">Items:</span> <span className="text-slate-800">{successQuote.productName || 'Custom Specification List'}</span></div>
                <div><span className="text-slate-400">Quantity / Size:</span> <span className="text-slate-800">{successQuote.quantity} · {successQuote.size || 'Standard'}</span></div>
                <div><span className="text-slate-400">Destination:</span> <span className="text-slate-800">{successQuote.deliveryLocation}</span></div>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you! Our estimating department at 17-A Hassan Parnana Colony, Multan will review your technical schedule and contact you at {successQuote.phone}.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  Continue Browsing Catalog
                </button>
                <button
                  onClick={() => {
                    setSuccessQuote(null);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      company: '',
                      product: '',
                      quantity: '',
                      size: '',
                      requiredDate: '',
                      deliveryLocation: 'Multan',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-200 cursor-pointer"
                >
                  New Request
                </button>
              </div>
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
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number *
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hassan Plumbing Contractors"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Product / Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule 40 2-inch pipe"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Quantity Required *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 lengths, 200 pcs"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pipe Sizing / Diameter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 inch, 20 ft"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Delivery Location / Project Site *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hassan Parnana Colony / Bosan Road, Multan"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Additional Technical Specifications / Fittings Breakdown
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail any specific wall thickness requirements, pressure rating, or full list of elbows, tees, and valves..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-3 text-xs focus:outline-none focus:border-[#005B96]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] font-tech font-bold text-xs uppercase tracking-wider rounded shadow transition-colors cursor-pointer"
                >
                  {submitting ? 'GENERATING RFQ...' : 'SUBMIT QUOTE REQUEST'}
                </button>

                <div className="flex items-center gap-2 text-xs font-mono-spec text-slate-500">
                  <Phone className="w-4 h-4 text-[#005B96]" />
                  <span>Direct Multan Line: </span>
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
