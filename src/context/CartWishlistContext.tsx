import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon, WishlistItem } from '../types';
import { calculateCartTotals, CartCalculationResult } from '../utils/pricing';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartWishlistContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotals: CartCalculationResult;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Product Comparison
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;

  // Toast feedback
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

const CART_STORAGE = 'tk_cart_items';
const WISHLIST_STORAGE = 'tk_wishlist_ids';
const RECENT_STORAGE = 'tk_recently_viewed';

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const sessionKey = currentUser?.id || 'guest';

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE);
      return saved ? JSON.parse(saved) : ['prod-neck-01', 'prod-brac-01'];
    } catch {
      return ['prod-neck-01', 'prod-brac-01'];
    }
  });
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Product Comparison (max 4)
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Recently Viewed (max 8)
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE, JSON.stringify(cart));
    api.saveCart(sessionKey, cart).catch(() => {});
  }, [cart, sessionKey]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Fetch full products for wishlist
  useEffect(() => {
    api.getProducts().then((res) => {
      const filtered = res.products.filter((p) => wishlistIds.includes(p.id));
      setWishlistProducts(filtered);
    }).catch(() => {});
  }, [wishlistIds]);

  // Sync recently viewed
  useEffect(() => {
    localStorage.setItem(RECENT_STORAGE, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product: Product, size?: string, quantity: number = 1) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const itemId = `${product.id}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            productId: product.id,
            product,
            selectedSize: chosenSize,
            quantity,
          },
        ];
      }
    });

    showToast(`Added ${product.name} (${chosenSize}) to cart!`, 'success');
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotals = calculateCartTotals(cart, appliedCoupon);

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const coupon = await api.validateCoupon(code, cartTotals.subtotal);
      setAppliedCoupon(coupon);
      showToast(`Coupon ${coupon.code} applied successfully!`, 'success');
      return true;
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      showToast(err.message || 'Invalid coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    const exists = wishlistIds.includes(product.id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      setWishlistProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Removed from your wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      setWishlistProducts((prev) => [product, ...prev]);
      showToast(`Saved ${product.name} to your wishlist ❤️`, 'success');
    }
    api.toggleWishlist(sessionKey, product.id).catch(() => {});
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  // Comparison actions
  const toggleCompare = (product: Product) => {
    const exists = compareList.some((p) => p.id === product.id);
    if (exists) {
      setCompareList((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Removed from comparison`, 'info');
    } else {
      if (compareList.length >= 4) {
        showToast('You can compare up to 4 jewellery pieces at a time.', 'error');
        return;
      }
      setCompareList((prev) => [...prev, product]);
      showToast(`Added ${product.name} to comparison`, 'success');
      setIsCompareModalOpen(true);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Recently Viewed actions
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistIds.length;

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        cartCount,
        cartTotals,
        appliedCoupon,
        couponError,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlistIds,
        wishlistProducts,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        recentlyViewed,
        addToRecentlyViewed,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  return context;
};
