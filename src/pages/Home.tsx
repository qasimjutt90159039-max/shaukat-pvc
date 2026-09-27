import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  FileText,
  Phone,
  MapPin,
  CheckCircle2,
  Wrench,
  Layers,
  ShieldCheck,
  Building2,
  Home as HomeIcon,
  Factory,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { apiFetch } from '../services/api';
import { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export const Home: React.FC = () => {
  const { navigate } = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFacilityPhoto, setSelectedFacilityPhoto] = useState<number>(0);

  const facilityPhotos = [
    {
      id: 'fac-1',
      title: 'Commercial Trade Counter & Storefront',
      location: '17-A Hassan Parnana Colony, Multan',
      tag: 'WALK-IN TRADE DESK',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      description: 'Our customer walk-in counter at 17-A Hassan Parnana Colony where trade contractors, plumbers, and homeowners consult with our technical staff on pipe sizing, pressure classes, and fitting compatibility.',
      highlights: ['Direct Cash on Delivery orders', 'Itemized contractor estimates', 'Immediate warehouse pickup'],
    },
    {
      id: 'fac-2',
      title: 'Heavy Pipe Storage Yard & Cantilever Racks',
      location: 'Multan Stock Yard',
      tag: 'BULK PIPE INVENTORY',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      description: 'Extensive vertical and horizontal storage holding thousands of linear feet of 10ft & 20ft Class B, Class C, Schedule 40, and SDR 34 sewer pipes stored under covered protective bays.',
      highlights: ['Diameters 1/2" up to 8"', 'Certified virgin uPVC resin', 'Protected against sun warping'],
    },
    {
      id: 'fac-3',
      title: 'Fittings, Valves & Adhesives Department',
      location: 'Precision Fitting Inventory',
      tag: 'FITTINGS & FLOW CONTROLS',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80',
      description: 'High-density shelving stocked with 90° & 45° elbows, tees, unions, brass-insert adaptors, true union valves, and heavy-duty chemical solvent cement bonding adhesives.',
      highlights: ['Leak-proof PN16 pressure ratings', 'Pure PTFE thread seal tapes', 'Brass core gate & ball valves'],
    },
    {
      id: 'fac-4',
      title: 'Precision Sizing, Cutting & Quality Bay',
      location: 'In-House Preparation',
      tag: 'WORKSHOP & INSPECTION',
      image: 'https://images.unsplash.com/photo-1607400201889-565b1dd75f8e?auto=format&fit=crop&w=1200&q=80',
      description: 'Dedicated pipe preparation bench equipped with ratchet shear cutters and caliber gauges for contractor custom length sizing and socket beveling before dispatch.',
      highlights: ['Square 90° burr-free cuts', 'Wall thickness verification', 'Job-ready bundle preparation'],
    },
    {
      id: 'fac-5',
      title: 'Commercial Site Dispatch & Vehicle Loading',
      location: 'Multan & South Punjab Logistics',
      tag: 'LOGISTICS & SITE DELIVERY',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      description: 'Direct logistics yard where contractor lots and agricultural tubewell kits are strapped, verified against bills of lading, and dispatched to job sites across Multan.',
      highlights: ['Same-day Multan dispatch', 'Protected transit packaging', 'Direct-to-trench unloading support'],
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiFetch<{ products: IProduct[] }>('/products?featured=true&limit=8'),
          apiFetch<ICategory[]>('/categories'),
        ]);
        setFeaturedProducts(prodRes.products || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F8FA]">
      {/* ========================================================= */}
      {/* 1. INDUSTRIAL HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative bg-[#17212B] text-white border-b-4 border-[#005B96] overflow-hidden bg-technical-dark-grid py-16 lg:py-24">
        {/* Subtle geometric plumbing pipes diagram in background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-pipe-lines" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#005B96]/30 via-transparent to-transparent pointer-events-none hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Technical Kicker (No Pill Rule: Clean inline typography) */}
              <div className="flex items-center gap-2 text-xs font-mono-spec text-[#00A6A6]">
                <span className="w-2.5 h-2.5 bg-[#00A6A6] inline-block" />
                <span>SHAUKAT PVC PLASTIC PIPE SHOP</span>
                <span aria-hidden="true">·</span>
                <span>MULTAN COMMERCIAL &amp; RESIDENTIAL SUPPLY</span>
              </div>

              <h1 className="font-tech text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-tight text-white">
                QUALITY PVC &amp; PLUMBING SOLUTIONS
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                Explore PVC pipes, fittings and plumbing supplies for residential, commercial and construction requirements.
              </p>

              {/* Technical Indicator Ribbon */}
              <div className="py-2.5 px-3.5 bg-slate-900/80 border-l-4 border-[#F5A623] border border-slate-700/60 rounded text-xs font-mono-spec text-slate-300">
                <span className="text-[#F5A623] font-bold">STORE DISPATCH:</span> In-stock uPVC potable water lines, high pressure Class C/Schedule 40, sanitary drainage fittings, and heavy true union valves ready at Hassan Parnana Colony, Multan.
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-sm tracking-wider uppercase rounded shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#005B96]"
                >
                  <span>SHOP PRODUCTS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/request-quote')}
                  className="px-6 py-3 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] font-tech font-bold text-sm tracking-wider uppercase rounded shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>REQUEST A QUOTE</span>
                </button>
              </div>

              {/* Verified Contact Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono-spec border-t border-slate-800">
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-3.5 h-3.5 text-[#00A6A6]" />
                  <span>Shop: +92-61-4540198</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#00A6A6]" />
                  <span>Multan, Punjab, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Industrial Pipe Architecture Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative border-2 border-slate-700 bg-slate-900/90 rounded p-4 shadow-2xl backdrop-blur-xs">
                {/* Tech Blueprint Header Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-mono-spec text-[11px] text-slate-400">
                  <span className="text-[#00A6A6] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00A6A6] animate-pulse" /> SYSTEM SPECIFICATION
                  </span>
                  <span>PS:3051 / ASTM COMPLIANT</span>
                </div>

                <div className="relative overflow-hidden rounded bg-slate-950 aspect-4/3 flex items-center justify-center p-2">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80"
                    alt="Shaukat PVC Plastic Pipe Shop - Plumbing and Pipeline Engineering"
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full rounded opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-[#17212B]/90 border border-slate-700/80 p-2.5 rounded text-[11px] font-mono-spec flex justify-between items-center text-slate-300">
                    <div>
                      <span className="text-white font-bold block">RIGID uPVC WATER CONVEYANCE</span>
                      <span className="text-slate-400">Pressure PN16 / Nominal Bore 25mm-110mm</span>
                    </div>
                    <span className="text-[#F5A623] font-bold">MULTAN STOCK</span>
                  </div>
                </div>

                {/* Technical Metric Cards */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center font-mono-spec">
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block uppercase">Hydrostatic Test</span>
                    <span className="text-xs font-bold text-white">Up to 280 PSI</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block uppercase">Thermal Temp</span>
                    <span className="text-xs font-bold text-white">0°C – 55°C</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block uppercase">Standard</span>
                    <span className="text-xs font-bold text-[#00A6A6]">Class B/C/Sch40</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. QUICK CATEGORY SECTION */}
      {/* ========================================================= */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b-2 border-slate-200">
          <div>
            <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
              INVENTORY CATEGORIES
            </div>
            <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
              PLUMBING &amp; PVC PRODUCT DIVISIONS
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-[#005B96] hover:text-[#004370] flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Product Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Core Categories Defined in Brief */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PVC PIPES */}
          <div
            onClick={() => navigate('/pvc-pipes')}
            className="group bg-white border border-slate-200 hover:border-[#005B96] rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-[#005B96]/10 text-[#005B96] flex items-center justify-center mb-4 group-hover:bg-[#005B96] group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-2 group-hover:text-[#005B96]">
                PVC PIPES
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pipes for water supply and plumbing applications. Includes Class B, Class C, Schedule 40 pressure lines, and conduit.
              </p>
            </div>
            <div className="text-xs font-bold text-[#005B96] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore PVC Pipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* PIPE FITTINGS */}
          <div
            onClick={() => navigate('/pipe-fittings')}
            className="group bg-white border border-slate-200 hover:border-[#005B96] rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-[#00A6A6]/10 text-[#00A6A6] flex items-center justify-center mb-4 group-hover:bg-[#00A6A6] group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-2 group-hover:text-[#00A6A6]">
                PIPE FITTINGS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Connectors and fittings for plumbing systems. Precision 90° elbows, 45° sweeps, equal tees, couplers, and reducers.
              </p>
            </div>
            <div className="text-xs font-bold text-[#00A6A6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Pipe Fittings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* VALVES */}
          <div
            onClick={() => navigate('/valves')}
            className="group bg-white border border-slate-200 hover:border-[#005B96] rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-[#005B96]/10 text-[#005B96] flex items-center justify-center mb-4 group-hover:bg-[#005B96] group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-2 group-hover:text-[#005B96]">
                VALVES
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Water-control and plumbing valves. Heavy true union ball valves, brass core gate valves, non-return check flap valves.
              </p>
            </div>
            <div className="text-xs font-bold text-[#005B96] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Valves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* DRAINAGE */}
          <div
            onClick={() => navigate('/drainage')}
            className="group bg-white border border-slate-200 hover:border-[#005B96] rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-[#17212B] group-hover:text-white transition-colors">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-2 group-hover:text-[#005B96]">
                DRAINAGE
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Drainage pipes and related products. Non-pressurized sanitary soil stacks, rainwater downspouts, and waste evacuation.
              </p>
            </div>
            <div className="text-xs font-bold text-[#005B96] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Drainage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* PLUMBING ACCESSORIES */}
          <div
            onClick={() => navigate('/plumbing')}
            className="group bg-white border border-slate-200 hover:border-[#005B96] rounded p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-[#00A6A6]/10 text-[#00A6A6] flex items-center justify-center mb-4 group-hover:bg-[#00A6A6] group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-[#17212B] uppercase mb-2 group-hover:text-[#00A6A6]">
                PLUMBING ACCESSORIES
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Supporting plumbing components. Heavy-duty chemical solvent cement, thread seal Teflon tapes, rubberized pipe clamps.
              </p>
            </div>
            <div className="text-xs font-bold text-[#00A6A6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* BULK SUPPLIES */}
          <div
            onClick={() => navigate('/bulk-orders')}
            className="group bg-[#17212B] text-white border border-slate-800 rounded p-6 shadow-xs hover:border-[#F5A623] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded bg-[#F5A623]/20 text-[#F5A623] flex items-center justify-center mb-4 group-hover:bg-[#F5A623] group-hover:text-[#17212B] transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-tech text-lg font-bold text-white uppercase mb-2 group-hover:text-[#F5A623]">
                BULK SUPPLIES
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                For contractors and larger requirements. Direct commercial volume pricing, scheduled job-site drops, and tender supply.
              </p>
            </div>
            <div className="text-xs font-bold text-[#F5A623] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Submit Contractor Bulk RFQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2.5 SPECIALIZED PIPE TYPES & APPLICATIONS SELECTOR */}
      {/* ========================================================= */}
      <section className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
                PIPE CATALOG BY CLASSIFICATION
              </div>
              <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
                COMPLETE PIPE SELECTION DIRECTORY
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Browse our complete range of potable water, high-pressure, hot water, drainage, and conduit pipes with verified engineering ratings.
              </p>
            </div>
            <button
              onClick={() => navigate('/pvc-pipes')}
              className="text-xs font-bold text-[#005B96] hover:underline flex items-center gap-1 cursor-pointer font-mono-spec self-start sm:self-auto"
            >
              <span>View All Pipe Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. uPVC Water Supply */}
            <div
              onClick={() => navigate('/shop?category=pvc-pipes&subcategory=Water+Supply+Pipes')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80"
                    alt="uPVC Potable Water Supply Pipes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-blue-600/90 text-white rounded shadow-xs">
                      CLASS B / C / D
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    uPVC Potable Water Pipes
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Drinking water &amp; domestic down-take lines. Sizes 1/2" up to 4" with smooth non-toxic bore.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">6 to 12 Bar</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 2. Schedule 40 & 80 */}
            <div
              onClick={() => navigate('/shop?category=pvc-pipes&subcategory=Pressure+Pipes')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=600&q=80"
                    alt="Schedule 40 High-Pressure uPVC Pipes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-slate-900/90 text-white rounded shadow-xs">
                      SCH 40 / SCH 80
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    High-Pressure Pipes
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Booster pumps, multi-story risers, and industrial fluid manifolds up to 400 PSI.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">Up to 400 PSI</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 3. PPR-C & CPVC Hot Water */}
            <div
              onClick={() => navigate('/shop?category=pvc-pipes&subcategory=PPR-C+%26+Hot+Water')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
                    alt="PPR-C and CPVC Hot Water Pipes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-emerald-700/90 text-white rounded shadow-xs">
                      PN20 / SDR 11
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    PPR-C &amp; CPVC Hot Water
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Geyser hot lines, solar water heaters, and concealed bathroom plumbing loops.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">Heat-Fused / Glue</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 4. SWR Drainage & Underground Sewer */}
            <div
              onClick={() => navigate('/drainage')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                    alt="PVC Drainage and Sewer Pipes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-amber-700/90 text-white rounded shadow-xs">
                      SN4 / SWR
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    Drainage &amp; Sewer Pipes
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sanitary soil stacks, roof rainwater downpipes, and ring-stiffness sewer outfalls.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">Gravity Flow</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 5. HDPE PE100 Coil Pipe */}
            <div
              onClick={() => navigate('/shop?search=HDPE')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80"
                    alt="HDPE PE100 Continuous Underground Coil Pipes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-sky-700/90 text-white rounded shadow-xs">
                      PE100 COILS
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    HDPE Underground Coils
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Zero-joint continuous underground runs for tubewell feeds and agricultural lines.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">PN16 Seamless</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 6. Spiral Suction Hose */}
            <div
              onClick={() => navigate('/shop?category=pvc-pipes&subcategory=Flexible+%26+Suction+Pipes')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80"
                    alt="Heavy-Duty Spiral Reinforced PVC Suction Hose"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-teal-700/90 text-white rounded shadow-xs">
                      SPIRAL HELIX
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    Spiral Suction Hose
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Green ribbed heavy vacuum hose for tubewell boring and motor intake circuits.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">Anti-Collapse</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 7. Electrical Conduit */}
            <div
              onClick={() => navigate('/shop?category=pvc-pipes&subcategory=Conduit+Pipes')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                    alt="uPVC Flame-Retardant Electrical Conduit Pipe"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-orange-700/90 text-white rounded shadow-xs">
                      FIRE RETARDANT
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    PVC Electrical Conduit
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Concealed ceiling wiring and orange heavy underground power cable ducts.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">BS 4607 Rated</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>

            {/* 8. Precision Fittings */}
            <div
              onClick={() => navigate('/pipe-fittings')}
              className="bg-white border border-slate-200 hover:border-[#005B96] rounded overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                    alt="Precision uPVC Pipe Fittings and Adapters"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-mono-spec font-bold px-2 py-0.5 bg-indigo-700/90 text-white rounded shadow-xs">
                      PN16 FITTINGS
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-tech text-base font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors">
                    Elbows, Tees &amp; Couplers
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Brass inserted FTAs, MTA adapters, true unions, reducing tees, and end caps.
                  </p>
                </div>
              </div>
              <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono-spec text-[#005B96]">
                <span className="font-semibold">Molded Socket</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Browse &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FEATURED PRODUCTS (DATABASE DRIVEN) */}
      {/* ========================================================= */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b-2 border-slate-200">
            <div>
              <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
                AVAILABLE STOCK
              </div>
              <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
                FEATURED PVC PIPES &amp; HARDWARE
              </h2>
            </div>
            <div className="text-xs font-mono-spec text-slate-500">
              Cash on Delivery Available Across Multan
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-50 border border-slate-200 rounded h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No featured products currently configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold uppercase rounded shadow-xs cursor-pointer transition-colors"
            >
              <span>View All Store Products &amp; Sizes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3.5 ABOUT OUR REAL BUSINESS & MULTAN FACILITY SHOWCASE */}
      {/* ========================================================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-spec text-[#005B96] font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4 text-[#00A6A6]" />
                <span>ABOUT OUR REAL BUSINESS · MULTAN, PAKISTAN</span>
              </div>
              <h2 className="font-tech text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17212B] uppercase">
                SHAUKAT PVC PLASTIC PIPE SHOP
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Operating directly from <strong>17-A Hassan Parnana Colony, Multan, Punjab, Pakistan</strong>. We maintain a real plumbing supply storefront, inventory yard, and distribution service supplying certified uPVC water lines, high-pressure pipes, and fittings across Multan and South Punjab.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+92614540198"
                className="px-4 py-2.5 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-bold font-mono-spec rounded flex items-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#00A6A6]" />
                <span>+92-61-4540198</span>
              </a>
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold uppercase rounded transition-colors"
              >
                Company Details
              </button>
            </div>
          </div>

          {/* Real Business Interactive Facility Viewer */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Active Large Facility Photo */}
              <div className="lg:col-span-7 relative bg-slate-950 aspect-16/10 sm:aspect-16/9 overflow-hidden flex items-center justify-center">
                <img
                  src={facilityPhotos[selectedFacilityPhoto].image}
                  alt={facilityPhotos[selectedFacilityPhoto].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#17212B]/90 text-[#F5A623] border border-[#F5A623]/50 text-xs font-mono-spec font-bold uppercase rounded shadow">
                    {facilityPhotos[selectedFacilityPhoto].tag}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#17212B] via-[#17212B]/80 to-transparent p-4 sm:p-6 text-white">
                  <div className="text-xs text-[#00A6A6] font-mono-spec mb-0.5">
                    {facilityPhotos[selectedFacilityPhoto].location}
                  </div>
                  <h3 className="font-tech text-lg sm:text-xl font-bold uppercase">
                    {facilityPhotos[selectedFacilityPhoto].title}
                  </h3>
                </div>
              </div>

              {/* Facility Details & Photo Selector */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                <div>
                  <div className="text-xs font-mono-spec text-slate-400 uppercase mb-1">
                    Facility Section {selectedFacilityPhoto + 1} of {facilityPhotos.length}
                  </div>
                  <h3 className="font-tech text-xl font-bold text-[#17212B] uppercase mb-2">
                    {facilityPhotos[selectedFacilityPhoto].title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-spec mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#00A6A6]" />
                    <span>{facilityPhotos[selectedFacilityPhoto].location}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {facilityPhotos[selectedFacilityPhoto].description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-mono-spec font-bold text-slate-800 uppercase">
                      Operational Highlights:
                    </div>
                    {facilityPhotos[selectedFacilityPhoto].highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A6A6] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thumbnails to Switch Photos */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="text-[11px] font-mono-spec text-slate-500 uppercase mb-2">
                    Click to view facility areas:
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {facilityPhotos.map((fac, idx) => (
                      <button
                        key={fac.id}
                        onClick={() => setSelectedFacilityPhoto(idx)}
                        className={`relative rounded overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer ${
                          selectedFacilityPhoto === idx
                            ? 'border-[#005B96] ring-2 ring-[#005B96]/30 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={fac.title}
                      >
                        <img
                          src={fac.image}
                          alt={fac.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Distinct Business Photo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {facilityPhotos.map((fac, idx) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFacilityPhoto(idx)}
                className={`bg-white border rounded overflow-hidden cursor-pointer transition-all hover:shadow-md group ${
                  selectedFacilityPhoto === idx
                    ? 'border-[#005B96] shadow-sm ring-1 ring-[#005B96]'
                    : 'border-slate-200'
                }`}
              >
                <div className="h-28 overflow-hidden bg-slate-100 relative">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-mono-spec font-bold px-1.5 py-0.5 bg-[#17212B]/90 text-white rounded">
                      PHOTO {idx + 1}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-tech text-xs font-bold text-[#17212B] uppercase group-hover:text-[#005B96] transition-colors line-clamp-1">
                    {fac.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TECHNICAL PRODUCT SHOWCASE */}
      {/* ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-[#17212B] text-white rounded border border-slate-700 p-8 lg:p-12 relative overflow-hidden bg-technical-dark-grid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[#00A6A6] text-xs font-mono-spec uppercase font-bold tracking-widest block">
                TECHNICAL ENGINEERING SHOWCASE
              </span>
              <h2 className="font-tech text-2xl sm:text-3xl font-bold uppercase leading-tight">
                CLASS C uPVC HIGH-PRESSURE POTABLE WATER PIPING
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fabricated with virgin unplasticized polyvinyl chloride polymer for zero lead leaching and optimal laminar flow. Engineered to withstand continuous hydrostatic working pressures of 9.0 Bar (130 PSI) with smooth friction-resistant interior walls.
              </p>

              {/* Technical Spec Matrix Preview */}
              <div className="bg-slate-900/90 border border-slate-800 rounded p-4 text-xs font-mono-spec space-y-2">
                <div className="grid grid-cols-2 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Standard Test:</span>
                  <span className="text-white font-semibold">PS:3051 Compliant</span>
                </div>
                <div className="grid grid-cols-2 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Bore Sizes:</span>
                  <span className="text-white font-semibold">1/2" up to 6" Nominal</span>
                </div>
                <div className="grid grid-cols-2 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Connection:</span>
                  <span className="text-white font-semibold">Solvent Socket Welded</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-slate-400">Resistance:</span>
                  <span className="text-[#00A6A6] font-semibold">Non-corrosive &amp; Scale-proof</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/pvc-pipes')}
                  className="px-5 py-2.5 bg-[#00A6A6] hover:bg-[#008282] text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  View Pipe Sizing Table
                </button>
                <button
                  onClick={() => navigate('/request-quote')}
                  className="px-5 py-2.5 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Request Technical Quotation
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative border-4 border-slate-700 bg-slate-950 p-2 rounded shadow-2xl max-w-md w-full">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1000&q=80"
                  alt="PVC Pipe Technical Cross Section and Water Infrastructure"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 object-cover rounded"
                />
                <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] font-mono-spec flex items-center justify-between text-slate-400">
                  <span>UNPLASTICIZED MONOLITHIC BORE</span>
                  <span className="text-emerald-400 font-bold">100% VIRGIN COMPOUND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY CHOOSE OUR STORE (GENERAL NON-FACTUAL BENEFITS ONLY) */}
      {/* ========================================================= */}
      <section className="py-14 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider block mb-1">
              STORE ADVANTAGES
            </span>
            <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
              WHY CHOOSE OUR STORE
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Explore a direct product-focused plumbing store built specifically for straightforward sourcing and fast quoting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded text-left">
              <div className="w-10 h-10 rounded bg-[#005B96]/10 text-[#005B96] flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-sm font-bold text-[#17212B] uppercase mb-2">
                Product-Focused Catalog
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated exclusively to PVC pipes, fittings, valves, and plumbing supplies with clear dimensional specifications.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded text-left">
              <div className="w-10 h-10 rounded bg-[#00A6A6]/10 text-[#00A6A6] flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-sm font-bold text-[#17212B] uppercase mb-2">
                Easy Product Discovery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter quickly by nominal diameter, pressure rating, material grade, and pipe length without confusing terminology.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded text-left">
              <div className="w-10 h-10 rounded bg-[#F5A623]/20 text-[#F5A623] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-[#F5A623]" />
              </div>
              <h3 className="font-tech text-sm font-bold text-[#17212B] uppercase mb-2">
                Quote Requests
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit project bill of materials directly online for tailored contractor pricing instead of paying fixed retail markups.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded text-left">
              <div className="w-10 h-10 rounded bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-tech text-sm font-bold text-[#17212B] uppercase mb-2">
                Convenient Online Browsing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check item availability, review technical data sheets, and order for Cash on Delivery at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. BULK ORDER CTA */}
      {/* ========================================================= */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#005B96] to-[#004370] text-white rounded p-8 sm:p-10 shadow-lg border border-[#004370]">
          <div className="max-w-3xl space-y-4">
            <span className="text-[#F5A623] text-xs font-mono-spec font-bold uppercase tracking-wider block">
              CONTRACTOR &amp; SITE PROCUREMENT
            </span>
            <h2 className="font-tech text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              NEED MULTIPLE PRODUCTS? REQUEST A QUOTE
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Supplying residential schemes, agricultural irrigation runs, or commercial plumbing installations? Submit your required pipe sizes, quantities, and delivery location for direct volume quote.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/bulk-orders')}
                className="px-6 py-3 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] font-tech font-bold text-xs uppercase tracking-wider rounded shadow transition-colors cursor-pointer"
              >
                REQUEST BULK QUOTE
              </button>
              <a
                href="tel:+92614540198"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <Phone className="w-4 h-4 text-[#F5A623]" />
                <span>Call Shop: +92-61-4540198</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PRODUCT APPLICATIONS (RESIDENTIAL / COMMERCIAL / CONSTRUCTION) */}
      {/* ========================================================= */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 pb-3 border-b-2 border-slate-200">
            <span className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider block mb-1">
              SYSTEM INTEGRATION
            </span>
            <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
              PLUMBING APPLICATIONS
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Engineered categories designed for varied civil and architectural plumbing requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded p-6 hover:border-[#005B96] transition-colors">
              <div className="w-10 h-10 rounded bg-[#005B96]/10 text-[#005B96] flex items-center justify-center mb-3">
                <HomeIcon className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-base font-bold text-[#17212B] uppercase mb-2">
                Residential Plumbing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Drinking cold water distribution, bathroom fixtures, overhead tank supply risers, and domestic sanitary drainage lines.
              </p>
              <ul className="text-xs font-mono-spec text-slate-500 space-y-1">
                <li>· uPVC Class C water lines (1/2" to 1")</li>
                <li>· Molded directional 90° &amp; 45° elbows</li>
                <li>· Sump and overhead cutoff ball valves</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded p-6 hover:border-[#00A6A6] transition-colors">
              <div className="w-10 h-10 rounded bg-[#00A6A6]/10 text-[#00A6A6] flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-base font-bold text-[#17212B] uppercase mb-2">
                Commercial Plumbing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Multi-story booster manifolds, heavy-capacity drainage stacks, cooling tower supply loops, and plant water treatment.
              </p>
              <ul className="text-xs font-mono-spec text-slate-500 space-y-1">
                <li>· Schedule 40 heavy-wall pipes</li>
                <li>· True union inline servicing ball valves</li>
                <li>· Acoustic vibration-damped pipe hangers</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded p-6 hover:border-[#F5A623] transition-colors">
              <div className="w-10 h-10 rounded bg-[#F5A623]/20 text-[#17212B] flex items-center justify-center mb-3">
                <Factory className="w-5 h-5 text-[#F5A623]" />
              </div>
              <h3 className="font-tech text-base font-bold text-[#17212B] uppercase mb-2">
                Construction &amp; Civil
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Underground mains, gravity sewer drops, electrical conduit shielding, and stormwater culvert discharge.
              </p>
              <ul className="text-xs font-mono-spec text-slate-500 space-y-1">
                <li>· 75mm &amp; 110mm sanitary soil pipes</li>
                <li>· Non-return swing check flap valves</li>
                <li>· Heavy chemical solvent cement bonding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FAQ ACCORDION PREVIEW */}
      {/* ========================================================= */}
      <section className="py-14 max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider block mb-1">
              STORE GUIDANCE
            </span>
            <h2 className="font-tech text-2xl sm:text-3xl font-bold text-[#17212B] uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#005B96]" />
                What PVC products do you sell?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                We supply uPVC potable water pipes, Schedule 40 pressure pipes, drainage &amp; soil pipes, elbows, tees, reducers, ball valves, check valves, and plumbing solvent cements. Please contact the store for current availability and policy details.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#005B96]" />
                Can I request a bulk quotation?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Yes. Use our online "Request a Quote" or "Bulk Orders" forms to submit itemized lists with required diameters and quantities. Our staff will respond with commercial rates.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#005B96]" />
                Do you offer delivery in Multan?
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Cash on delivery is available for orders within Multan. For outlying areas and bulk contractor drops, please contact the store for current availability and policy details.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/faq')}
              className="text-xs font-semibold text-[#005B96] hover:underline"
            >
              View All Frequently Asked Questions &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. LOCATION & SHOP CONTACT BANNER */}
      {/* ========================================================= */}
      <section className="py-14 bg-[#17212B] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[#00A6A6] text-xs font-mono-spec font-bold uppercase tracking-widest block">
                VISIT OR CALL OUR PHYSICAL STORE
              </span>
              <h2 className="font-tech text-2xl sm:text-3xl font-bold uppercase">
                SHAUKAT PVC PLASTIC PIPE SHOP
              </h2>
              <div className="flex items-start gap-2.5 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 text-[#00A6A6] shrink-0 mt-0.5" />
                <p>
                  17-A Hassan Parnana Colony, Multan, Punjab, Pakistan
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-mono-spec">
                <Phone className="w-5 h-5 text-[#00A6A6] shrink-0" />
                <a href="tel:+92614540198" className="text-white hover:text-[#00A6A6] font-bold">
                  +92-61-4540198
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=17-A+Hassan+Parnana+Colony+Multan+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded text-center transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href="tel:+92614540198"
                className="px-5 py-3 bg-[#F5A623] hover:bg-[#e09419] text-[#17212B] font-tech font-bold text-xs uppercase tracking-wider rounded text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>CALL NOW: +92-61-4540198</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
