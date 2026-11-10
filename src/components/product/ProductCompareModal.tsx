import React from 'react';
import { X, ShoppingBag, Trash2, Check, ShieldCheck } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { formatINR } from '../../utils/pricing';

export const ProductCompareModal: React.FC = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen,
    addToCart 
  } = useCartWishlist();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#3E2630] border border-[#D4AF37]/50 rounded-2xl max-w-5xl w-full text-[#F8F1F1] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#6F4C57]/60 pb-4 mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#F8F1F1]">
              Jewellery Comparison Table
            </h2>
            <p className="text-xs text-zinc-300 font-light mt-0.5">
              Compare 92.5 sterling silver specifications, weights, and finishes side-by-side.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-red-300 hover:text-red-200 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 rounded-full bg-[#6F4C57]/60 hover:bg-[#6F4C57] text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm space-y-3">
            <p>No jewellery items added to compare yet.</p>
            <p className="text-xs text-zinc-500">
              Click the balance scale icon on any product card to compare up to 4 items.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#6F4C57]/60">
                  <th className="p-3 text-zinc-400 font-medium w-36">Product</th>
                  {compareList.map((p) => (
                    <th key={p.id} className="p-3 w-64 min-w-[200px]">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-black/30 mb-2 border border-[#6F4C57]/40">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-playfair text-sm font-bold text-white line-clamp-1">{p.name}</p>
                      <p className="text-[11px] text-[#D4AF37] font-semibold mt-1">{formatINR(p.sellingPrice)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6F4C57]/40 text-zinc-200">
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Category</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Silver Purity</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className="inline-flex items-center text-[#D4AF37] font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        {p.silverPurity}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Gross Weight</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 font-bold">{p.weightGrams} grams</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Plating & Finish</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3">{p.specifications.plating}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Gemstones</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3">{p.specifications.gemstone || 'Solid Silver (None)'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Warranty</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 text-emerald-400">{p.specifications.warranty}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#E8C7CC]">Action</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3">
                      <button
                        onClick={() => {
                          addToCart(p, p.sizes[0], 1);
                          setIsCompareModalOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium flex items-center justify-center space-x-1.5 shadow transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
