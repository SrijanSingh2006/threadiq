import React from 'react';
import { X, Trash2, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ isOpen, onClose }) => {
  const { compareList, toggleCompare, clearCompare, addToCart } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-fade-in border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Product Attribute Comparison ({compareList.length} / 4)
            </h2>
            <p className="text-xs text-slate-500">
              Side-by-side spec evaluation for merchandising quality and discovery validation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="text-xs text-rose-600 hover:underline font-medium px-2 py-1"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="grid grid-cols-5 gap-4 min-w-[750px] text-xs">
            {/* Spec Column */}
            <div className="space-y-4 font-semibold text-slate-400 pt-36">
              <div className="py-2 border-b border-slate-100">Brand & Tier</div>
              <div className="py-2 border-b border-slate-100">Price & Discount</div>
              <div className="py-2 border-b border-slate-100">Customer Rating</div>
              <div className="py-2 border-b border-slate-100">Available Sizes</div>
              <div className="py-2 border-b border-slate-100">Catalogue Score</div>
              <div className="py-2 border-b border-slate-100">Return Window</div>
            </div>

            {/* Product Columns */}
            {compareList.map((prod) => {
              const sizes = JSON.parse(prod.available_sizes_json || '[]');
              return (
                <div key={prod.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col">
                  {/* Hero & Title */}
                  <div className="relative mb-2">
                    <img
                      src={prod.hero_image}
                      alt={prod.name}
                      className="w-full h-36 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate mb-1">{prod.name}</h4>

                  {/* Attributes */}
                  <div className="space-y-4 pt-4 text-slate-700">
                    <div className="py-2 border-b border-slate-200/60 font-medium">
                      {prod.brand?.name || 'Brand'} ({prod.brand?.tier || 'Mid-Range'})
                    </div>
                    <div className="py-2 border-b border-slate-200/60 font-bold text-slate-900">
                      ₹{prod.price.toLocaleString()}
                      {prod.discount_percent > 0 && (
                        <span className="text-fashion-accent text-[11px] ml-1">
                          ({prod.discount_percent}% OFF)
                        </span>
                      )}
                    </div>
                    <div className="py-2 border-b border-slate-200/60">
                      ⭐ {prod.rating} ({prod.review_count} reviews)
                    </div>
                    <div className="py-2 border-b border-slate-200/60 truncate">
                      {sizes.join(', ')}
                    </div>
                    <div className="py-2 border-b border-slate-200/60 font-semibold text-emerald-700">
                      {prod.catalogue_completeness}% Complete
                    </div>
                    <div className="py-2 border-b border-slate-200/60 text-slate-500">
                      {prod.return_policy}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(prod, sizes[0] || 'M');
                      onClose();
                    }}
                    className="w-full mt-4 py-1.5 bg-fashion-accent hover:bg-fashion-accentHover text-white rounded-lg font-semibold text-[11px] shadow transition-colors"
                  >
                    Add Size {sizes[0] || 'M'} to Bag
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
