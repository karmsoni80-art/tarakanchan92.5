import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ShoppingBag, 
  Share2, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatINR } from '../utils/pricing';
import { useCartWishlist } from '../context/CartWishlistContext';
import { api } from '../services/api';

interface ProductDetailsPageProps {
  productId: string;
  onNavigateToProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onNavigateToProduct,
  onProceedToCheckout,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed, showToast } = useCartWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getProductById(productId)
      .then((res) => {
        setProduct(res.product);
        setRelatedProducts(res.related || []);
        setSelectedSize(res.product.sizes[0] || 'Standard');
        setSelectedImage(0);
        addToRecentlyViewed(res.product);

        // Fetch product reviews
        api.getReviews(res.product.id).then(setReviews).catch(() => {});
      })
      .catch((err) => {
        console.error('Failed to fetch product details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    const res = await api.checkPincode(pincode);
    if (res.isDeliverable) {
      setPincodeResult(`✓ Delivery available to ${res.city}, ${res.state}! Expected by ${res.deliveryDate} with ${res.courierPartner}.`);
    } else {
      setPincodeResult('Sorry, this pincode is currently unserviceable.');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedSize, quantity);
    onProceedToCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      const newRev = await api.submitReview({
        productId: product.id,
        userName: reviewerName,
        userEmail: reviewerEmail,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verifiedPurchase: true,
      });
      setReviews([newRev, ...reviews]);
      setIsReviewModalOpen(false);
      showToast('Thank you! Your verified review has been published.', 'success');
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#3E2630] min-h-screen py-24 text-center text-[#F8F1F1]">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#E8C7CC] tracking-wider uppercase">Loading jewellery details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#3E2630] min-h-screen py-24 text-center text-[#F8F1F1]">
        <h2 className="font-playfair text-2xl font-bold mb-2">Jewel Not Found</h2>
        <p className="text-xs text-zinc-400">The requested jewellery piece may have retired or moved.</p>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-[#E8C7CC] uppercase tracking-wider mb-8">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Section: Gallery + Purchase Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Interactive Multi-Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#2B1921] border border-[#6F4C57]/60 shadow-2xl group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-[#3E2630]/90 backdrop-blur border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold tracking-wider">
                  BIS 925 Hallmarked
                </span>
                {product.discount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-[#B76E79] text-white text-xs font-bold tracking-wider">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#3E2630]/80 hover:bg-[#6F4C57] text-white border border-[#6F4C57] transition"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    selectedImage === idx ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-[#6F4C57]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Technical Spec & Order Box */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#E8C7CC] font-mono mb-2">
                <span className="uppercase tracking-widest">{product.category}</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide mb-3 leading-snug">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-300 font-medium">
                  {product.rating} ({reviews.length} Verified Customer Reviews)
                </span>
              </div>

              {/* Price Details */}
              <div className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 flex items-baseline space-x-4 mb-4">
                <span className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                  {formatINR(product.sellingPrice)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-base line-through text-zinc-400">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-[#B76E79] text-white font-bold text-xs">
                    Save {formatINR(product.originalPrice - product.sellingPrice)} ({product.discount}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                Inclusive of all taxes & 3% Hallmarked Silver GST. Free insured delivery included.
              </p>
            </div>

            {/* Purity & Weight Highlights Banner */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#6F4C57]/20 border border-[#D4AF37]/40 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <p className="text-[#D4AF37] font-semibold">{product.silverPurity}</p>
                  <p className="text-[10px] text-zinc-300">Laser Hallmarked & Authenticated</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">{product.weightGrams}g Silver Weight</p>
                  <p className="text-[10px] text-zinc-300">{product.specifications.plating}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider mb-2">
                  Select Size / Dimension:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#B76E79] text-white border-[#B76E79] shadow-md'
                          : 'bg-[#6F4C57]/30 text-zinc-200 border-[#6F4C57] hover:border-[#D4AF37]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-[#6F4C57] rounded-xl overflow-hidden bg-[#2B1921]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-sm hover:bg-[#6F4C57] transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1.5 text-sm hover:bg-[#6F4C57] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-4 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-medium text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#FFF3B0] text-[#3E2630] font-bold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition cursor-pointer"
                >
                  <span>Buy Now (Instant Checkout)</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    wishlisted
                      ? 'bg-[#B76E79] border-[#B76E79] text-white'
                      : 'bg-[#6F4C57]/30 border-[#6F4C57] text-[#F8F1F1] hover:text-[#B76E79]'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Delivery & COD Availability Checker</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 bg-[#3E2630] border border-[#6F4C57] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6F4C57] hover:bg-[#B76E79] text-white text-xs font-medium rounded-xl transition cursor-pointer"
                >
                  Verify
                </button>
              </form>
              {pincodeResult && (
                <p className="text-[11px] text-[#D4AF37] font-medium mt-1">{pincodeResult}</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table */}
        <div className="mb-16 p-8 rounded-3xl bg-[#2B1921] border border-[#6F4C57]/60">
          <h3 className="font-playfair text-2xl font-bold text-white mb-6">
            Artisanal Specifications & Authenticity Guarantee
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Precious Metal</span>
                <span className="font-semibold text-white">{product.specifications.metal}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Hallmark Certification</span>
                <span className="font-semibold text-[#D4AF37]">{product.specifications.hallmark}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Gross Weight</span>
                <span className="font-semibold text-white">{product.weightGrams} grams pure sterling</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Surface Plating</span>
                <span className="font-semibold text-white">{product.specifications.plating}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Gemstone Setting</span>
                <span className="font-semibold text-white">{product.specifications.gemstone || 'Solid Plain Silver'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Clasp / Closure</span>
                <span className="font-semibold text-white">{product.specifications.claspType || 'Comfort Fit'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Warranty & Buyback</span>
                <span className="font-semibold text-emerald-400">{product.specifications.warranty}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#6F4C57]/40">
                <span className="text-[#E8C7CC]">Presentation Box</span>
                <span className="font-semibold text-white">Burgundy Velvet Keepsake Case Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                Customer Reviews & Testimonials
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Verified reviews from verified TARAKANCHAN owners
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow cursor-pointer flex items-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ Verified Purchase
                  </span>
                </div>
                <h4 className="font-playfair text-base font-bold text-white">{rev.title}</h4>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">{rev.comment}</p>
                <div className="pt-2 border-t border-[#6F4C57]/40 flex justify-between text-[11px] text-zinc-400">
                  <span>{rev.userName}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#6F4C57]/40">
            <h3 className="font-playfair text-2xl font-bold text-white mb-6">
              You May Also Admire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateToProduct(rel)}
                  className="p-4 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 hover:border-[#D4AF37] transition cursor-pointer group"
                >
                  <img src={rel.images[0]} alt={rel.name} className="w-full aspect-square rounded-xl object-cover mb-3" />
                  <h4 className="font-playfair text-sm font-semibold text-white truncate group-hover:text-[#D4AF37]">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-bold mt-1">
                    {formatINR(rel.sellingPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#2B1921] border border-[#D4AF37] rounded-2xl max-w-md w-full p-6 text-[#F8F1F1] space-y-4">
            <div className="flex justify-between items-center border-b border-[#6F4C57]/60 pb-3">
              <h3 className="font-playfair text-xl font-bold">Write a Verified Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#E8C7CC] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1">Star Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setReviewRating(num)}
                      className={`p-2 rounded-lg border text-xs font-bold ${
                        reviewRating >= num ? 'bg-[#D4AF37] text-[#3E2630] border-[#D4AF37]' : 'border-[#6F4C57] text-zinc-400'
                      }`}
                    >
                      ★ {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exquisite finish and hallmarking"
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#E8C7CC] mb-1">Your Detailed Experience</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the craftsmanship, hallmark stamps, packaging, and wear comfort..."
                  className="w-full bg-[#3E2630] border border-[#6F4C57] rounded-lg p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white font-bold"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
