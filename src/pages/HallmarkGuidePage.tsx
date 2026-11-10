import React from 'react';
import { ShieldCheck, CheckCircle2, Award, FileText, Search } from 'lucide-react';

export const HallmarkGuidePage: React.FC = () => {
  return (
    <div className="bg-[#3E2630] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Government of India • Bureau of Indian Standards
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Understanding BIS 92.5 Silver Hallmarking
          </h1>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Your definitive collector's guide to reading, verifying, and decoding authentic hallmarked sterling silver jewellery.
          </p>
        </div>

        {/* The 4 Signs of Purity Box */}
        <div className="p-8 rounded-3xl bg-[#2B1921] border border-[#D4AF37]/50 shadow-2xl space-y-8">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#6F4C57]/40">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <h2 className="font-playfair text-2xl font-bold text-white">The 4 Official Marks on Your Jewel</h2>
              <p className="text-xs text-[#E8C7CC]">Always look for these marks stamped into the silver frame or lock</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#3E2630] border border-[#6F4C57]/60 space-y-2">
              <span className="font-mono text-sm font-bold text-[#D4AF37]">1. BIS Triangular Mark</span>
              <p className="text-zinc-300">
                The triangular logo of the Bureau of Indian Standards confirming compliance with national purity standards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#3E2630] border border-[#6F4C57]/60 space-y-2">
              <span className="font-mono text-sm font-bold text-[#D4AF37]">2. 925 Purity Grade</span>
              <p className="text-zinc-300">
                Guarantees 925 parts per thousand pure silver (92.5% silver + 7.5% hardening alloys for lifetime wear).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#3E2630] border border-[#6F4C57]/60 space-y-2">
              <span className="font-mono text-sm font-bold text-[#D4AF37]">3. Assaying & Hallmarking Centre Logo</span>
              <p className="text-zinc-300">
                The licensed government laboratory mark where the batch underwent spectroscopic purity testing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#3E2630] border border-[#6F4C57]/60 space-y-2">
              <span className="font-mono text-sm font-bold text-[#D4AF37]">4. Jeweller's Identification (TK)</span>
              <p className="text-zinc-300">
                TARAKANCHAN atelier seal, allowing lifetime authentication and complimentary repolishing.
              </p>
            </div>
          </div>
        </div>

        {/* Why Pure Silver is 92.5% */}
        <div className="p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="font-playfair text-xl font-bold text-white">Why Isn't Jewellery Made of 99.9% Pure Silver?</h3>
          <p>
            Fine silver (99.9%) is extremely soft and bends easily under normal finger pressure, making it unsuitable for holding gemstones, delicate filigree, or intricate ring prongs.
          </p>
          <p>
            By combining 92.5% pure silver with 7.5% strengthening elements like copper and trace platinum, sterling silver achieves the ideal tensile strength, enduring durability, and stunning luster required for royal heirlooms.
          </p>
        </div>
      </div>
    </div>
  );
};
