import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FestivePromotionsProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FestivePromotions: React.FC<FestivePromotionsProps> = ({ onNavigate }) => {
  const festiveBanners = [
    {
      id: 'festive-bridal',
      title: 'The Royal Wedding Trousseau',
      subtitle: 'Heirloom Polki & Nakshi Silver',
      tag: 'Bridal 2026',
      description: 'Handcrafted Polki chokers, grand jhumkas, and carved kadas dipped in 24K antique gold foil.',
      collection: 'Bridal Collection',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'festive-diwali',
      title: 'Diwali & Dhanteras Pure Silver',
      subtitle: 'Auspicious Silver Keepsakes',
      tag: 'Festive Special',
      description: 'Invoke prosperity with BIS 925 certified pure silver coins, sacred pendants, and melodic payals.',
      collection: 'Festive Collection',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'festive-valentines',
      title: 'Eternity Solitaires & Charms',
      subtitle: 'Valentines & Anniversary Gifts',
      tag: 'Gifting Edition',
      description: 'Shimmering brilliant-cut zirconia rings and delicate tennis bracelets that celebrate forever.',
      collection: 'Valentines Special',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Occasions & Celebrations</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide">
              Festive & Bridal Collections
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', { collection: 'Festive Collection' })}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-medium text-[#D4AF37] hover:text-white transition group cursor-pointer"
          >
            <span>Explore All Festive Editions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {festiveBanners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => onNavigate('shop', { collection: banner.collection })}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-[#6F4C57]/60 hover:border-[#D4AF37] shadow-xl transition-all duration-500 hover:-translate-y-1.5"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E2630] via-[#3E2630]/60 to-transparent opacity-95 group-hover:opacity-85 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-[#F8F1F1]">
                <span className="inline-block w-fit px-2.5 py-1 rounded bg-[#B76E79] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  {banner.tag}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                  {banner.subtitle}
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                  {banner.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light mb-4 line-clamp-2">
                  {banner.description}
                </p>
                <div className="inline-flex items-center space-x-2 text-xs font-medium text-[#D4AF37] group-hover:text-white transition-colors">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
