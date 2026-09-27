import React from 'react';
import { Home, Building2, Factory, Droplets, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const Projects: React.FC = () => {
  const { navigate } = useRouter();

  const applicationCategories = [
    {
      title: 'Residential Plumbing',
      icon: Home,
      description: 'Potable water supply manifolds, concealed bathroom lines, solar water heater loops, and domestic sewage stacks.',
      products: ['Class C uPVC Pipes (1/2" to 1.5")', 'Molded 90° & 45° Elbows', 'Equal & Reducing Tees', 'Solvent Cements'],
      specNotes: 'Compliant with domestic cold water pressure standards (PS:3051). Safe for potable human consumption.',
    },
    {
      title: 'Commercial Plumbing',
      icon: Building2,
      description: 'High-rise water risers, basement booster manifolds, cooling tower fluid loops, and multistory drainage drops.',
      products: ['Schedule 40 High-Pressure Pipes', 'True Union Ball Valves', 'Acoustic-Damped Pipe Clamps', 'Gate Valves'],
      specNotes: 'Built for continuous operating pressures up to 280 PSI and high cyclic usage.',
    },
    {
      title: 'Water Supply Distribution',
      icon: Droplets,
      description: 'Underground municipal feeder connections, tube-well discharge manifolds, overhead water tank distribution arrays.',
      products: ['Pressure uPVC Mains', 'Non-Return Flap Check Valves', 'Heavy Socket Couplers', 'PTFE Teflon Seals'],
      specNotes: 'Low hydraulic friction factor prevents scale accumulation and maintains delivery head.',
    },
    {
      title: 'Drainage & Soil Waste',
      icon: Factory,
      description: 'Gravity evacuation systems, rainwater downpipes, septic tank drop lines, and chemical detergent waste ducts.',
      products: ['75mm & 110mm Sanitary Drainage Pipes', 'P-Traps & S-Traps', 'Floor Drains', 'Flexible Drainage Hoses'],
      specNotes: 'Smooth non-stick internal bore prevents solid entrapment and detergent corrosion.',
    },
    {
      title: 'Construction & Civil Infrastructure',
      icon: Building2,
      description: 'Civil ducting, electrical wire conduit shielding, foundation dewatering channels, and culvert crossings.',
      products: ['Rigid Conduit Pipes', 'Contractor Bulk Pipe Bundles', 'Heavy Galvanized Clamps'],
      specNotes: 'High tensile impact strength resists soil settlement and concrete encasement stress.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-slate-200">
          <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
            APPLICATION CATEGORIES &amp; CIVIL SOLUTIONS
          </div>
          <h1 className="font-tech text-3xl sm:text-4xl font-bold uppercase text-[#17212B]">
            PLUMBING PROJECT APPLICATIONS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Explore how our PVC pipes, pressure fittings, and industrial valves integrate into different architectural and civil infrastructure disciplines.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          {applicationCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded p-6 shadow-xs hover:border-[#005B96] transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#005B96]/10 text-[#005B96] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-tech text-lg font-bold text-[#17212B] uppercase">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded p-4 text-xs font-mono-spec space-y-2">
                  <div className="text-[#005B96] font-bold uppercase text-[11px]">
                    Recommended Materials:
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    {cat.products.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00A6A6] rounded-full" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    {cat.specNotes}
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col gap-2">
                  <button
                    onClick={() => navigate('/request-quote')}
                    className="w-full py-2.5 px-4 bg-[#005B96] hover:bg-[#004370] text-white text-xs font-tech font-bold uppercase rounded text-center transition-colors cursor-pointer"
                  >
                    Request Project Quote
                  </button>
                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded text-center transition-colors cursor-pointer"
                  >
                    View Matching Parts
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Verified Data */}
        <div className="mt-10 p-4 bg-slate-100 border border-slate-200 rounded text-center text-xs font-mono-spec text-slate-500">
          Shaukat PVC Plastic Pipe Shop supplies components according to customer specifications. For site sizing, visit 17-A Hassan Parnana Colony, Multan or call +92-61-4540198.
        </div>
      </div>
    </div>
  );
};
