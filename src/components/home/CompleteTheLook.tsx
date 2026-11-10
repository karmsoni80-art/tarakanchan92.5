import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/pricing';
import { useCartWishlist } from '../../context/CartWishlistContext';

interface CompleteTheLookProps {
  products: Product[];
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({ products }) => {
  const { addToCart, showToast } = useCartWishlist();

  // Pick 3 complementary products
  const ring = products.find((p) => p.category === 'Rings') || products[0];
  const jhumka = products.find((p) => p.category === 'Earrings') || products[1];
  const necklace = products.find((p) => p.category === 'Necklaces') || products[2];

  const lookItems = [ring, jhumka, necklace].filter(Boolean) as Product[];

  const combinedPrice = lookItems.reduce((acc, p) => acc + p.sellingPrice, 0);
  const bundleDiscount = 1200;
  const bundlePrice = combinedPrice - bundleDiscount;

  const [addedBundle, setAddedBundle] = useState(false);

  const handleAddBundleToBag = () => {
    lookItems.forEach((p) => {
      addToCart(p, p.sizes[0], 1);
    });
    setAddedBundle(true);
    showToast('Complete Bridal Maharani Ensemble added to your bag!', 'success');
    setTimeout(() => setAddedBundle(false), 3000);
  };

  if (lookItems.length < 3) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stylist's Selection</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide mb-3">
            Complete The Look: The Maharani Ensemble
          </h2>
          <p className="text-zinc-300 text-sm font-light">
            Exquisitely matched 92.5 pure silver jewelry pieces curated by our master stylists for grand wedding celebrations.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-[#6F4C57]/20 border border-[#D4AF37]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            {/* 3 Pieces Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lookItems.map((item, idx) => (
                <div key={item.id} className="relative p-4 rounded-2xl bg-[#3E2630]/80 border border-[#6F4C57]/60 flex flex-col items-center text-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/30 mb-3 border border-[#6F4C57]/40">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
                    Piece 0{idx + 1} • {item.category}
                  </span>
                  <h4 className="font-playfair text-sm font-bold text-white line-clamp-1 mb-1">
                    {item.name}
                  </h4>
                  <p className="font-playfair text-xs font-semibold text-zinc-200">
                    {formatINR(item.sellingPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Bundle Pricing Card */}
            <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#D4AF37] text-center flex flex-col justify-center space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#3E2630] font-bold text-xs uppercase tracking-wider mx-auto">
                Stylist Bundle Offer
              </span>

              <div>
                <p className="text-xs text-zinc-400">Total Separately:</p>
                <p className="text-sm line-through text-zinc-500 font-medium">
                  {formatINR(combinedPrice)}
                </p>
                <p className="font-playfair text-3xl font-extrabold text-[#D4AF37] mt-1">
                  {formatINR(bundlePrice)}
                </p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Save {formatINR(bundleDiscount)} with Bundle
                </p>
              </div>

              <button
                onClick={handleAddBundleToBag}
                disabled={addedBundle}
                className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
              >
                {addedBundle ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All 3 Items to Bag</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-400">
                Includes 3x BIS Certificates & 1x Royal Velvet Keepsake Hamper
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
