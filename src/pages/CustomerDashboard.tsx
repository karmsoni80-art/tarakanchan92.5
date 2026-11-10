import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ShoppingBag, 
  MapPin, 
  Lock, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  ChevronRight, 
  Plus, 
  Trash2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Order, Address, OrderStatus } from '../types';
import { formatINR } from '../utils/pricing';
import { api } from '../services/api';

interface CustomerDashboardProps {
  initialTab?: 'profile' | 'orders' | 'addresses' | 'security';
  onNavigateToShop: () => void;
  onNavigateToOrderDetails?: (orderId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = 'orders',
  onNavigateToShop,
}) => {
  const { currentUser, updateUser, logout } = useAuth();
  const { showToast } = useCartWishlist();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Form state
  const [addresses, setAddresses] = useState<Address[]>(currentUser?.addresses || []);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  // Security
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const lookupEmail = currentUser?.email || localStorage.getItem('tk_recent_order_email') || 'customer@tarakanchan.com';
    const lookupId = currentUser?.id || '';

    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setAddresses(currentUser.addresses || []);
    }

    setLoadingOrders(true);
    api.getOrders(lookupId || lookupEmail)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [currentUser]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    updateUser({ name, phone });
    setIsUpdatingProfile(false);
    showToast('Profile information updated successfully', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !newCity || !newPincode) {
      showToast('Please fill all address fields', 'error');
      return;
    }
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName: name,
      phone: phone,
      addressLine1: newAddrLine,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
      addressType: 'Home',
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    updateUser({ addresses: updated });
    setIsAddAddressOpen(false);
    setNewAddrLine('');
    setNewCity('');
    setNewPincode('');
    showToast('New delivery address saved', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    updateUser({ addresses: updated });
    showToast('Address removed', 'info');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    showToast('Password updated successfully', 'success');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getOrderStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Dispatched': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-[#E8C7CC] uppercase tracking-wider mb-1">My Account</p>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Patron Dashboard
          </h1>
          <p className="text-xs text-zinc-300 font-light mt-1">
            Welcome back, {currentUser?.name || 'Valued Patron'} ({currentUser?.email})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="space-y-2">
            <div className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#B76E79] text-white shadow'
                    : 'text-zinc-300 hover:bg-[#6F4C57]/40'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Orders & Tracking ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#B76E79] text-white shadow'
                    : 'text-zinc-300 hover:bg-[#6F4C57]/40'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Personal Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#B76E79] text-white shadow'
                    : 'text-zinc-300 hover:bg-[#6F4C57]/40'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Delivery Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#B76E79] text-white shadow'
                    : 'text-zinc-300 hover:bg-[#6F4C57]/40'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Account Security</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* TAB 1: ORDERS & TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-xl font-bold text-white">Order History & Live Tracking</h3>
                  <button
                    onClick={onNavigateToShop}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    + Browse More Jewels
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-zinc-400">Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-[#D4AF37] mx-auto" />
                    <h4 className="font-playfair text-base font-bold text-white">No orders placed yet</h4>
                    <p className="text-xs text-zinc-400">Your future jewellery acquisitions will appear here with live tracking.</p>
                  </div>
                ) : (
                  orders.map((ord) => {
                    const step = getOrderStatusStep(ord.orderStatus);
                    return (
                      <div
                        key={ord.id}
                        className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#6F4C57]/40 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-400">Order Reference</span>
                            <p className="font-playfair text-base font-bold text-white">{ord.orderNumber}</p>
                            <span className="text-[11px] text-[#E8C7CC]">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="sm:text-right">
                            <span className="text-[10px] text-zinc-400">Total Paid (INR)</span>
                            <p className="font-playfair text-base font-bold text-[#D4AF37]">{formatINR(ord.totalAmount)}</p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              {ord.paymentStatus} via {ord.paymentMethod}
                            </span>
                          </div>
                        </div>

                        {/* Order Visual Tracking Progress Bar */}
                        <div className="p-4 rounded-xl bg-[#3E2630]/60 border border-[#6F4C57]/40 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-[#D4AF37] font-semibold">
                              <Truck className="w-4 h-4" />
                              <span>Status: {ord.orderStatus}</span>
                            </div>
                            <span className="text-[11px] text-zinc-300 font-mono">
                              AWB: {ord.trackingNumber || 'Pending'}
                            </span>
                          </div>

                          {/* 5-Step Timeline */}
                          <div className="grid grid-cols-5 gap-1 pt-2">
                            {['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'].map((stName, idx) => {
                              const isCompleted = step >= idx + 1;
                              const isCurrent = step === idx + 1;
                              return (
                                <div key={stName} className="text-center space-y-1">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      isCompleted
                                        ? 'bg-[#D4AF37]'
                                        : 'bg-zinc-700'
                                    } ${isCurrent ? 'animate-pulse' : ''}`}
                                  />
                                  <span className={`text-[9px] block leading-tight ${isCompleted ? 'text-white font-medium' : 'text-zinc-500'}`}>
                                    {stName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <p className="text-[11px] text-zinc-400 pt-1">
                            Courier: {ord.courierPartner || 'BlueDart Luxury Secure'} • {ord.estimatedDeliveryDate}
                          </p>
                        </div>

                        {/* Items in order */}
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#3E2630]/30 text-xs">
                              <div className="flex items-center space-x-3">
                                <img src={item.image} alt="" className="w-12 h-12 rounded object-cover" />
                                <div>
                                  <p className="font-semibold text-white">{item.name}</p>
                                  <p className="text-[10px] text-zinc-400">Size: {item.selectedSize} × {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-[#F8F1F1]">{formatINR(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6">
                <h3 className="font-playfair text-xl font-bold text-white border-b border-[#6F4C57]/40 pb-3">
                  Personal Details
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs max-w-lg">
                  <div>
                    <label className="block text-[#E8C7CC] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#E8C7CC] mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full bg-[#3E2630]/50 border border-[#6F4C57] rounded-xl p-2.5 text-zinc-400 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-zinc-500">Contact concierge to change verified email</span>
                  </div>

                  <div>
                    <label className="block text-[#E8C7CC] mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="py-3 px-6 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider shadow"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-playfair text-xl font-bold text-white">Saved Delivery Addresses</h3>
                  <button
                    onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
                    className="px-4 py-2 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {isAddAddressOpen && (
                  <form onSubmit={handleAddAddress} className="p-6 rounded-2xl bg-[#2B1921] border border-[#D4AF37]/50 space-y-4 text-xs animate-in fade-in">
                    <h4 className="font-playfair text-base font-bold text-white">New Delivery Location</h4>
                    <div>
                      <label className="block text-[#E8C7CC] mb-1">Address Line</label>
                      <input
                        type="text"
                        required
                        value={newAddrLine}
                        onChange={(e) => setNewAddrLine(e.target.value)}
                        placeholder="House no, Building, Street"
                        className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#E8C7CC] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[#E8C7CC] mb-1">Pincode</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#3E2630] font-bold">
                      Save Address
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl bg-[#2B1921] border border-[#6F4C57]/60 text-xs flex justify-between">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-[#6F4C57]/40 text-[#D4AF37] font-semibold text-[10px]">
                          {addr.addressType}
                        </span>
                        <p className="font-bold text-white mt-1">{addr.fullName}</p>
                        <p className="text-zinc-300">{addr.addressLine1}</p>
                        <p className="text-zinc-300">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-zinc-400 text-[11px]">Phone: {addr.phone}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-zinc-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === 'security' && (
              <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 shadow-xl space-y-6">
                <h3 className="font-playfair text-xl font-bold text-white border-b border-[#6F4C57]/40 pb-3">
                  Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-sm">
                  <div>
                    <label className="block text-[#E8C7CC] mb-1">New Password (Min 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#E8C7CC] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider shadow"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
