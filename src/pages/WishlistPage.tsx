import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { formatINR } from '../utils/pricing';
import { Product } from '../types';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onNavigateToShop }) => {
  const { wishlistProducts, toggleWishlist, addToCart } = useCartWishlist();

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-[#E8C7CC] uppercase tracking-wider mb-1">My Account / Wishlist</p>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Your Saved Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-xs text-zinc-300 font-light mt-1">
            Certified 92.5 pure silver jewelry pieces saved for your special occasions.
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-24 text-center p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#6F4C57]/40 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37] mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-xs text-zinc-300 mb-6">
              Explore our bridal and everyday silver collections and tap the heart icon to save your favourites.
            </p>
            <button
              onClick={onNavigateToShop}
              className="px-8 py-3 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 hover:border-[#D4AF37] transition flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-black/30 mb-3 cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:text-red-400 transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                    {prod.category} • {prod.weightGrams}g
                  </span>
                  <h3
                    onClick={() => onSelectProduct(prod)}
                    className="font-playfair text-sm font-bold text-white truncate hover:text-[#D4AF37] transition cursor-pointer mt-1"
                  >
                    {prod.name}
                  </h3>
                  <p className="font-playfair text-base font-bold text-[#F8F1F1] mt-1 mb-4">
                    {formatINR(prod.sellingPrice)}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(prod, prod.sizes[0], 1)}
                  className="w-full py-2.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium flex items-center justify-center space-x-1.5 shadow transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
