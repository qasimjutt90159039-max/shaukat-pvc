import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Phone, FileText } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const FAQ: React.FC = () => {
  const { navigate } = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What PVC products do you sell?',
      a: 'We supply uPVC potable water supply pipes, Schedule 40 heavy-duty pressure pipes, PVC soil and waste drainage pipes, electrical conduit pipes, and directional fittings including 90° elbows, equal tees, reducers, couplers, true union ball valves, check valves, and plumbing solvent cements.',
    },
    {
      q: 'How can I check product availability?',
      a: 'Real-time stock indicators are displayed on each product specification card in our online catalog. You can also contact our shop directly at +92-61-4540198 to verify warehouse quantities for immediate site collection or dispatch.',
    },
    {
      q: 'Can I request a bulk quotation?',
      a: 'Yes. Contractors and commercial builders can use our dedicated "Bulk Orders" or "Request a Quote" forms to submit itemized schedules of quantities for volume contractor pricing.',
    },
    {
      q: 'Can I order multiple pipe sizes?',
      a: 'Yes. Our catalog supports diameter variants ranging from 1/2-inch to 6-inch nominal bores along with corresponding reducing fittings and sockets. You can add multiple sizing variants into a single cart or quotation.',
    },
    {
      q: 'How can I contact the shop?',
      a: 'You can call our physical shop in Multan at +92-61-4540198 or visit us in person at 17-A Hassan Parnana Colony, Multan, Punjab, Pakistan.',
    },
    {
      q: 'Do you offer delivery?',
      a: 'We offer Cash on Delivery (COD) services for delivery addresses within Multan and surrounding construction sites. For outlying areas and bulk transport requirements, please contact the store for current availability and policy details.',
    },
    {
      q: 'How can I request a quotation?',
      a: 'Navigate to the "Request Quote" page, specify the required pipe class, diameters, lengths, and destination location, and submit your request. Our staff will review and prepare a formal estimate.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-xs font-mono-spec text-[#005B96] uppercase font-bold tracking-wider mb-1">
            CUSTOMER ASSISTANCE &amp; ORDERING POLICIES
          </div>
          <h1 className="font-tech text-3xl sm:text-4xl font-bold uppercase text-[#17212B]">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Find answers to common questions regarding PVC pipe types, order fulfillment, quotations, and store policies.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="bg-white border border-slate-200 rounded divide-y divide-slate-200 shadow-xs mb-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#17212B] hover:text-[#005B96] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#005B96] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#005B96]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pl-6 text-xs text-slate-600 leading-relaxed font-mono-spec">
                    <p>{faq.a}</p>
                    <p className="mt-2 text-slate-400 text-[11px] italic">
                      Please contact the store for current availability and policy details.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Store Help Card */}
        <div className="p-6 bg-slate-900 text-white rounded border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-tech text-base font-bold uppercase text-white">
              Have a specific technical question?
            </h3>
            <p className="text-xs text-slate-400">
              Speak directly with our staff at 17-A Hassan Parnana Colony, Multan.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="tel:+92614540198"
              className="px-4 py-2 bg-[#00A6A6] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+92-61-4540198</span>
            </a>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-4 py-2 bg-[#F5A623] text-[#17212B] text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
