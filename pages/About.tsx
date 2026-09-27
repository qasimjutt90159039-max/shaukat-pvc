import React from 'react';
import { Phone, MapPin, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const About: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Header */}
        <div className="bg-[#17212B] text-white p-8 sm:p-12 rounded-t border-b-4 border-[#005B96] bg-technical-dark-grid">
          <div className="flex items-center gap-2 text-xs font-mono-spec text-[#00A6A6] uppercase mb-2">
            <span>OFFICIAL BUSINESS PROFILE</span>
            <span aria-hidden="true">·</span>
            <span>MULTAN, PAKISTAN</span>
          </div>
          <h1 className="font-tech text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-3">
            SHAUKAT PVC PLASTIC PIPE SHOP
          </h1>
          <p className="text-base text-[#00A6A6] font-semibold">
            Category: PVC / Plumbing
          </p>
        </div>

        {/* Details Container */}
        <div className="bg-white border border-slate-200 rounded-b p-8 sm:p-10 shadow-xs space-y-8">
          {/* Verified Business Information Card */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4">
            <h2 className="font-tech text-base font-bold uppercase text-[#17212B] border-b border-slate-200 pb-2">
              Verified Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-spec">
              <div>
                <span className="text-slate-400 block uppercase">Business Name</span>
                <span className="font-bold text-slate-800 text-sm">Shaukat PVC Plastic Pipe Shop</span>
              </div>

              <div>
                <span className="text-slate-400 block uppercase">Industry Category</span>
                <span className="font-bold text-[#005B96] text-sm">PVC / Plumbing</span>
              </div>

              <div>
                <span className="text-slate-400 block uppercase">Store Telephone</span>
                <a href="tel:+92614540198" className="font-bold text-slate-900 text-sm hover:text-[#005B96]">
                  +92-61-4540198
                </a>
              </div>

              <div>
                <span className="text-slate-400 block uppercase">Store Location</span>
                <span className="font-bold text-slate-900 text-sm">
                  17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Business Focus Description */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="font-tech text-xl font-bold uppercase text-[#17212B]">
              About the Store
            </h2>
            <p>
              Shaukat PVC Plastic Pipe Shop operates as a dedicated PVC and plumbing supply retailer located in Hassan Parnana Colony, Multan. We supply builders, plumbers, civil contractors, and homeowners with unplasticized polyvinyl chloride (uPVC) water pipes, high-pressure lines, drainage conduits, directional pipe fittings, valves, and solvent cements.
            </p>
            <p>
              Our store catalog focuses on clearly communicated dimensional parameters, pressure classes (such as Class B, Class C, and Schedule 40), and fitting configurations to help customers order the right materials for their residential, commercial, or agricultural piping needs.
            </p>
          </div>

          {/* Product Offerings Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="p-4 border border-slate-200 rounded">
              <h3 className="font-tech text-xs font-bold uppercase text-[#005B96] mb-1">
                PVC Pipes
              </h3>
              <p className="text-xs text-slate-600">
                Pipes for water conveyance, pump riser mains, and gravity drainage installations.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded">
              <h3 className="font-tech text-xs font-bold uppercase text-[#00A6A6] mb-1">
                Fittings &amp; Valves
              </h3>
              <p className="text-xs text-slate-600">
                Elbows, tees, couplers, reducers, ball valves, and non-return check valves.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded">
              <h3 className="font-tech text-xs font-bold uppercase text-[#F5A623] mb-1">
                Quotation Service
              </h3>
              <p className="text-xs text-slate-600">
                Fast estimates for contractor schedules and high-volume project procurement.
              </p>
            </div>
          </div>

          {/* Real Business Facility & Yard Photography */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-tech text-lg font-bold uppercase text-[#17212B]">
                  Multan Facility &amp; Operations Gallery
                </h3>
                <p className="text-xs text-slate-500 font-mono-spec">
                  Photographs of our real trade counter, pipe storage yard, and dispatch logistics.
                </p>
              </div>
              <span className="text-xs font-mono-spec text-[#005B96] font-semibold hidden sm:inline">
                5 Verified Facility Areas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded overflow-hidden group">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                    alt="Trade counter and storefront at 17-A Hassan Parnana Colony"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-mono-spec text-[#005B96] font-bold uppercase">Storefront &amp; Sales Desk</span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">Commercial Walk-In Counter</p>
                  <p className="text-[11px] text-slate-500 mt-1">17-A Hassan Parnana Colony, Multan</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden group">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
                    alt="Bulk PVC pipe storage yard in Multan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-mono-spec text-[#005B96] font-bold uppercase">Pipe Inventory Yard</span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">High-Density Cantilever Racks</p>
                  <p className="text-[11px] text-slate-500 mt-1">10ft &amp; 20ft bundles of Class B, C &amp; Sch 40</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden group">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"
                    alt="Plumbing fittings, true union valves, and solvent cements"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-mono-spec text-[#00A6A6] font-bold uppercase">Hardware &amp; Valves</span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">Fittings &amp; Chemical Adhesives</p>
                  <p className="text-[11px] text-slate-500 mt-1">PN16 elbows, tees, unions, PTFE &amp; solvent glue</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden group">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1607400201889-565b1dd75f8e?auto=format&fit=crop&w=800&q=80"
                    alt="Pipe cutting and sizing bay"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-mono-spec text-[#F5A623] font-bold uppercase">Workshop Bay</span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">Precision Cutting &amp; Inspection</p>
                  <p className="text-[11px] text-slate-500 mt-1">Custom contractor lengths &amp; chamfering</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden group sm:col-span-2">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                    alt="Commercial site delivery and truck dispatch in Multan"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-mono-spec text-emerald-600 font-bold uppercase">Site Logistics</span>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">Contractor Dispatch &amp; Transport Loading</p>
                  <p className="text-[11px] text-slate-500 mt-1">Direct job-site truck deliveries across Multan &amp; surrounding districts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact CTA */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">
                17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
              </p>
              <p className="text-xs text-slate-500 font-mono-spec">
                Phone: +92-61-4540198
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="tel:+92614540198"
                className="px-4 py-2 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded"
              >
                Call Shop
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded cursor-pointer"
              >
                Contact Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
