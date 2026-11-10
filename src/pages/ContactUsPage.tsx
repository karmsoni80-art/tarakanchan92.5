import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Crown } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export const ContactUsPage: React.FC = () => {
  const { showToast } = useCartWishlist();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bridal Consultation');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Your message has been received by our senior jewellery concierge.', 'success');
  };

  return (
    <div className="bg-[#3E2630] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            <Crown className="w-4 h-4" />
            <span>Private Atelier Concierge</span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Connect With Our Master Silversmiths
          </h1>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto">
            Whether inquiring about bespoke bridal customization, ring sizing assistance, or hallmark verification, our team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Contact Info & Showroom */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6">
              <h3 className="font-playfair text-xl font-bold text-white">Flagship Atelier & Showroom</h3>

              <div className="space-y-4 text-xs text-zinc-300 font-light">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">TARAKANCHAN Atelier</strong>
                    <span>14 Heritage Jewellers Row, Zaveri Bazaar, Mumbai 400002, Maharashtra</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Concierge Hotline</strong>
                    <span>+91 (022) 2899-9250 (Mon - Sat, 10am - 8pm)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Direct Inquiries</strong>
                    <span>concierge@tarakanchan.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Showroom Hours</strong>
                    <span>Monday - Saturday: 10:30 AM – 8:30 PM | Sunday: By Private Appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl">
            {sent ? (
              <div className="py-16 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-playfair text-2xl font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-zinc-300">
                  A senior jewellery concierge will reach out to you within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">Send a Message</h3>

                <div>
                  <label className="block text-[#E8C7CC] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Singhania"
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                  >
                    <option value="Bridal Consultation">Bridal Trousseau Consultation</option>
                    <option value="Order Tracking">Order & Delivery Assistance</option>
                    <option value="Hallmark Inquiry">BIS Hallmark & Purity Inquiry</option>
                    <option value="Custom Design">Custom Bespoke Silver Jewelry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the pieces you are interested in..."
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium tracking-wider shadow cursor-pointer transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
