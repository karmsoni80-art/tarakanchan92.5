import React from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const HallmarkSection: React.FC = () => {
  const hallmarkPoints = [
    {
      title: '925 Purity Stamping',
      desc: 'Denotes exactly 92.5% pure precious silver, the international benchmark for fine jewelry.',
    },
    {
      title: 'BIS Triangular Logo',
      desc: 'Official Bureau of Indian Standards government certification mark.',
    },
    {
      title: 'Assaying Center Code',
      desc: 'Authorized government-approved testing and hallmarking laboratory identification.',
    },
    {
      title: 'TARAKANCHAN Maker Mark',
      desc: 'Our proprietary atelier emblem ensuring lifetime authenticity and buyback support.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#2B1921] border-y border-[#6F4C57]/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Graphic Hallmark Illustration Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#3E2630] to-[#6F4C57]/40 border border-[#D4AF37]/50 shadow-2xl">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                Government Certified
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold text-white">
                  BIS 925 Hallmark Guarantee
                </h3>
                <p className="text-xs text-[#E8C7CC]">Bureau of Indian Standards Compliant</p>
              </div>
            </div>

            {/* Hallmarking Visual Breakdown */}
            <div className="p-4 rounded-xl bg-black/40 border border-[#6F4C57]/60 mb-6 font-mono text-xs space-y-3">
              <div className="text-center text-[#D4AF37] font-bold text-sm tracking-widest pb-2 border-b border-[#6F4C57]/40">
                [ ▲ BIS LOGO ] • [ 925 ] • [ AHC ] • [ TK ]
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Every TARAKANCHAN jewel carries laser-etched stamps verifiable under a jeweller's 10x loupe, accompanied by a physical tamper-proof Authenticity Card with QR certificate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {hallmarkPoints.map((pt, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#6F4C57]/20 border border-[#6F4C57]/40">
                  <div className="flex items-center space-x-1.5 text-[#D4AF37] font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{pt.title}</span>
                  </div>
                  <p className="text-zinc-300 text-[11px]">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Why Choose TARAKANCHAN */}
          <div className="space-y-6 text-[#F8F1F1]">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The TARAKANCHAN Standard</span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">
              Why Discerning Connoisseurs Choose TARAKANCHAN 92.5
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
              Pure silver (99.9%) is naturally malleable and delicate. By mastering the exact classical metallurgy ratio of 92.5% pure silver with platinum-group strengthening agents, our artisans craft heirloom jewelry with unmatched durability, lustrous polish, and resistance to everyday tarnishing.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#B76E79]/30 border border-[#B76E79] flex items-center justify-center text-[#B76E79] flex-shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-playfair text-base font-semibold text-white">Master Artisan Craftsmanship</h4>
                  <p className="text-xs text-zinc-300 font-light">Crafted by lineage master silversmiths using antique nakshi and filigree hand-carving techniques.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/30 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-playfair text-base font-semibold text-white">Anti-Tarnish Triple Rhodium Dip</h4>
                  <p className="text-xs text-zinc-300 font-light">Coated with liquid rhodium to protect the bright platinum-white sheen and prevent skin allergies.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-playfair text-base font-semibold text-white">Lifetime Value & Buyback Guarantee</h4>
                  <p className="text-xs text-zinc-300 font-light">We stand behind our metal purity forever. Enjoy lifetime exchange and free cleaning across India.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
