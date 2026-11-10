import { Product, CategoryInfo, Coupon, Order, User, Review, StoreSettings, FilterOptions, PincodeCheckResult } from '../types';

export const api = {
  // Products
  async getProducts(filters: FilterOptions = {}): Promise<{ count: number; products: Product[] }> {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.collection && filters.collection !== 'All') params.append('collection', filters.collection);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.minRating !== undefined) params.append('rating', String(filters.minRating));
    if (filters.sortBy) params.append('sort', filters.sortBy);
    if (filters.searchQuery) params.append('search', filters.searchQuery);
    if (filters.inStockOnly) params.append('inStock', 'true');

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    return { count: data.count || 0, products: data.products || [] };
  },

  async getProductById(id: string): Promise<{ product: Product; related: Product[] }> {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Product not found');
    return { product: data.product, related: data.related || [] };
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Categories
  async getCategories(): Promise<CategoryInfo[]> {
    const res = await fetch('/api/categories');
    const data = await res.json();
    return data.categories || [];
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    return data.coupons || [];
  },

  async validateCoupon(code: string, subtotal: number): Promise<Coupon> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Invalid coupon');
    return data.coupon;
  },

  async saveCoupon(coupon: Coupon): Promise<Coupon> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    const data = await res.json();
    return data.coupon;
  },

  // Cart & Wishlist persistence
  async getCart(sessionKey: string): Promise<any[]> {
    const res = await fetch(`/api/cart?sessionKey=${encodeURIComponent(sessionKey)}`);
    const data = await res.json();
    return data.items || [];
  },

  async saveCart(sessionKey: string, items: any[]): Promise<any[]> {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey, items }),
    });
    const data = await res.json();
    return data.items || [];
  },

  async getWishlist(sessionKey: string): Promise<{ wishlist: string[]; products: Product[] }> {
    const res = await fetch(`/api/wishlist?sessionKey=${encodeURIComponent(sessionKey)}`);
    const data = await res.json();
    return { wishlist: data.wishlist || [], products: data.products || [] };
  },

  async toggleWishlist(sessionKey: string, productId: string): Promise<{ wishlist: string[]; isWishlisted: boolean }> {
    const res = await fetch('/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey, productId }),
    });
    const data = await res.json();
    return { wishlist: data.wishlist || [], isWishlisted: data.isWishlisted };
  },

  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!resData.success) throw new Error(resData.error || 'Registration failed');
    return { user: resData.user, token: resData.token };
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!resData.success) throw new Error(resData.error || 'Login failed');
    return { user: resData.user, token: resData.token };
  },

  async forgotPassword(email: string): Promise<{ message: string; demoOtp: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  async verifyOtp(otp: string): Promise<boolean> {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return true;
  },

  async resetPassword(email: string, newPassword: string): Promise<string> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.message;
  },

  // Razorpay Checkout & Orders
  async createRazorpayOrder(amount: number, receipt?: string) {
    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data;
  },

  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.order;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId || '')}`);
    const data = await res.json();
    return data.orders || [];
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Order not found');
    return data.order;
  },

  // Pincode
  async checkPincode(pincode: string): Promise<PincodeCheckResult> {
    const res = await fetch(`/api/pincode/${encodeURIComponent(pincode)}`);
    const data = await res.json();
    return data.result;
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId || '')}`);
    const data = await res.json();
    return data.reviews || [];
  },

  async submitReview(review: Partial<Review>): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.review;
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; discountCode: string; message: string }> {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data.stats;
  },

  async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.order;
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.settings;
  },
};
