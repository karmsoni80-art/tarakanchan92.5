import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Check } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatINR, FREE_SHIPPING_THRESHOLD } from '../../utils/pricing';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    cartTotals,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCartWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  const freeShippingProgress = Math.min(100, Math.round((cartTotals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#3E2630] border-l border-[#6F4C57] text-[#F8F1F1] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#6F4C57]/60 flex items-center justify-between bg-[#2B1921]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-playfair text-xl font-bold tracking-wide">
                Your Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#6F4C57] text-zinc-300 hover:text-white transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#6F4C57]/30 px-5 py-3 border-b border-[#6F4C57]/40 text-xs">
            {cartTotals.isFreeDeliveryEligible ? (
              <div className="flex items-center text-emerald-400 font-medium">
                <Check className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>You've unlocked <strong>FREE Insured Express Shipping!</strong></span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Add {formatINR(cartTotals.freeDeliveryDifference)} more for <strong>FREE Shipping</strong></span>
                  <span className="font-bold text-[#D4AF37]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-[#3E2630] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#6F4C57]/40 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-xl font-bold">Your bag is empty</h3>
                <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                  Explore our handcrafted 92.5 sterling silver collections to find your perfect statement piece.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3.5 p-3 rounded-xl bg-[#6F4C57]/20 border border-[#6F4C57]/40 relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-black/30 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-playfair text-sm font-semibold text-white truncate pr-4">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-400 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#E8C7CC] mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#6F4C57] rounded-lg overflow-hidden bg-[#3E2630]/60">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#6F4C57]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#6F4C57]"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="font-playfair text-sm font-bold text-[#F8F1F1]">
                        {formatINR(item.product.sellingPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#2B1921] border-t border-[#6F4C57]/60 space-y-4">
              {/* Coupon Code Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatINR(cartTotals.discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-300 hover:text-red-200 underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. TARA10, FIRST925)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#3E2630] border border-[#6F4C57] rounded-lg px-3 py-1.5 text-xs uppercase placeholder:normal-case placeholder-zinc-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-3.5 py-1.5 bg-[#6F4C57] hover:bg-[#B76E79] text-white text-xs font-medium rounded-lg transition"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-300 border-t border-[#6F4C57]/40 pt-3">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">{formatINR(cartTotals.subtotal)}</span>
                </div>
                {cartTotals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Savings</span>
                    <span>-{formatINR(cartTotals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span>
                    {cartTotals.deliveryCharges === 0 ? (
                      <strong className="text-emerald-400">FREE</strong>
                    ) : (
                      formatINR(cartTotals.deliveryCharges)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Hallmarked Silver)</span>
                  <span>{formatINR(cartTotals.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#6F4C57]/40">
                  <span className="font-playfair text-base">Estimated Total</span>
                  <span className="font-playfair text-base text-[#D4AF37]">
                    {formatINR(cartTotals.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-4 text-[10px] text-zinc-400">
                <span className="flex items-center">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37] mr-1" />
                  100% BIS Certified 925
                </span>
                <span>•</span>
                <span>Razorpay Test Gateway</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
