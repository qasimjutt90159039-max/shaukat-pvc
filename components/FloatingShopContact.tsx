import React, { useState } from 'react';
import { Phone, MapPin, FileText, X, MessageSquare, ChevronUp } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const FloatingShopContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { navigate } = useRouter();

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono-spec">
      {isOpen && (
        <div className="bg-[#17212B] border-2 border-[#005B96] text-white rounded-lg shadow-2xl p-4 mb-3 w-80 sm:w-88 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
            <div>
              <div className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                Shaukat PVC Plastic Pipe Shop
              </div>
              <div className="text-[11px] text-[#00A6A6]">Multan Store Sales &amp; Inquiries</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              aria-label="Close contact window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            {/* Phone Call */}
            <a
              href="tel:+92614540198"
              className="flex items-center gap-3 p-2.5 bg-[#005B96] hover:bg-[#004370] text-white rounded font-bold transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-slate-200 uppercase font-mono-spec">Direct Phone Inquiry</div>
                <div className="text-sm font-bold tracking-wider">+92-61-4540198</div>
              </div>
            </a>

            {/* Request Quote Button */}
            <button
              onClick={() => {
                navigate('/request-quote');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold transition-colors border border-slate-700 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded bg-[#F5A623]/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#F5A623]" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Contractor / Bulk Order</div>
                <div className="text-xs text-[#F5A623] font-bold">Request Official Quotation</div>
              </div>
            </button>

            {/* Multan Address */}
            <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-[#00A6A6] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shop Address</span>
              </div>
              <div className="text-slate-300">
                17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
              </div>
              <div className="text-[10px] text-slate-500 pt-0.5">
                Warehouse Pickup &amp; Truck Delivery available.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-[#005B96] hover:bg-[#004370] text-white rounded-full shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-white/20 group"
      >
        <div className="relative">
          <Phone className="w-4 h-4 text-[#F5A623]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-200 leading-none">
            Multan Shop Hotline
          </div>
          <div className="text-xs font-bold tracking-wider text-white leading-tight font-mono-spec">
            +92-61-4540198
          </div>
        </div>
        <ChevronUp className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
