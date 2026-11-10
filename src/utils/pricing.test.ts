import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  calculateDiscountPercent,
  calculateCartTotals,
  validateCoupon,
  estimateDelivery,
  isCertifiedSterlingSilver,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from './pricing';
import { CartItem, Coupon, Product } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Royal Kundan 92.5 Silver Ring',
  sku: 'TK-RNG-001',
  category: 'Rings',
  collection: ['Bridal Collection'],
  originalPrice: 4999,
  sellingPrice: 3499,
  discount: 30,
  rating: 4.9,
  reviewCount: 38,
  images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e'],
  description: 'Pure 92.5 sterling silver ring with artisanal craftsmanship.',
  silverPurity: '92.5 Sterling Silver (BIS Hallmarked)',
  weightGrams: 6.8,
  sizes: ['Size 12', 'Size 14', 'Size 16'],
  inStock: true,
  stockCount: 15,
  specifications: {
    metal: '92.5 Sterling Silver',
    hallmark: 'BIS 925 Laser Stamped',
    plating: 'Rhodium Anti-Tarnish',
    warranty: 'Lifetime Authenticity Certificate',
  },
  features: ['BIS Certified', 'Hypoallergenic'],
};

test('formatINR formats currency properly in Indian numbering', () => {
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(3499), '₹3,499');
  assert.equal(formatINR(125000), '₹1,25,000');
});

test('calculateDiscountPercent calculates round discount correctly', () => {
  assert.equal(calculateDiscountPercent(5000, 3500), 30);
  assert.equal(calculateDiscountPercent(1000, 1000), 0);
  assert.equal(calculateDiscountPercent(0, 0), 0);
});

test('calculateCartTotals calculates subtotal, free delivery, GST, and totals without coupon', () => {
  const items: CartItem[] = [
    {
      id: 'prod-1-14',
      productId: 'prod-1',
      product: mockProduct, // 3499
      selectedSize: 'Size 14',
      quantity: 1,
    },
  ];

  const result = calculateCartTotals(items, null);
  assert.equal(result.subtotal, 3499);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.isFreeDeliveryEligible, true); // > 1999
  assert.equal(result.deliveryCharges, 0);
  assert.equal(result.taxAmount, Math.round(3499 * 0.03)); // 105
  assert.equal(result.totalAmount, 3499 + Math.round(3499 * 0.03));
});

test('calculateCartTotals applies standard shipping fee when under threshold', () => {
  const cheapProduct: Product = {
    ...mockProduct,
    sellingPrice: 899,
  };
  const items: CartItem[] = [
    {
      id: 'cheap-1',
      productId: 'prod-1',
      product: cheapProduct,
      selectedSize: 'Adjustable',
      quantity: 1,
    },
  ];

  const result = calculateCartTotals(items, null);
  assert.equal(result.subtotal, 899);
  assert.equal(result.isFreeDeliveryEligible, false);
  assert.equal(result.deliveryCharges, STANDARD_SHIPPING_FEE);
  assert.equal(result.freeDeliveryDifference, FREE_SHIPPING_THRESHOLD - 899);
});

test('validateCoupon correctly validates valid and invalid promo codes', () => {
  const coupons: Coupon[] = [
    {
      code: 'TARA10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      maxDiscount: 1000,
      description: '10% off above ₹2,000',
      isActive: true,
    },
    {
      code: 'EXPIRED20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 500,
      description: 'Expired code',
      isActive: false,
    },
  ];

  // Test success
  const validRes = validateCoupon('tara10', 3000, coupons);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.coupon?.code, 'TARA10');

  // Test minimum order not met
  const underMinRes = validateCoupon('TARA10', 1500, coupons);
  assert.equal(underMinRes.valid, false);

  // Test inactive coupon
  const inactiveRes = validateCoupon('EXPIRED20', 3000, coupons);
  assert.equal(inactiveRes.valid, false);

  // Test random non-existent code
  const invalidRes = validateCoupon('RANDOM99', 5000, coupons);
  assert.equal(invalidRes.valid, false);
});

test('estimateDelivery validates 6-digit Indian PIN codes', () => {
  const validDelhi = estimateDelivery('110001');
  assert.equal(validDelhi.isDeliverable, true);
  assert.equal(validDelhi.city, 'New Delhi');
  assert.equal(validDelhi.codAvailable, true);

  const validMumbai = estimateDelivery('400001');
  assert.equal(validMumbai.isDeliverable, true);
  assert.equal(validMumbai.city, 'Mumbai / Pune');

  const invalid = estimateDelivery('123');
  assert.equal(invalid.isDeliverable, false);
});

test('isCertifiedSterlingSilver correctly checks 925 hallmark', () => {
  assert.equal(isCertifiedSterlingSilver('92.5 Sterling Silver (BIS Hallmarked)'), true);
  assert.equal(isCertifiedSterlingSilver('925 Pure Silver'), true);
  assert.equal(isCertifiedSterlingSilver('Gold plated copper'), false);
});
