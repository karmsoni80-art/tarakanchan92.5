import { CartItem, Coupon, PincodeCheckResult } from '../types';

/**
 * Format currency to Indian Rupees (INR)
 * e.g., 4500 -> "₹4,500"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(originalPrice: number, sellingPrice: number): number {
  if (originalPrice <= 0 || sellingPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}

/**
 * Free shipping threshold: ₹1,999
 * Standard shipping fee: ₹150
 * Silver Jewellery GST: 3% (inclusive or added as per tax regime)
 */
export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING_FEE = 150;
export const SILVER_JEWELLERY_GST_RATE = 0.03; // 3%

export interface CartCalculationResult {
  subtotal: number;
  discountAmount: number;
  deliveryCharges: number;
  taxAmount: number;
  totalAmount: number;
  isFreeDeliveryEligible: boolean;
  freeDeliveryDifference: number;
}

export function calculateCartTotals(
  items: CartItem[],
  appliedCoupon: Coupon | null = null
): CartCalculationResult {
  const subtotal = items.reduce((acc, item) => {
    return acc + (item.product.sellingPrice * item.quantity);
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    if (subtotal >= appliedCoupon.minOrderAmount) {
      if (appliedCoupon.discountType === 'percentage') {
        const calculatedDiscount = (subtotal * appliedCoupon.discountValue) / 100;
        discountAmount = appliedCoupon.maxDiscount 
          ? Math.min(calculatedDiscount, appliedCoupon.maxDiscount)
          : calculatedDiscount;
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
    }
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  const discountedSubtotal = subtotal - discountAmount;

  // Delivery charges calculation
  const isFreeDeliveryEligible = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const deliveryCharges = subtotal === 0 ? 0 : (isFreeDeliveryEligible ? 0 : STANDARD_SHIPPING_FEE);
  const freeDeliveryDifference = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // 3% GST on discounted items
  const taxAmount = Math.round(discountedSubtotal * SILVER_JEWELLERY_GST_RATE);

  const totalAmount = Math.max(0, discountedSubtotal + deliveryCharges + taxAmount);

  return {
    subtotal,
    discountAmount: Math.round(discountAmount),
    deliveryCharges,
    taxAmount,
    totalAmount,
    isFreeDeliveryEligible,
    freeDeliveryDifference,
  };
}

/**
 * Coupon validation helper
 */
export function validateCoupon(
  code: string,
  subtotal: number,
  availableCoupons: Coupon[]
): { valid: boolean; coupon?: Coupon; error?: string } {
  const normalized = code.trim().toUpperCase();
  const coupon = availableCoupons.find((c) => c.code.toUpperCase() === normalized && c.isActive);

  if (!coupon) {
    return { valid: false, error: 'Invalid or expired coupon code. Try TARA10 or FIRST925.' };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      coupon,
      error: `Minimum order value of ${formatINR(coupon.minOrderAmount)} required to use this coupon.`,
    };
  }

  return { valid: true, coupon };
}

/**
 * Pincode Delivery Estimator for Indian pin codes (6 digits)
 */
export function estimateDelivery(pincode: string): PincodeCheckResult {
  const cleanPin = pincode.replace(/\D/g, '');

  if (cleanPin.length !== 6) {
    return {
      pincode,
      isDeliverable: false,
      city: '',
      state: '',
      estimatedDays: 0,
      deliveryDate: '',
      codAvailable: false,
      courierPartner: '',
      expressAvailable: false,
    };
  }

  const prefix = cleanPin.slice(0, 2);
  let city = 'Metro Region';
  let state = 'India';
  let estimatedDays = 3;

  // Major pin code zone heuristics
  switch (prefix) {
    case '11':
      city = 'New Delhi';
      state = 'Delhi';
      estimatedDays = 2;
      break;
    case '40':
    case '41':
      city = 'Mumbai / Pune';
      state = 'Maharashtra';
      estimatedDays = 2;
      break;
    case '56':
      city = 'Bengaluru';
      state = 'Karnataka';
      estimatedDays = 2;
      break;
    case '60':
      city = 'Chennai';
      state = 'Tamil Nadu';
      estimatedDays = 3;
      break;
    case '70':
      city = 'Kolkata';
      state = 'West Bengal';
      estimatedDays = 3;
      break;
    case '30':
    case '31':
      city = 'Jaipur';
      state = 'Rajasthan';
      estimatedDays = 2;
      break;
    case '50':
      city = 'Hyderabad';
      state = 'Telangana';
      estimatedDays = 2;
      break;
    case '38':
      city = 'Ahmedabad';
      state = 'Gujarat';
      estimatedDays = 2;
      break;
    default:
      city = 'Domestic Hub';
      state = 'All-India Express';
      estimatedDays = 4;
      break;
  }

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + estimatedDays);
  const deliveryDate = targetDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return {
    pincode: cleanPin,
    isDeliverable: true,
    city,
    state,
    estimatedDays,
    deliveryDate,
    codAvailable: true,
    courierPartner: 'BlueDart Luxury Secure Express',
    expressAvailable: true,
  };
}

/**
 * Checks 92.5 hallmark validity string
 */
export function isCertifiedSterlingSilver(silverPurity: string): boolean {
  return /92\.5|925|sterling/i.test(silverPurity);
}
