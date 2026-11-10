import React from 'react';
import { ShieldCheck, RefreshCw, FileText, Lock } from 'lucide-react';

interface PolicyPageProps {
  type: 'returns' | 'privacy' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  return (
    <div className="bg-[#3E2630] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-4xl mx-auto space-y-8">
        {type === 'returns' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6 text-xs text-zinc-300 leading-relaxed font-light">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#6F4C57]/40">
              <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <h1 className="font-playfair text-3xl font-bold text-white">
                  15-Day Hassle-Free Returns & Exchange Policy
                </h1>
                <p className="text-[#E8C7CC]">Our promise of complete satisfaction</p>
              </div>
            </div>

            <p>
              At TARAKANCHAN 92.5, your confidence and delight are paramount. If for any reason your selected piece of sterling silver jewellery does not meet your expectations, we offer an unconditional 15-day return and exchange policy from the date of recorded delivery.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Eligibility Guidelines:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Jewellery must be in its original unworn condition with the security tag intact.</li>
              <li>Must include the original burgundy velvet gift box and Certificate of Authenticity card.</li>
              <li>Customized engraved items cannot be returned unless a manufacturing defect exists.</li>
            </ul>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Doorstep Insured Reverse Pickup:</h3>
            <p>
              Simply contact our concierge team or request return through your Customer Dashboard. Our courier partner will schedule an insured pickup from your doorstep at zero cost to you.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Refund Processing:</h3>
            <p>
              Refunds are initiated within 24 hours of package inspection at our atelier and credited back to the original payment method or bank account.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6 text-xs text-zinc-300 leading-relaxed font-light">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#6F4C57]/40">
              <Lock className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <h1 className="font-playfair text-3xl font-bold text-white">Privacy & Data Security Policy</h1>
                <p className="text-[#E8C7CC]">How we safeguard your patron confidentiality</p>
              </div>
            </div>

            <p>
              TARAKANCHAN 92.5 is committed to protecting your personal information with bank-grade security standards. We never sell, rent, or trade your contact or order details to third parties.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Data We Collect:</h3>
            <p>
              We collect your name, shipping address, contact phone, and email solely to process insured shipments, provide 92.5 hallmark authenticity records, and furnish order tracking notifications.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Payment Credentials:</h3>
            <p>
              Credit card, debit card, and UPI transactions are tokenized through Razorpay PCI-DSS certified payment gateways. TARAKANCHAN does not store your card details or CVV on our servers.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6 text-xs text-zinc-300 leading-relaxed font-light">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#6F4C57]/40">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <h1 className="font-playfair text-3xl font-bold text-white">Terms of Service & Hallmarking Warranty</h1>
                <p className="text-[#E8C7CC]">Legal and commercial terms governing purchases</p>
              </div>
            </div>

            <p>
              By accessing and placing orders on TARAKANCHAN 92.5, you agree to these terms. All products offered are guaranteed to be genuine 92.5 pure sterling silver hallmarked in compliance with Bureau of Indian Standards (BIS) regulations.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Pricing & Weights:</h3>
            <p>
              Prices are in Indian Rupees (INR) and are inclusive of applicable goods and services tax (GST). Approximate gross silver weights in grams are stated in the specifications of each product.
            </p>

            <h3 className="font-playfair text-base font-bold text-white pt-2">Intellectual Property:</h3>
            <p>
              All jewellery designs, photographs, branding marks, and text are proprietary assets of TARAKANCHAN 92.5 Jewellers Ltd.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
