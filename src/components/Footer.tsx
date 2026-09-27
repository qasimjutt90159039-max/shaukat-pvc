import React from 'react';
import { Phone, MapPin, Wrench, Shield, Truck, FileCheck } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#17212B] text-slate-300 border-t-4 border-[#005B96] text-xs">
      {/* Trust & Operational Features Strip */}
      <div className="border-b border-slate-800 bg-[#0d151c] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#005B96]/20 border border-[#005B96]/40 flex items-center justify-center text-[#00A6A6]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-xs">Industrial Standard Sizing</p>
              <p className="text-slate-400 text-[11px]">Precision uPVC & fittings specifications</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#005B96]/20 border border-[#005B96]/40 flex items-center justify-center text-[#00A6A6]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-xs">Contractor Quotations</p>
              <p className="text-slate-400 text-[11px]">Direct bulk pricing for builders & plumbers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#005B96]/20 border border-[#005B96]/40 flex items-center justify-center text-[#00A6A6]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-xs">Multan Dispatch Logistics</p>
              <p className="text-slate-400 text-[11px]">Prompt local supply for site requirements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#005B96]/20 border border-[#005B96]/40 flex items-center justify-center text-[#00A6A6]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white uppercase tracking-wider text-xs">Cash on Delivery</p>
              <p className="text-slate-400 text-[11px]">Simple, transparent payment upon receipt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Business Identity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-[#005B96] text-white flex items-center justify-center font-tech font-bold text-sm">
              SP
            </div>
            <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
              SHaukat PVC Plastic Pipe Shop
            </h3>
          </div>
          <p className="text-[#00A6A6] font-semibold tracking-wide text-xs mb-3">
            Category: PVC / Plumbing
          </p>
          <p className="text-slate-400 leading-relaxed text-xs mb-4">
            Reliable supply of PVC pipes, pressure lines, drainage conduits, valves, and plumbing fittings serving construction projects, contractors, and residential plumbing across Multan and southern Punjab.
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-amber-400/90 font-mono-spec">
            DEMO PRODUCT DATA NOTICE: Development records are marked clearly. Verify specs and availability with store.
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h4 className="font-tech text-white font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-[#005B96] pl-2">
            PRODUCTS
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/pvc-pipes')}
                className="hover:text-white transition-colors text-left"
              >
                PVC Pipes (Water & Pressure)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/pipe-fittings')}
                className="hover:text-white transition-colors text-left"
              >
                Pipe Fittings (Elbows, Tees, Couplers)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/drainage')}
                className="hover:text-white transition-colors text-left"
              >
                Drainage & Soil Pipes
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/valves')}
                className="hover:text-white transition-colors text-left"
              >
                Valves & Flow Controls
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/plumbing')}
                className="hover:text-white transition-colors text-left"
              >
                Plumbing Supplies & Adhesives
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/shop')}
                className="text-[#00A6A6] hover:underline transition-colors text-left font-medium"
              >
                Browse All Inventory &rarr;
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Services & Navigation */}
        <div>
          <h4 className="font-tech text-white font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-[#00A6A6] pl-2">
            SERVICES
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/bulk-orders')}
                className="hover:text-white transition-colors text-left"
              >
                Bulk Orders for Contractors
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/request-quote')}
                className="hover:text-white transition-colors text-left"
              >
                Request a Formal Quotation
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/projects')}
                className="hover:text-white transition-colors text-left"
              >
                Plumbing Application Areas
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/faq')}
                className="hover:text-white transition-colors text-left"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/blog')}
                className="hover:text-white transition-colors text-left"
              >
                Pipe & Sizing Technical Blog
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/about')}
                className="hover:text-white transition-colors text-left"
              >
                About the Business
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Verified Contact */}
        <div>
          <h4 className="font-tech text-white font-bold uppercase tracking-wider text-xs mb-4 border-l-2 border-[#F5A623] pl-2">
            CONTACT
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#00A6A6] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block uppercase">Shop Telephone</span>
                <a
                  href="tel:+92614540198"
                  className="font-mono-spec font-bold text-white hover:text-[#00A6A6] transition-colors"
                >
                  +92-61-4540198
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#00A6A6] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block uppercase">Physical Store Address</span>
                <p className="text-white text-xs leading-snug">
                  17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=17-A+Hassan+Parnana+Colony+Multan+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00A6A6]" />
                Get Directions to Multan Shop
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="px-3 py-2 bg-[#005B96] hover:bg-[#004370] text-white rounded text-xs transition-colors font-medium text-center"
              >
                Contact Customer Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Policy Bar */}
      <div className="border-t border-slate-800 bg-[#0f1720] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Shaukat PVC Plastic Pipe Shop. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Multan, Punjab, Pakistan</span>
            <span className="text-slate-600">·</span>
            <span>Payment: Cash on Delivery</span>
            <span className="text-slate-600">·</span>
            <span>Verification: +92-61-4540198</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
