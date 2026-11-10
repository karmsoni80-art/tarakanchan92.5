import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/pricing';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { api } from '../../services/api';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Sync selected size when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setSelectedImage(0);
      setPincodeStatus(null);
    }
  }, [product]);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    const res = await api.checkPincode(pincode);
    if (res.isDeliverable) {
      setPincodeStatus(`✓ Delivery available to ${res.city}! Estimated arrival by ${res.deliveryDate}.`);
    } else {
      setPincodeStatus('Sorry, pincode currently unserviceable.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#3E2630] border border-[#D4AF37]/50 rounded-2xl max-w-4xl w-full text-[#F8F1F1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#6F4C57]/60 hover:bg-[#6F4C57] text-white hover:text-[#D4AF37] transition cursor-pointer"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-[#2B1921] flex flex-col justify-between">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#6F4C57]/40 mb-4 bg-black/30">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#3E2630]/80 backdrop-blur text-[11px] text-[#D4AF37] border border-[#D4AF37]/30">
                BIS 925 Hallmark Guaranteed
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                      selectedImage === idx ? 'border-[#D4AF37]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Category & Hallmark */}
              <div className="flex items-center space-x-2 text-xs text-[#E8C7CC] mb-2 font-mono">
                <span className="uppercase">{product.category}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h2 className="font-playfair text-2xl font-bold text-[#F8F1F1] mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-300 font-medium">
                  {product.rating} ({product.reviewCount} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F1F1]">
                  {formatINR(product.sellingPrice)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-sm line-through text-zinc-400">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-[#B76E79] text-white font-bold text-xs">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Silver Purity & Weight */}
              <div className="p-3 rounded-xl bg-[#6F4C57]/20 border border-[#6F4C57]/40 mb-4 text-xs space-y-1">
                <div className="flex items-center text-[#D4AF37] font-medium">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  <span>{product.silverPurity}</span>
                </div>
                <div className="text-zinc-300">
                  Approx. Gross Silver Weight: <strong className="text-white">{product.weightGrams} grams</strong>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#E8C7CC] mb-2">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#B76E79] text-white border-[#B76E79]'
                            : 'bg-[#6F4C57]/30 text-zinc-200 border-[#6F4C57] hover:border-[#D4AF37]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5 flex items-center space-x-4">
                <span className="text-xs text-[#E8C7CC]">Quantity:</span>
                <div className="flex items-center border border-[#6F4C57] rounded-lg overflow-hidden bg-[#6F4C57]/30">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-sm hover:bg-[#6F4C57] transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-sm hover:bg-[#6F4C57] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery checker */}
              <form onSubmit={handleCheckPincode} className="mb-5">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#6F4C57]/40 text-xs rounded-lg pl-9 pr-3 py-2 border border-[#6F4C57] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-[#6F4C57] hover:bg-[#B76E79] text-xs font-medium text-white transition cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {pincodeStatus && (
                  <p className="text-[11px] text-[#D4AF37] mt-1.5 font-medium">{pincodeStatus}</p>
                )}
              </form>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-[#6F4C57]/40">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    wishlisted
                      ? 'bg-[#B76E79] border-[#B76E79] text-white'
                      : 'bg-[#6F4C57]/30 border-[#6F4C57] text-[#F8F1F1] hover:text-[#B76E79]'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="w-full py-2.5 rounded-xl border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:text-white hover:bg-[#6F4C57]/40 text-xs font-medium transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>View Complete Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
