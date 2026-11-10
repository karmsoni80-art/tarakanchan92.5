import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { CategoryInfo } from '../../types';

interface ShopByCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const ShopByCategories: React.FC<ShopByCategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Silhouettes</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8F1F1] tracking-wide mb-3">
            Shop By Categories
          </h2>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
          <p className="text-zinc-300 text-sm sm:text-base font-light">
            Explore our spectrum of certified 92.5 pure sterling silver creations, from intricate heirloom bridal jewellery to delicate everyday wonders.
          </p>
        </div>

        {/* Categories Grid - 8 Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-[#6F4C57]/50 hover:border-[#D4AF37] transition-all duration-500 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-[0.75] group-hover:brightness-[0.85]"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E2630] via-[#3E2630]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Text content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-[#F8F1F1]">
                <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                  {cat.itemCount}+ Designs
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F1F1] group-hover:text-[#D4AF37] transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 font-light line-clamp-1 mb-3">
                  {cat.tagline}
                </p>

                <div className="flex items-center space-x-1.5 text-xs font-medium text-[#E8C7CC] group-hover:text-white transition-colors">
                  <span>Explore {cat.name}</span>
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
