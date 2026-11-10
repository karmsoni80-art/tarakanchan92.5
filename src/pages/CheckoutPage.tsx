import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Lock, 
  Tag, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Address, Order, OrderItem } from '../types';
import { formatINR } from '../utils/pricing';
import { api } from '../services/api';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigateToShop }) => {
  const { currentUser } = useAuth();
  const { cart, cartTotals, appliedCoupon, clearCart, showToast } = useCartWishlist();

  // Step 1: Delivery Address Form
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [useCustomAddress, setUseCustomAddress] = useState(
    !currentUser || !currentUser.addresses || currentUser.addresses.length === 0
  );

  const [fullName, setFullName] = useState(currentUser?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'customer@tarakanchan.com');
  const [addressLine1, setAddressLine1] = useState(
    currentUser?.addresses?.[0]?.addressLine1 || 'Flat 402, Royale Palms, Bandra West'
  );
  const [city, setCity] = useState(currentUser?.addresses?.[0]?.city || 'Mumbai');
  const [state, setState] = useState(currentUser?.addresses?.[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(currentUser?.addresses?.[0]?.pincode || '400050');

  // Step 2: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay (Test Mode)' | 'Cash on Delivery (COD)'>('Razorpay (Test Mode)');
  const [testCardNumber, setTestCardNumber] = useState('4111 2222 3333 4444');
  const [testCardExpiry, setTestCardExpiry] = useState('12/28');
  const [testCardCvv, setTestCardCvv] = useState('925');
  const [testUpiId, setTestUpiId] = useState('success@razorpay');
  const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'upi'>('card');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="bg-[#3E2630] min-h-screen py-24 text-center text-[#F8F1F1] px-4">
        <h2 className="font-playfair text-2xl font-bold mb-2">No items in your bag to checkout</h2>
        <p className="text-xs text-zinc-300 mb-6">Please add jewellery pieces before proceeding to checkout.</p>
        <button
          onClick={onNavigateToShop}
          className="px-8 py-3 rounded-full bg-[#B76E79] text-white text-xs font-medium"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !addressLine1 || !city || !pincode) {
      showToast('Please complete all required shipping fields', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        addressLine1,
        city,
        state,
        pincode,
        addressType: 'Home',
        isDefault: true,
      };

      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.images[0],
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.product.sellingPrice,
      }));

      // In test mode, create Razorpay test order reference
      let paymentId = 'cod_pending';
      let paymentStatus: 'Paid' | 'Pending' = 'Pending';

      if (paymentMethod === 'Razorpay (Test Mode)') {
        const rzp = await api.createRazorpayOrder(cartTotals.totalAmount);
        paymentId = `pay_test_${Date.now().toString().slice(-8)}`;
        paymentStatus = 'Paid';
      }

      const orderData: Partial<Order> = {
        userId: currentUser?.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress,
        items: orderItems,
        subtotal: cartTotals.subtotal,
        discountAmount: cartTotals.discountAmount,
        deliveryCharges: cartTotals.deliveryCharges,
        taxAmount: cartTotals.taxAmount,
        totalAmount: cartTotals.totalAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        paymentStatus,
        paymentId,
        orderStatus: 'Confirmed',
      };

      const placed = await api.placeOrder(orderData);
      setCompletedOrder(placed);
      clearCart();
      localStorage.setItem('tk_recent_order_id', placed.id);
      localStorage.setItem('tk_recent_order_email', email);
      showToast(`Order #${placed.orderNumber} confirmed successfully!`, 'success');
      // Do not immediately navigate away; let customer view receipt and tracking details
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="bg-[#3E2630] min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#2B1921] border border-[#D4AF37] shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Payment & Authenticity Verified
            </span>
            <h1 className="font-playfair text-3xl font-bold text-white mt-1">
              Thank You for Your Patronage!
            </h1>
            <p className="text-xs text-zinc-300 mt-1">
              Order Confirmation: <strong className="text-white font-mono">{completedOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Delivery & Tracking Card */}
          <div className="p-4 rounded-xl bg-[#3E2630] border border-[#6F4C57]/60 text-left text-xs space-y-2">
            <div className="flex justify-between items-center text-[#D4AF37] font-semibold pb-2 border-b border-[#6F4C57]/40">
              <span className="flex items-center">
                <Truck className="w-4 h-4 mr-1.5" />
                {completedOrder.courierPartner}
              </span>
              <span className="font-mono">{completedOrder.trackingNumber}</span>
            </div>
            <p className="text-zinc-300">
              Shipped to: <strong>{completedOrder.customerName}</strong>, {completedOrder.shippingAddress.addressLine1}, {completedOrder.shippingAddress.city} - {completedOrder.shippingAddress.pincode}
            </p>
            <p className="text-emerald-400 font-medium">
              Estimated Delivery: {completedOrder.estimatedDeliveryDate}
            </p>
            <div className="text-[11px] text-zinc-400 pt-1">
              Payment: {completedOrder.paymentMethod} • Status: <span className="text-emerald-400 font-bold">{completedOrder.paymentStatus}</span> (ID: {completedOrder.paymentId})
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="text-left space-y-2">
            <h4 className="text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider">
              Jewellery Reserved
            </h4>
            {completedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#3E2630]/60 border border-[#6F4C57]/40 text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-[#D4AF37]">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#6F4C57]/40">
            <button
              onClick={() => onOrderSuccess(completedOrder)}
              className="flex-1 py-3.5 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow"
            >
              View Order in Dashboard & Live Timeline
            </button>
            <button
              onClick={onNavigateToShop}
              className="py-3.5 px-6 rounded-xl border border-[#6F4C57] text-zinc-300 hover:text-white text-xs font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-[#E8C7CC] uppercase tracking-wider mb-1">Secure Checkout</p>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Complete Your Jewellery Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#6F4C57]/40 pb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-playfair text-xl font-bold text-white">
                    1. Shipping & Hallmark Certificate Address
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#E8C7CC] mb-1 font-medium">Full Name (for Hallmark Certificate)</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1 font-medium">Mobile Phone (for Courier OTP)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#E8C7CC] mb-1 font-medium">Email Address (for Digital Certificate & Invoice)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#E8C7CC] mb-1 font-medium">Delivery Address (House/Flat, Street, Landmark)</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1 font-medium">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#E8C7CC] mb-1 font-medium">Pincode (6 Digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Gateway Selection */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#6F4C57]/40 pb-3">
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-playfair text-xl font-bold text-white">
                  2. Payment Method
                </h3>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Razorpay (Test Mode)')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Razorpay (Test Mode)'
                      ? 'bg-[#6F4C57]/40 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'bg-[#3E2630] border-[#6F4C57] opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">Razorpay (Test Mode)</span>
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#3E2630] text-[10px] font-bold">
                        ACTIVE TEST
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      Supports instant Test Cards, Test UPI, and NetBanking with verified receipts.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Cash on Delivery (COD)'
                      ? 'bg-[#6F4C57]/40 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'bg-[#3E2630] border-[#6F4C57] opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">Cash on Delivery (COD)</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 text-[10px]">
                        PAY AT DOOR
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      Pay cash or UPI upon delivery inspection by BlueDart courier agent.
                    </p>
                  </div>
                </button>
              </div>

              {/* Razorpay Test Mode Card / UPI Simulator */}
              {paymentMethod === 'Razorpay (Test Mode)' && (
                <div className="p-4 rounded-2xl bg-[#3E2630] border border-[#D4AF37]/40 text-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#D4AF37] text-[11px] font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Razorpay Standard Checkout (Sandbox Environment Active)</span>
                  </div>

                  {/* Card vs UPI Tabs */}
                  <div className="flex space-x-2 border-b border-[#6F4C57]/40 pb-2">
                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('card')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        activePaymentTab === 'card' ? 'bg-[#B76E79] text-white' : 'text-zinc-400'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('upi')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        activePaymentTab === 'upi' ? 'bg-[#B76E79] text-white' : 'text-zinc-400'
                      }`}
                    >
                      Instant UPI (GPay/PhonePe)
                    </button>
                  </div>

                  {activePaymentTab === 'card' ? (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="col-span-2">
                        <label className="block text-zinc-400 text-[10px] mb-1">Test Card Number</label>
                        <input
                          type="text"
                          value={testCardNumber}
                          onChange={(e) => setTestCardNumber(e.target.value)}
                          className="w-full bg-[#2B1921] border border-[#6F4C57] rounded-lg p-2 font-mono text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={testCardExpiry}
                          onChange={(e) => setTestCardExpiry(e.target.value)}
                          className="w-full bg-[#2B1921] border border-[#6F4C57] rounded-lg p-2 font-mono text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] mb-1">CVV / CVC</label>
                        <input
                          type="text"
                          value={testCardCvv}
                          onChange={(e) => setTestCardCvv(e.target.value)}
                          className="w-full bg-[#2B1921] border border-[#6F4C57] rounded-lg p-2 font-mono text-white text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <label className="block text-zinc-400 text-[10px] mb-1">Test UPI ID</label>
                      <input
                        type="text"
                        value={testUpiId}
                        onChange={(e) => setTestUpiId(e.target.value)}
                        className="w-full bg-[#2B1921] border border-[#6F4C57] rounded-lg p-2 font-mono text-white text-xs"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">Simulated success handle: success@razorpay</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-4 sticky top-28">
              <h3 className="font-playfair text-xl font-bold text-white border-b border-[#6F4C57]/40 pb-3">
                Order Summary ({cart.length})
              </h3>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-3 text-xs">
                    <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair font-semibold text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-zinc-400">Size: {item.selectedSize} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#D4AF37]">
                      {formatINR(item.product.sellingPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#6F4C57]/40 pt-3 space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">{formatINR(cartTotals.subtotal)}</span>
                </div>

                {cartTotals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-{formatINR(cartTotals.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
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

                <div className="border-t border-[#6F4C57]/40 pt-2 flex justify-between text-base font-bold text-white">
                  <span className="font-playfair">Final Amount</span>
                  <span className="font-playfair text-[#D4AF37] text-xl">
                    {formatINR(cartTotals.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Authorizing 92.5 Hallmark Order...'
                    : `Place Order • ${formatINR(cartTotals.totalAmount)}`}
                </span>
              </button>

              <div className="text-center text-[10px] text-zinc-400 space-y-1">
                <p>🔒 256-bit Bank Grade Encryption</p>
                <p>Includes physical BIS Hallmark Guarantee card in wine velvet box</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
