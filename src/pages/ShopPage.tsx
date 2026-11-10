import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Star, Sparkles, Check } from 'lucide-react';
import { Product, ProductCategory, CollectionType, FilterOptions } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import { formatINR } from '../utils/pricing';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ShopPageProps {
  initialCategory?: string;
  initialCollection?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'All',
  initialCollection = 'All',
  initialSearch = '',
  onSelectProduct,
}) => {
  const { recentlyViewed } = useCartWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialCollection) setSelectedCollection(initialCollection);
  }, [initialCollection]);

  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters: FilterOptions = {
        category: selectedCategory as any,
        collection: selectedCollection as any,
        maxPrice: priceRange,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy,
        inStockOnly,
        searchQuery: searchQuery.trim() || undefined,
      };
      const res = await api.getProducts(filters);
      setProducts(res.products);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCollection, priceRange, minRating, sortBy, inStockOnly, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setPriceRange(20000);
    setMinRating(0);
    setSortBy('featured');
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Paginated slice
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Anklets',
    'Pendants',
    'Chains',
    'Gift Sets',
  ];

  const collections: (CollectionType | 'All')[] = [
    'All',
    'Bridal Collection',
    'Everyday Designs',
    'Festive Collection',
    'New Arrivals',
    'Luxury Gifting',
  ];

  return (
    <div className="bg-[#3E2630] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#F8F1F1]">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <p className="text-xs text-[#E8C7CC] uppercase tracking-wider mb-2">
            Home / Catalogue / {selectedCategory !== 'All' ? selectedCategory : 'All Jewellery'}
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide">
                {selectedCategory !== 'All' ? `92.5 Sterling Silver ${selectedCategory}` : 'Pure 92.5 Sterling Silver Collection'}
              </h1>
              <p className="text-xs text-zinc-300 font-light mt-1">
                Showing {products.length} certified hallmarked creations
              </p>
            </div>

            {/* Mobile Filter Button & Desktop Sort Dropdown */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 rounded-xl bg-[#6F4C57]/40 border border-[#6F4C57] text-xs font-medium flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-2 bg-[#6F4C57]/30 border border-[#6F4C57] rounded-xl px-3 py-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-zinc-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#3E2630]">Featured</option>
                  <option value="price-low" className="bg-[#3E2630]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#3E2630]">Price: High to Low</option>
                  <option value="rating" className="bg-[#3E2630]">Highest Rated</option>
                  <option value="newest" className="bg-[#3E2630]">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search query tag if present */}
        {searchQuery && (
          <div className="mb-6 p-3 rounded-xl bg-[#6F4C57]/30 border border-[#D4AF37]/40 flex items-center justify-between text-xs">
            <span>
              Search results for: <strong className="text-[#D4AF37]">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white flex items-center space-x-1"
            >
              <span>Clear Search</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="p-6 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60 space-y-6 shadow-xl sticky top-28">
              <div className="flex items-center justify-between border-b border-[#6F4C57]/40 pb-3">
                <div className="flex items-center space-x-2 font-playfair font-bold text-base text-white">
                  <Filter className="w-4 h-4 text-[#D4AF37]" />
                  <span>Refine Jewels</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#B76E79] text-white font-medium'
                          : 'text-zinc-300 hover:bg-[#6F4C57]/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections */}
              <div>
                <h4 className="text-xs font-semibold text-[#E8C7CC] uppercase tracking-wider mb-2.5">
                  Curated Collection
                </h4>
                <div className="space-y-1.5">
                  {collections.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedCollection(col)}
                      className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                        selectedCollection === col
                          ? 'bg-[#D4AF37] text-[#3E2630] font-bold'
                          : 'text-zinc-300 hover:bg-[#6F4C57]/30'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-[#E8C7CC] uppercase tracking-wider">
                    Max Price
                  </span>
                  <span className="font-bold text-[#D4AF37]">{formatINR(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                  <span>₹1,000</span>
                  <span>₹25,000+</span>
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-[#6F4C57]/40">
                <label className="flex items-center space-x-2 text-xs text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded accent-[#B76E79] w-4 h-4 cursor-pointer"
                  />
                  <span>Show In-Stock Pieces Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-[#E8C7CC] tracking-wider uppercase">
                  Curating certified silver creations...
                </p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="py-20 text-center p-8 rounded-2xl bg-[#2B1921] border border-[#6F4C57]/60">
                <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  No matching jewellery found
                </h3>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto mb-6">
                  Try adjusting your price range, selecting another category, or resetting all filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 rounded-lg bg-[#6F4C57]/30 border border-[#6F4C57] text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6F4C57]"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition cursor-pointer ${
                          currentPage === i + 1
                            ? 'bg-[#B76E79] text-white font-bold'
                            : 'bg-[#6F4C57]/30 text-zinc-300 hover:bg-[#6F4C57]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 rounded-lg bg-[#6F4C57]/30 border border-[#6F4C57] text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6F4C57]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Products Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#6F4C57]/40">
            <h3 className="font-playfair text-2xl font-bold text-white mb-6">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="p-3 rounded-xl bg-[#2B1921] border border-[#6F4C57]/40 hover:border-[#D4AF37] cursor-pointer transition group"
                >
                  <img src={p.images[0]} alt={p.name} className="w-full aspect-square rounded-lg object-cover mb-2" />
                  <h4 className="font-playfair text-xs font-semibold text-white truncate group-hover:text-[#D4AF37]">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#D4AF37] font-bold mt-1">
                    {formatINR(p.sellingPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
          <div className="w-4/5 max-w-sm bg-[#2B1921] h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#6F4C57] pb-3">
              <span className="font-playfair font-bold text-base text-white">Filter Jewels</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-zinc-300" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#D4AF37] uppercase mb-2">Category</h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setMobileFilterOpen(false); }}
                    className={`block w-full text-left px-3 py-1.5 rounded text-xs ${
                      selectedCategory === cat ? 'bg-[#B76E79] text-white' : 'text-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#D4AF37] uppercase mb-2">Curated Collection</h4>
              <div className="space-y-1">
                {collections.map((col) => (
                  <button
                    key={col}
                    onClick={() => { setSelectedCollection(col); setMobileFilterOpen(false); }}
                    className={`block w-full text-left px-3 py-1.5 rounded text-xs ${
                      selectedCollection === col ? 'bg-[#D4AF37] text-[#3E2630] font-bold' : 'text-zinc-300'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#B76E79] text-white text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
