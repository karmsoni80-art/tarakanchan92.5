import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroCarousel } from './components/home/HeroCarousel';
import { TrustBenefitsSection } from './components/home/TrustBenefitsSection';
import { ShopByCategories } from './components/home/ShopByCategories';
import { ProductCard } from './components/product/ProductCard';
import { QuickViewModal } from './components/product/QuickViewModal';
import { ProductCompareModal } from './components/product/ProductCompareModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { FestivePromotions } from './components/home/FestivePromotions';
import { HallmarkSection } from './components/home/HallmarkSection';
import { CompleteTheLook } from './components/home/CompleteTheLook';
import { CustomerTestimonials } from './components/home/CustomerTestimonials';
import { InstagramGallery } from './components/home/InstagramGallery';
import { NewsletterSection } from './components/home/NewsletterSection';
import { AuthModal } from './components/auth/AuthModal';

import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutUsPage } from './pages/AboutUsPage';
import { HallmarkGuidePage } from './pages/HallmarkGuidePage';
import { FAQPage } from './pages/FAQPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PolicyPage } from './pages/PolicyPage';

import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider, useCartWishlist } from './context/CartWishlistContext';
import { Product, Order } from './types';
import { api } from './services/api';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [shopFilterCategory, setShopFilterCategory] = useState<string>('All');
  const [shopFilterCollection, setShopFilterCollection] = useState<string>('All');
  const [shopSearchQuery, setShopSearchQuery] = useState<string>('');
  const [dashboardTab, setDashboardTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>('orders');

  // Featured and Best Seller products for Home Page
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const {
    quickViewProduct,
    setQuickViewProduct,
    toastMessage,
    setIsCartDrawerOpen,
  } = useCartWishlist();

  useEffect(() => {
    api.getProducts()
      .then((res) => {
        setAllProducts(res.products || []);
      })
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  const navigateTo = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);

    if (view === 'shop') {
      if (params?.category) {
        setShopFilterCategory(params.category);
        setShopFilterCollection('All');
      } else if (params?.collection) {
        setShopFilterCollection(params.collection);
        setShopFilterCategory('All');
      } else {
        setShopFilterCategory('All');
        setShopFilterCollection('All');
      }
      if (params?.search) {
        setShopSearchQuery(params.search);
      }
    } else if (view === 'product' && params?.id) {
      setSelectedProductId(params.id);
    } else if (view === 'dashboard' && params?.tab) {
      setDashboardTab(params.tab);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    navigateTo('product', { id: product.id });
  };

  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival || p.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#3E2630] text-[#F8F1F1] flex flex-col justify-between selection:bg-[#B76E79] selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-medium flex items-center space-x-2.5 border backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500/50'
                : toastMessage.type === 'info'
                ? 'bg-[#3E2630]/90 text-white border-[#D4AF37]/50'
                : 'bg-[#2B1921]/95 text-white border-[#D4AF37] ring-1 ring-[#D4AF37]/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div>
        <AnnouncementBar onOpenContact={() => navigateTo('contact')} />
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          onSearch={(query) => navigateTo('shop', { search: query })}
        />
      </div>

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div>
            {/* 6-Slide Hero Carousel */}
            <HeroCarousel onNavigate={navigateTo} />

            {/* Trust and Benefits Guarantee Bar */}
            <TrustBenefitsSection />

            {/* Shop by 8 Categories */}
            <ShopByCategories
              onSelectCategory={(cat) => navigateTo('shop', { category: cat })}
            />

            {/* Best Sellers Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
                  <div>
                    <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Iconic Treasures</span>
                    </div>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide">
                      Our Bestselling Silver Creations
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('shop', { collection: 'All' })}
                    className="mt-3 sm:mt-0 text-xs font-medium text-[#D4AF37] hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>View All Best Sellers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestSellers.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={handleSelectProduct}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Complete the Look (Curated Maharani Bridal Ensemble) */}
            <CompleteTheLook products={allProducts} />

            {/* New Arrivals & Trending Creations */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#3E2630]/70">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
                  <div>
                    <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Atelier Fresh</span>
                    </div>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide">
                      New Arrivals & Trending Jewellery
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('shop', { collection: 'New Arrivals' })}
                    className="mt-3 sm:mt-0 text-xs font-medium text-[#D4AF37] hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Explore New Arrivals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {newArrivals.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={handleSelectProduct}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Festive Promotional Editions (Diwali, Bridal, Valentine's) */}
            <FestivePromotions onNavigate={navigateTo} />

            {/* 92.5 Hallmark Information & Why Choose TARAKANCHAN */}
            <HallmarkSection />

            {/* Customer Testimonials & Verified Reviews */}
            <CustomerTestimonials />

            {/* Instagram Social Gallery */}
            <InstagramGallery />

            {/* Newsletter Subscription (with instant ₹500 discount coupon) */}
            <NewsletterSection />
          </div>
        )}

        {/* VIEW 2: SHOP CATALOGUE */}
        {currentView === 'shop' && (
          <ShopPage
            initialCategory={shopFilterCategory}
            initialCollection={shopFilterCollection}
            initialSearch={shopSearchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* VIEW 3: PRODUCT DETAILS */}
        {currentView === 'product' && (
          <ProductDetailsPage
            productId={selectedProductId}
            onNavigateToProduct={handleSelectProduct}
            onProceedToCheckout={() => navigateTo('checkout')}
          />
        )}

        {/* VIEW 4: WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}

        {/* VIEW 5: CHECKOUT & RAZORPAY TEST GATEWAY */}
        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={(order: Order) => navigateTo('dashboard', { tab: 'orders' })}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}

        {/* VIEW 6: CUSTOMER DASHBOARD */}
        {currentView === 'dashboard' && (
          <CustomerDashboard
            initialTab={dashboardTab}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard />
        )}

        {/* VIEW 8: ABOUT US */}
        {currentView === 'about' && (
          <AboutUsPage />
        )}

        {/* VIEW 9: HALLMARK GUIDE */}
        {currentView === 'hallmark' && (
          <HallmarkGuidePage />
        )}

        {/* VIEW 10: FAQ */}
        {currentView === 'faq' && (
          <FAQPage />
        )}

        {/* VIEW 11: CONTACT US */}
        {currentView === 'contact' && (
          <ContactUsPage />
        )}

        {/* VIEW 12: POLICIES */}
        {(currentView === 'returns' || currentView === 'privacy' || currentView === 'terms') && (
          <PolicyPage type={currentView as any} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleSelectProduct}
      />
      <ProductCompareModal />
      <CartDrawer onProceedToCheckout={() => navigateTo('checkout')} />
      <AuthModal />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        <AppContent />
      </CartWishlistProvider>
    </AuthProvider>
  );
}
