import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  Crown, 
  Scale, 
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatINR } from '../../utils/pricing';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onSearch }) => {
  const { currentUser, isAdmin, logout, setAuthModalView } = useAuth();
  const { 
    cartCount, 
    cartTotals, 
    wishlistCount, 
    setIsCartDrawerOpen, 
    compareList, 
    setIsCompareModalOpen 
  } = useCartWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onNavigate('shop', { search: searchQuery.trim() });
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: 'All Jewellery', filter: 'All' },
    { name: 'Rings', filter: 'Rings' },
    { name: 'Earrings', filter: 'Earrings' },
    { name: 'Necklaces', filter: 'Necklaces' },
    { name: 'Bracelets', filter: 'Bracelets' },
    { name: 'Anklets', filter: 'Anklets' },
    { name: 'Pendants', filter: 'Pendants' },
    { name: 'Chains', filter: 'Chains' },
    { name: 'Gift Sets', filter: 'Gift Sets' },
    { name: 'Bridal 925', collection: 'Bridal Collection', isSpecial: true },
    { name: 'Festive', collection: 'Festive Collection', isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#6F4C57] text-[#F8F1F1] shadow-xl border-b border-[#3E2630]/60">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F8F1F1] hover:text-[#D4AF37] hover:bg-[#3E2630]/40 transition"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-playfair text-2xl sm:text-3xl font-bold tracking-widest text-[#F8F1F1]">
                  TARAKANCHAN
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#3E2630] font-sans">
                  92.5
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#E8C7CC] uppercase font-sans font-light">
                Certified Pure Sterling Silver
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search rings, necklaces, jhumkas, bridal sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#3E2630]/70 text-[#F8F1F1] placeholder-zinc-300/70 text-sm rounded-full pl-11 pr-4 py-2.5 border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition shadow-inner"
              />
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Compare */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#3E2630]/50 text-[#F8F1F1] hover:text-[#D4AF37] transition cursor-pointer"
              title="Compare Products"
              aria-label="Compare products"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#3E2630] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 rounded-full hover:bg-[#3E2630]/50 text-[#F8F1F1] hover:text-[#D4AF37] transition cursor-pointer"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#3E2630]/50 text-[#F8F1F1] hover:text-[#D4AF37] transition cursor-pointer flex items-center space-x-2"
              title="Shopping Bag"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#D4AF37] text-[#3E2630] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-[#F8F1F1]">
                {formatINR(cartTotals.totalAmount)}
              </span>
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-[#3E2630]/50 transition border border-[#D4AF37]/30 text-xs cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#B76E79] text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium text-xs max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-300" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-[#3E2630] border border-[#6F4C57] rounded-xl shadow-2xl py-2 z-50 text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#6F4C57]/60">
                        <p className="font-semibold text-[#F8F1F1] text-sm">{currentUser.name}</p>
                        <p className="text-xs text-[#E8C7CC] truncate">{currentUser.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#D4AF37] text-[#3E2630] font-bold">
                            Store Administrator
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onNavigate('dashboard', { tab: 'profile' })}
                        className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#6F4C57] hover:text-[#D4AF37] transition flex items-center space-x-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={() => onNavigate('dashboard', { tab: 'orders' })}
                        className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#6F4C57] hover:text-[#D4AF37] transition flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Orders & Tracking</span>
                      </button>

                      <button
                        onClick={() => onNavigate('wishlist')}
                        className="w-full text-left px-4 py-2 text-zinc-200 hover:bg-[#6F4C57] hover:text-[#D4AF37] transition flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Saved Wishlist ({wishlistCount})</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-4 py-2 text-[#D4AF37] hover:bg-[#6F4C57] transition flex items-center space-x-2 font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <div className="border-t border-[#6F4C57]/60 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-300 hover:bg-[#6F4C57] hover:text-red-200 transition flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAuthModalView('login')}
                    className="px-3.5 py-1.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium transition cursor-pointer shadow-md flex items-center space-x-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onNavigate('admin')}
                    className="hidden sm:inline-flex text-[11px] text-[#D4AF37] hover:underline"
                    title="Staff & Admin Portal"
                  >
                    Admin Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Menu Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#3E2630]/40 py-2.5 text-xs font-medium tracking-wide">
          <div className="flex items-center space-x-7">
            {navCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  if (cat.collection) {
                    onNavigate('shop', { collection: cat.collection });
                  } else {
                    onNavigate('shop', { category: cat.filter });
                  }
                }}
                className={`transition cursor-pointer relative py-1 ${
                  cat.isSpecial
                    ? 'text-[#D4AF37] font-semibold hover:text-[#FFF9F5]'
                    : 'text-[#F8F1F1] hover:text-[#D4AF37]'
                }`}
              >
                {cat.name}
                {cat.isSpecial && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-5 text-[#E8C7CC] text-xs">
            <button
              onClick={() => onNavigate('hallmark')}
              className="hover:text-[#D4AF37] transition flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>925 Hallmark Guide</span>
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#D4AF37] transition"
            >
              Our Heritage
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#D4AF37] transition"
            >
              Contact Us
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#3E2630] border-t border-[#6F4C57] px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search silver jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#6F4C57]/60 text-white placeholder-zinc-300 text-sm rounded-lg pl-10 pr-4 py-2 border border-[#D4AF37]/40 focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  if (cat.collection) {
                    onNavigate('shop', { collection: cat.collection });
                  } else {
                    onNavigate('shop', { category: cat.filter });
                  }
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2.5 rounded-lg text-xs font-medium border border-[#6F4C57]/50 ${
                  cat.isSpecial
                    ? 'bg-[#6F4C57]/80 text-[#D4AF37] font-semibold'
                    : 'bg-[#6F4C57]/30 text-white hover:bg-[#6F4C57]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="border-t border-[#6F4C57]/60 pt-3 space-y-2 text-xs">
            <button
              onClick={() => { onNavigate('hallmark'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-1.5 text-[#D4AF37]"
            >
              ✨ 92.5 Hallmark & Purity Guide
            </button>
            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-1.5 text-zinc-300"
            >
              About TARAKANCHAN Heritage
            </button>
            <button
              onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-1.5 text-zinc-300"
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-1.5 text-zinc-300"
            >
              Showroom & Concierge Contact
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-1.5 text-[#D4AF37] font-semibold"
            >
              Admin Dashboard Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
