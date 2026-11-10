import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { useCartWishlist } from '../../context/CartWishlistContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useCartWishlist();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; code?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus({ message: res.message, code: res.discountCode });
      showToast('Welcome to TARAKANCHAN! Your ₹500 voucher is ready.', 'success');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#3E2630] to-[#2B1921] border-t border-[#6F4C57]/40">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Atelier Privileges</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8F1F1] tracking-wide mb-3">
          Join The TARAKANCHAN Silver Circle
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base font-light max-w-xl mx-auto mb-8">
          Subscribe to receive VIP access to limited-edition drops, private festive previews, and enjoy an instant <strong className="text-[#D4AF37]">₹500 welcome voucher</strong> on your first order.
        </p>

        {status ? (
          <div className="p-6 rounded-2xl bg-[#6F4C57]/30 border border-[#D4AF37] max-w-md mx-auto text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-playfair text-lg font-bold text-white">{status.message}</p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/40 border border-[#D4AF37]/60 text-xs font-mono text-[#D4AF37]">
              <Tag className="w-4 h-4" />
              <span>Use Coupon: <strong className="text-white">{status.code}</strong></span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#3E2630] border border-[#6F4C57] focus:border-[#D4AF37] text-sm text-[#F8F1F1] placeholder-zinc-400 rounded-full pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] shadow-inner"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 flex-shrink-0"
            >
              {loading ? 'Subscribing...' : 'Claim ₹500 Off'}
            </button>
          </form>
        )}

        <p className="text-[11px] text-zinc-400 mt-4">
          By subscribing, you agree to TARAKANCHAN Privacy Policy. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};
