import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'Are all TARAKANCHAN jewellery pieces genuine 92.5 Sterling Silver?',
      a: 'Yes, 100%. Every single piece is crafted in solid 92.5 pure sterling silver and is stamped with the official government Bureau of Indian Standards (BIS) hallmark. We also include a signed Certificate of Authenticity with every purchase.',
    },
    {
      q: 'Will my silver jewellery turn black or tarnish over time?',
      a: 'All silver naturally reacts with airborne sulphur over extended periods. However, all TARAKANCHAN pieces are coated with an electro-plated layer of pure liquid Rhodium (a platinum-family metal) that prevents everyday oxidation and preserves brilliant luster. We also provide free lifetime polishing and cleaning concierge!',
    },
    {
      q: 'What is your returns and exchange policy?',
      a: 'We offer an unconditional 15-Day Hassle-Free Returns & Exchange guarantee. If your piece does not fit or match your expectations, our courier partner will arrange insured doorstep reverse pickup and process an instant refund.',
    },
    {
      q: 'How long does insured express delivery take?',
      a: 'Metros (Mumbai, Delhi, Bengaluru, Chennai, Pune, Kolkata) receive orders within 2 to 3 business days. All other Indian pin codes receive orders within 3 to 4 business days via BlueDart Luxury Secure Express.',
    },
    {
      q: 'Is Cash on Delivery (COD) available?',
      a: 'Yes, COD is available across 19,000+ Indian postal codes for orders up to ₹25,000.',
    },
    {
      q: 'What packaging will my jewellery arrive in?',
      a: 'Every piece is nestled in our signature burgundy velvet keepsake jewelry chest, sealed inside a tamper-evident luxury gold shipping carton with an authenticity card and silver polishing cloth.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#3E2630] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            <HelpCircle className="w-4 h-4" />
            <span>Customer Assistance</span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Frequently Asked Questions
          </h1>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-300 font-light">
            Answers regarding our certified silver quality, shipping, hallmarking, and maintenance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 overflow-hidden shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-sm sm:text-base font-playfair font-semibold text-white hover:text-[#D4AF37] transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D4AF37] transition-transform duration-300 flex-shrink-0 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs text-zinc-300 font-light leading-relaxed border-t border-[#6F4C57]/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
