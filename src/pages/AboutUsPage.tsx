import React from 'react';
import { Crown, Sparkles, Award, ShieldCheck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-[#3E2630] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            <Crown className="w-4 h-4" />
            <span>The TARAKANCHAN Legacy</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            Where Heritage Royalty Meets Modern Silver Purity
          </h1>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto" />
          <p className="text-zinc-300 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Founded with an unyielding devotion to authentic 92.5 sterling silver, TARAKANCHAN breathes contemporary brilliance into historic Indian silversmithing traditions.
          </p>
        </div>

        {/* Narrative & Craftsmanship Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
              alt="Silversmith craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B1921] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#3E2630]/80 backdrop-blur-md border border-[#D4AF37]/30 text-xs">
              <span className="text-[#D4AF37] font-bold block mb-0.5">Artisanal Lineage</span>
              <p className="text-zinc-300">Hand-set polki glass, pure silver filigree, and royal nakshi carving.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-white leading-tight">
              A Symphony of 92.5% Pure Silver & Master Metallurgy
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Every curve, prong, and clasp in our collection is conceived at our Mumbai atelier. Our artisans preserve age-old Rajasthani craftsmanship while incorporating high-precision European micro-setting techniques and liquid rhodium electro-plating.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              We believe pure sterling silver is not an alternative to gold—it is a supreme precious metal in its own sovereign right, carrying celestial luminosity, cool elegance, and eternal value.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60">
                <p className="font-playfair text-2xl font-bold text-[#D4AF37]">100%</p>
                <p className="text-[11px] text-zinc-300">BIS 925 Hallmarked</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60">
                <p className="font-playfair text-2xl font-bold text-[#D4AF37]">25,000+</p>
                <p className="text-[11px] text-zinc-300">Cherished Patrons Across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-8">
          <h3 className="font-playfair text-2xl font-bold text-white text-center">
            Our Uncompromising Pillars of Excellence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-[#3E2630]/70 border border-[#6F4C57]/50 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-playfair text-base font-bold text-white">Absolute Purity</h4>
              <p className="text-zinc-300 leading-relaxed">
                Certified by government authorized assaying centres. Laser-stamped 925 hallmarks on every single jewel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3E2630]/70 border border-[#6F4C57]/50 space-y-2">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-playfair text-base font-bold text-white">Ethical Sourcing</h4>
              <p className="text-zinc-300 leading-relaxed">
                All our silver is conflict-free and ethically refined with zero environmental compromises.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#3E2630]/70 border border-[#6F4C57]/50 space-y-2">
              <Heart className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-playfair text-base font-bold text-white">Heirloom Warranty</h4>
              <p className="text-zinc-300 leading-relaxed">
                Lifetime cleaning, repolishing, and metal authenticity guarantee for generations of your family.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
