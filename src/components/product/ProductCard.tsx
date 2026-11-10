import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Scale, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/pricing';
import { useCartWishlist } from '../../context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    toggleCompare,
    compareList 
  } = useCartWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative bg-[#6F4C57]/20 border border-[#6F4C57]/60 hover:border-[#D4AF37]/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.discount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#B76E79] text-white font-bold text-[10px] tracking-wider shadow">
            {product.discount}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#3E2630] font-bold text-[10px] tracking-wider shadow">
            BEST SELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] tracking-wider shadow">
            NEW ARRIVAL
          </span>
        )}
      </div>

      {/* Top Action Icons (Wishlist & Compare) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
            wishlisted
              ? 'bg-[#B76E79] text-white'
              : 'bg-[#3E2630]/70 text-[#F8F1F1] hover:text-[#B76E79] hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isCompared
              ? 'bg-[#D4AF37] text-[#3E2630]'
              : 'bg-[#3E2630]/70 text-[#F8F1F1] hover:text-[#D4AF37] hover:bg-white'
          }`}
          title={isCompared ? 'Remove from compare' : 'Compare product'}
          aria-label={`Compare ${product.name}`}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container with Quick View Button */}
      <div
        className="relative w-full aspect-square overflow-hidden bg-[#3E2630]/80 cursor-pointer"
        onClick={() => onSelectProduct ? onSelectProduct(product) : setQuickViewProduct(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 px-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#3E2630]/90 hover:bg-[#6F4C57] text-white text-xs font-medium border border-[#D4AF37]/50 shadow-lg backdrop-blur-md flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between text-[#F8F1F1]">
        <div>
          {/* Category & Hallmark tag */}
          <div className="flex items-center justify-between text-[11px] text-[#E8C7CC] mb-1 font-mono">
            <span className="uppercase tracking-wider">{product.category}</span>
            <span className="inline-flex items-center text-[#D4AF37] font-medium">
              <ShieldCheck className="w-3 h-3 mr-0.5" />
              925 Silver
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct ? onSelectProduct(product) : setQuickViewProduct(product)}
            className="font-playfair text-base font-semibold text-[#F8F1F1] hover:text-[#D4AF37] transition-colors line-clamp-1 cursor-pointer mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* SKU & Weight */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2">
            <span>SKU: {product.sku}</span>
            <span>Wt: {product.weightGrams}g</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-zinc-300">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline space-x-2 pt-1 mb-3">
            <span className="font-playfair text-lg sm:text-xl font-bold text-[#F8F1F1]">
              {formatINR(product.sellingPrice)}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="text-xs line-through text-zinc-400">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, product.sizes[0], 1)}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
              product.inStock
                ? 'bg-[#B76E79] hover:bg-[#C8A4A6] text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
