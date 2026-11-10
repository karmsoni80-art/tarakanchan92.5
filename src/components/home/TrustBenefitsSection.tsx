import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Gift, Sparkles, Award } from 'lucide-react';

export const TrustBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Award,
      title: 'BIS 925 Hallmarked',
      description: '100% certified pure sterling silver stamped with the official government BIS hallmark.',
    },
    {
      icon: Truck,
      title: 'Insured Express Shipping',
      description: 'Tamper-evident luxury packaging delivered safely to your doorstep across 19,000+ pin codes.',
    },
    {
      icon: Gift,
      title: 'Royal Velvet Gift Box',
      description: 'Every jewel arrives nestled in a plush burgundy velvet keepsake box with authenticity card.',
    },
    {
      icon: RefreshCw,
      title: '15-Day Easy Returns',
      description: 'Complete peace of mind with our no-questions-asked return and exchange policy.',
    },
    {
      icon: Sparkles,
      title: 'Lifetime Care & Polish',
      description: 'Complimentary silver polishing and cleaning concierge for the lifetime of your jewels.',
    },
  ];

  return (
    <section className="bg-[#3E2630] py-12 px-4 sm:px-6 lg:px-8 border-y border-[#6F4C57]/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#6F4C57]/20 border border-[#6F4C57]/40 hover:border-[#D4AF37]/40 hover:bg-[#6F4C57]/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#6F4C57]/50 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3.5 group-hover:scale-110 group-hover:bg-[#B76E79] group-hover:text-white transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-playfair text-[#F8F1F1] text-base font-semibold mb-1.5">
                  {b.title}
                </h3>
                <p className="text-zinc-300/80 text-xs leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
