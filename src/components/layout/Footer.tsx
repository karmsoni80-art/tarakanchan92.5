import React from 'react';
import { Crown, ShieldCheck, Mail, Phone, MapPin, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2B1921] text-[#F8F1F1] border-t border-[#6F4C57]/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-playfair text-2xl font-bold tracking-widest text-[#F8F1F1]">
                TARAKANCHAN
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#3E2630] font-sans">
                92.5
              </span>
            </div>
            <p className="text-xs text-[#E8C7CC] tracking-[0.2em] uppercase font-light">
              Certified Pure Sterling Silver Jewellery
            </p>

            <p className="text-xs text-zinc-300 font-light leading-relaxed max-w-sm">
              Crafting heirloom memories in hallmarked 92.5 pure sterling silver. Designed with royal Rajasthani heritage, modern international ergonomics, and certified by the Bureau of Indian Standards (BIS).
            </p>

            <div className="p-3.5 rounded-xl bg-[#3E2630]/60 border border-[#D4AF37]/30 text-xs space-y-1.5">
              <div className="flex items-center text-[#D4AF37] font-semibold">
                <ShieldCheck className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>BIS 925 Hallmarking Guarantee</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official Certification No: BIS/SLV/MH-925-00412. Every item stamped with triangular BIS mark & purity grade.
              </p>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#6F4C57]/40 pb-2">
              Jewellery Spectrum
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300 font-light">
              {['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Anklets', 'Pendants', 'Chains', 'Gift Sets'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate('shop', { category: cat })}
                    className="hover:text-[#D4AF37] transition text-left"
                  >
                    92.5 Silver {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#6F4C57]/40 pb-2">
              Customer Concierge
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300 font-light">
              <li>
                <button onClick={() => onNavigate('dashboard', { tab: 'orders' })} className="hover:text-[#D4AF37] transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hallmark')} className="hover:text-[#D4AF37] transition text-[#D4AF37]">
                  ✨ BIS Hallmark Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-[#D4AF37] transition">
                  15-Day Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#D4AF37] transition">
                  FAQs & Care Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#D4AF37] transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#D4AF37] transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#D4AF37] font-medium transition">
                  Staff & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Atelier Showroom */}
          <div>
            <h4 className="font-playfair text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-[#6F4C57]/40 pb-2">
              Flagship Atelier
            </h4>
            <div className="space-y-3 text-xs text-zinc-300 font-light">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>TARAKANCHAN Atelier, 14 Heritage Jewellers Row, Zaveri Bazaar, Mumbai 400002</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+91 (022) 2899-9250</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>concierge@tarakanchan.com</span>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-[#E8C7CC] font-medium">Showroom Hours:</p>
                <p className="text-[11px] text-zinc-400">Mon - Sat: 10:30 AM to 8:30 PM</p>
                <p className="text-[11px] text-zinc-400">Sunday: By Private Appointment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="border-t border-[#6F4C57]/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} TARAKANCHAN 92.5 Jewellers Ltd. All Rights Reserved.</p>

          {/* Payment Badges */}
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-[11px] text-zinc-500 mr-2">Secure Test Gateway:</span>
            <span className="px-2 py-0.5 rounded bg-[#3E2630] border border-[#6F4C57] text-[10px] font-mono text-[#D4AF37]">
              Razorpay Test Mode
            </span>
            <span className="px-2 py-0.5 rounded bg-[#3E2630] border border-[#6F4C57] text-[10px] font-mono text-zinc-300">
              UPI / NetBanking
            </span>
            <span className="px-2 py-0.5 rounded bg-[#3E2630] border border-[#6F4C57] text-[10px] font-mono text-zinc-300">
              Visa / Mastercard
            </span>
            <span className="px-2 py-0.5 rounded bg-[#3E2630] border border-[#6F4C57] text-[10px] font-mono text-zinc-300">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
