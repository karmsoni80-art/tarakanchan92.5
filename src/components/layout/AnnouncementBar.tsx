import React from 'react';
import { Sparkles, ShieldCheck, Truck, Phone } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenContact?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenContact }) => {
  return (
    <div className="bg-[#3E2630] border-b border-[#6F4C57]/40 text-[#F8F1F1] text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Live Silver Rate & Hallmark */}
        <div className="flex items-center space-x-3 text-xs tracking-wider">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-medium border border-[#D4AF37]/30 text-[11px]">
            <ShieldCheck className="w-3 h-3 mr-1" />
            BIS 925 Hallmarked
          </span>
          <span className="hidden sm:inline text-zinc-300">
            Today's 925 Sterling Silver: <strong className="text-[#D4AF37]">₹98.50 / gm</strong>
          </span>
        </div>

        {/* Center: Special Offer */}
        <div className="flex items-center space-x-2 text-center font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-[#F8F1F1]">
            Complimentary Velvet Box & Insured Shipping above ₹1,999 | Code: <span className="text-[#D4AF37] font-bold tracking-wider underline">FIRST925</span> for ₹500 Off
          </span>
        </div>

        {/* Right: Concierge & Helpline */}
        <div className="hidden lg:flex items-center space-x-4 text-zinc-300 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>All-India Express Delivery</span>
          </div>
          <button
            onClick={onOpenContact}
            className="flex items-center space-x-1 text-[#F8F1F1] hover:text-[#D4AF37] transition cursor-pointer"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>Concierge: +91 (022) 2899-9250</span>
          </button>
        </div>
      </div>
    </div>
  );
};
