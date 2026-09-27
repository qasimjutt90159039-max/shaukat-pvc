import React, { useState } from 'react';
import { Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-slate-200">
          <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
            CUSTOMER ASSISTANCE &amp; PHYSICAL STORE LOCATION
          </div>
          <h1 className="font-tech text-3xl sm:text-4xl font-bold uppercase text-[#17212B]">
            CONTACT OUR MULTAN SHOP
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reach out by telephone or submit an inquiry regarding PVC pipe stock and technical sizing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Business Info Card & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-tech text-lg font-bold uppercase text-[#17212B] mb-1">
                  Shaukat PVC Plastic Pipe Shop
                </h2>
                <span className="text-xs text-[#00A6A6] font-semibold font-mono-spec block">
                  Category: PVC / Plumbing
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <Phone className="w-5 h-5 text-[#005B96] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono-spec block">Telephone</span>
                  <a
                    href="tel:+92614540198"
                    className="font-tech font-bold text-base text-slate-900 hover:text-[#005B96]"
                  >
                    +92-61-4540198
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <MapPin className="w-5 h-5 text-[#00A6A6] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono-spec block">Physical Location</span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
                  </p>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+92614540198"
                  className="py-3 px-4 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded text-center transition-colors shadow-xs"
                >
                  CALL NOW
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=17-A+Hassan+Parnana+Colony+Multan+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#17212B] hover:bg-slate-800 text-[#F5A623] font-tech font-bold text-xs uppercase tracking-wider rounded text-center transition-colors shadow-xs"
                >
                  GET DIRECTIONS
                </a>
              </div>
            </div>

            {/* Map visual representation */}
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
              <h3 className="font-tech text-xs font-bold uppercase text-slate-700 mb-2">
                Store Location Map
              </h3>
              <div className="aspect-16/9 bg-slate-100 rounded border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="w-8 h-8 text-[#005B96] mb-1 animate-bounce" />
                <span className="font-bold text-xs text-slate-800">17-A Hassan Parnana Colony</span>
                <span className="text-[11px] text-slate-500 font-mono-spec">Multan, Punjab, Pakistan</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=17-A+Hassan+Parnana+Colony+Multan+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-3 py-1.5 bg-[#005B96] text-white text-[11px] font-bold uppercase rounded"
                >
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded p-6 sm:p-8 shadow-xs">
            <h2 className="font-tech text-lg font-bold uppercase text-[#17212B] mb-2 pb-2 border-b border-slate-200">
              Send a Message to Store Staff
            </h2>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-tech text-xl font-bold uppercase text-slate-800">
                  Message Dispatched
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your message has been received by Shaukat PVC Plastic Pipe Shop. Our staff will review your inquiry and follow up promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-[#005B96] text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule 40 Stock Availability"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="State your pipe sizes, fitting inquiries, or site requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F4F8FA] border border-slate-300 rounded p-3 text-xs focus:outline-none focus:border-[#005B96]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
