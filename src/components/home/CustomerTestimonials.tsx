import React from 'react';
import { Star, ShieldCheck, Quote, Sparkles } from 'lucide-react';

export const CustomerTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Ananya Desai',
      city: 'Mumbai',
      jewel: 'Regal Maharani Kundan Ring',
      rating: 5,
      date: 'Verified Buyer • 2 weeks ago',
      comment:
        'The 925 BIS hallmark stamp is clearly visible and authentic. The finish is indistinguishable from solid gold polki jewelry. Packaging in the wine velvet box was magnificent.',
    },
    {
      name: 'Meera Rajput',
      city: 'Jaipur',
      jewel: 'Chandrika Peacock Jhumkas',
      rating: 5,
      date: 'Verified Buyer • 3 weeks ago',
      comment:
        'Wore these for my sister’s sangeet. The peacock carvings are so fine and delicate. People thought they were real vintage antique pieces passed down through generations.',
    },
    {
      name: 'Radhika Singhania',
      city: 'New Delhi',
      jewel: 'Aadhya Royal Polki Choker',
      rating: 5,
      date: 'Verified Buyer • 1 month ago',
      comment:
        'Solid weight, immaculate gold polish, and the green emerald stones have an ethereal depth. TARAKANCHAN is truly setting the international standard for sterling silver.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Words of Admiration</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide mb-3">
            Loved By Over 25,000+ Patrons
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
          <p className="text-zinc-300 text-sm font-light">
            Read authentic experiences from brides, collectors, and jewellery lovers who trust TARAKANCHAN 92.5.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-[#6F4C57]/20 border border-[#6F4C57]/50 relative flex flex-col justify-between hover:border-[#D4AF37]/60 hover:bg-[#6F4C57]/30 transition-all shadow-xl"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-6 right-6" />

              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-zinc-200 text-sm font-light leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#6F4C57]/40 flex items-center justify-between">
                <div>
                  <h4 className="font-playfair text-base font-semibold text-white">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-[#E8C7CC]">{rev.city} • {rev.jewel}</p>
                </div>

                <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
