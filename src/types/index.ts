export type ProductCategory = 
  | 'Rings'
  | 'Earrings'
  | 'Necklaces'
  | 'Bracelets'
  | 'Anklets'
  | 'Pendants'
  | 'Chains'
  | 'Gift Sets';

export type CollectionType = 
  | 'All'
  | 'Bridal Collection'
  | 'Everyday Designs'
  | 'Festive Collection'
  | 'New Arrivals'
  | 'Luxury Gifting'
  | 'Diwali Collection'
  | 'Valentines Special';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  collection: CollectionType[];
  originalPrice: number;
  sellingPrice: number;
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  silverPurity: string; // "92.5 Sterling Silver (BIS Hallmarked)"
  weightGrams: number;
  sizes: string[]; // e.g. ["Size 12", "Size 14", "Size 16"] or ["Adjustable", "16 inch", "18 inch"]
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  specifications: {
    metal: string;
    hallmark: string;
    plating: string;
    gemstone?: string;
    claspType?: string;
    dimensions?: string;
    warranty: string;
  };
  features: string[];
}

export interface CartItem {
  id: string; // product id + size
  productId: string;
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
  product: Product;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Dispatched' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryCharges: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: 'Razorpay (Test Mode)' | 'UPI / Card' | 'Cash on Delivery (COD)';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDeliveryDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
}

export interface FilterOptions {
  category?: ProductCategory | 'All';
  collection?: CollectionType | 'All';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStockOnly?: boolean;
  searchQuery?: string;
}

export interface PincodeCheckResult {
  pincode: string;
  isDeliverable: boolean;
  city: string;
  state: string;
  estimatedDays: number;
  deliveryDate: string;
  codAvailable: boolean;
  courierPartner: string;
  expressAvailable: boolean;
}
