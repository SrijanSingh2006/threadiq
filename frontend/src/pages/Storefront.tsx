import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Scale,
  Search,
  Filter,
  Star,
  Sparkles,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Info,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { useStore } from '../store/useStore';
import { Modal } from '../components/common/Modal';

export const Storefront: React.FC = () => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    trackInteraction,
    addToast
  } = useStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  // PDP Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Order Tracking modal state
  const [trackOrderModal, setTrackOrderModal] = useState(false);
  const [searchOrderNum, setSearchOrderNum] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);

  // Return / Exchange modal state
  const [returnModal, setReturnModal] = useState(false);
  const [returnOrderItemId, setReturnOrderItemId] = useState<number | null>(null);
  const [returnReason, setReturnReason] = useState('Size too small across chest/shoulders');
  const [exchangeModal, setExchangeModal] = useState(false);
  const [exchangeTargetSize, setExchangeTargetSize] = useState('L');

  const loadStoreData = async () => {
    setIsLoading(true);
    try {
      const [cats, brs, prods] = await Promise.all([
        api.storefront.getCategories(),
        api.storefront.getBrands(),
        api.storefront.getProducts({
          category_id: selectedCategory || undefined,
          brand_id: selectedBrand || undefined,
          search: searchQuery || undefined,
          sort_by: sortBy,
          limit: 48
        })
      ]);
      setCategories(cats);
      setBrands(brs);
      setProducts(prods);

      trackInteraction('homepage_viewed', {
        properties: { products_count: prods.length }
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error loading storefront',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, [selectedCategory, selectedBrand, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackInteraction('search_submitted', { query: searchQuery });
    loadStoreData();
  };

  const handleOpenPDP = (product: any) => {
    setSelectedProduct(product);
    const sizes = JSON.parse(product.available_sizes_json || '["M"]');
    setSelectedSize(sizes[0] || 'M');

    trackInteraction('product_viewed', {
      productId: product.id,
      category: product.category?.name,
      properties: { price: product.price, sku: product.sku }
    });
  };

  const handleTrackOrderSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNum.trim()) return;
    try {
      const order = await api.storefront.trackOrder(searchOrderNum.trim());
      setTrackedOrder(order);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Order Not Found',
        message: `No order record matching "${searchOrderNum}". Try demo order: ORD-2026-100001`
      });
    }
  };

  const handleSubmitReturn = async () => {
    if (!trackedOrder || !returnOrderItemId) return;
    try {
      await api.storefront.requestReturn({
        order_id: trackedOrder.id,
        order_item_id: returnOrderItemId,
        return_reason: returnReason,
        product_condition: 'Tags Attached / Unused',
        refund_amount: trackedOrder.final_amount,
        resolution_notes: 'Reverse pickup initiated via simulated logistics partner.'
      });

      trackInteraction('return_requested', {
        properties: { order_number: trackedOrder.order_number, reason: returnReason }
      });

      setReturnModal(false);
      addToast({
        type: 'success',
        title: 'Return Pickup Scheduled',
        message: 'Your simulated reverse pickup is scheduled. Refund initiated.'
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Return request failed', message: err.message });
    }
  };

  const handleSubmitExchange = async () => {
    if (!trackedOrder || !returnOrderItemId) return;
    try {
      await api.storefront.requestExchange({
        order_id: trackedOrder.id,
        order_item_id: returnOrderItemId,
        requested_size: exchangeTargetSize,
        exchange_reason: 'Size adjustment',
        resolution_notes: '1-Click Doorstep replacement dispatched.'
      });

      trackInteraction('exchange_requested', {
        properties: { order_number: trackedOrder.order_number, new_size: exchangeTargetSize }
      });

      setExchangeModal(false);
      addToast({
        type: 'success',
        title: 'Exchange Replacement Dispatched',
        message: `Size ${exchangeTargetSize} booked for 1-click doorstep swap.`
      });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Exchange request failed', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero & Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-fashion-charcoal via-slate-900 to-fashion-charcoal text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-fashion-accent text-white px-2 py-0.5 rounded-full">
              Live Fashion Prototype
            </span>
            <span className="text-xs text-slate-400">100 Apparel SKUs • First-Party Telemetry Instrumented</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Fashion Storefront Experience</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Interactive shopping journey instrumented with first-party PostgreSQL event capture. Test size guide modals, product comparisons, checkout simulations, and post-purchase returns.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTrackOrderModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Package className="w-4 h-4 text-brand-400" />
            <span>Track Order & Returns</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Collections ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search kurtas, linen shirts, oversized hoodies, dresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Brand:</span>
            <select
              value={selectedBrand || ''}
              onChange={(e) => setSelectedBrand(e.target.value ? Number(e.target.value) : null)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((prod) => {
          const isWishlisted = wishlist.includes(prod.id);
          const isCompared = compareList.some((p) => p.id === prod.id);
          const sizes = JSON.parse(prod.available_sizes_json || '["M"]');

          return (
            <div
              key={prod.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Product Card Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => handleOpenPDP(prod)}>
                <img
                  src={prod.hero_image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm shadow text-[10px] font-bold text-slate-800 flex items-center gap-1">
                  <span>{prod.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-slate-400">| {prod.review_count}</span>
                </div>

                {/* Top Action Pills */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-colors ${
                      isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 hover:bg-white text-slate-600'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(prod);
                    }}
                    className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-colors ${
                      isCompared ? 'bg-brand-50 text-brand-600' : 'bg-white/80 hover:bg-white text-slate-600'
                    }`}
                    title="Compare Product Specs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3.5 flex flex-col flex-1 justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {prod.brand?.name || 'Brand'}
                  </span>
                  <h3
                    onClick={() => handleOpenPDP(prod)}
                    className="font-bold text-slate-800 hover:text-brand-600 truncate cursor-pointer mt-0.5"
                  >
                    {prod.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{prod.price.toLocaleString()}
                    </span>
                    {prod.discount_percent > 0 && (
                      <span className="text-fashion-accent text-[11px] font-bold">
                        ({prod.discount_percent}% OFF)
                      </span>
                    )}
                  </div>

                  {/* Sticky Available Sizes Pills */}
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <span className="text-[10px] text-slate-400 mr-0.5">Sizes:</span>
                    {sizes.slice(0, 4).map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-1.5 py-0.2 rounded border border-slate-200 text-slate-600 bg-slate-50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={() => addToCart(prod, sizes[0] || 'M')}
                  className="w-full mt-3 py-2 bg-slate-900 hover:bg-fashion-accent text-white rounded-xl font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDP Modal */}
      {selectedProduct && (
        <Modal
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku} • ${selectedProduct.brand?.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Image Gallery */}
            <div className="space-y-3">
              <img
                src={selectedProduct.hero_image}
                alt={selectedProduct.name}
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-slate-200 shadow-sm"
              />
              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                <span>Simulated Delivery in {selectedProduct.delivery_estimate_days} Days</span>
              </div>
            </div>

            {/* Product Details & Size Guidance */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    ₹{selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.discount_percent > 0 && (
                    <span className="text-fashion-accent font-bold">
                      {selectedProduct.discount_percent}% OFF
                    </span>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>

                {/* Smart Size Recommender Badge (Prototype validation feature) */}
                <div className="p-3 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-brand-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      Recommended for You: Size M
                    </span>
                    <button
                      onClick={() => {
                        setShowSizeModal(true);
                        trackInteraction('size_guide_opened', {
                          productId: selectedProduct.id,
                          properties: { source: 'smart_badge' }
                        });
                      }}
                      className="text-[11px] text-brand-700 hover:underline font-semibold"
                    >
                      Size Chart & Fit Guide
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Based on your previous Roadster cotton shirt purchase (Fit score: 94% accuracy).
                  </p>
                </div>

                {/* Size Selection */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-700 block">Select Size:</span>
                  <div className="flex items-center gap-2">
                    {JSON.parse(selectedProduct.available_sizes_json || '[]').map((sz: string) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          selectedSize === sz
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return Policy */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-600 text-[11px]">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedProduct.return_policy}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedSize);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 bg-fashion-accent hover:bg-fashion-accentHover text-white rounded-xl font-bold text-xs shadow-lg shadow-fashion-accent/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Size {selectedSize} to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Size Chart Modal */}
      <Modal
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        title="Interactive Sizing & Fit Guide"
        subtitle="Standardized apparel dimensions and body measurement benchmarks."
      >
        <div className="space-y-4 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 text-left rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="p-2.5">Size Tag</th>
                  <th className="p-2.5">Chest / Bust (in)</th>
                  <th className="p-2.5">Waist (in)</th>
                  <th className="p-2.5">Garment Length (in)</th>
                  <th className="p-2.5">Fit Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">S</td>
                  <td className="p-2.5">36 - 38</td>
                  <td className="p-2.5">30 - 32</td>
                  <td className="p-2.5">27.5</td>
                  <td className="p-2.5 text-slate-600">Slim / Tailored</td>
                </tr>
                <tr className="bg-brand-50/50 font-bold text-brand-900">
                  <td className="p-2.5">M (Recommended)</td>
                  <td className="p-2.5">39 - 41</td>
                  <td className="p-2.5">33 - 35</td>
                  <td className="p-2.5">28.5</td>
                  <td className="p-2.5 text-brand-700">Regular Comfort Fit</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">L</td>
                  <td className="p-2.5">42 - 44</td>
                  <td className="p-2.5">36 - 38</td>
                  <td className="p-2.5">29.5</td>
                  <td className="p-2.5 text-slate-600">Relaxed Fit</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">XL</td>
                  <td className="p-2.5">45 - 47</td>
                  <td className="p-2.5">39 - 41</td>
                  <td className="p-2.5">30.5</td>
                  <td className="p-2.5 text-slate-600">Oversized Silhouette</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px]">
            Size calibration based on 18 customer research interviews and 48% sizing return telemetry.
          </div>
        </div>
      </Modal>

      {/* Order Tracking & Return/Exchange Modal */}
      <Modal
        isOpen={trackOrderModal}
        onClose={() => {
          setTrackOrderModal(false);
          setTrackedOrder(null);
        }}
        title="Order Tracking & Self-Service Returns"
        subtitle="Simulate post-purchase logistics, returns, and 1-click doorstep exchange workflows."
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleTrackOrderSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Order Number (e.g. ORD-2026-100001)"
              value={searchOrderNum}
              onChange={(e) => setSearchOrderNum(e.target.value)}
              className="flex-1 p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
            >
              Search Order
            </button>
          </form>

          {trackedOrder && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{trackedOrder.order_number}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {trackedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Amount Paid:</span>
                  <span className="font-bold text-slate-900">₹{trackedOrder.final_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tracking Reference:</span>
                  <span className="font-mono text-brand-600 font-medium">{trackedOrder.tracking_number}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-700 block">Ordered Items:</span>
                {trackedOrder.items?.map((item: any) => (
                  <div key={item.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.product?.name || `Product #${item.product_id}`}</h4>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Size: {item.size} • Qty: {item.quantity} • ₹{item.total_price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setReturnOrderItemId(item.id);
                          setReturnModal(true);
                        }}
                        className="px-2.5 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg font-semibold text-[11px]"
                      >
                        Request Return
                      </button>
                      <button
                        onClick={() => {
                          setReturnOrderItemId(item.id);
                          setExchangeModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-semibold text-[11px]"
                      >
                        1-Click Exchange
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Return Reason Modal */}
      <Modal
        isOpen={returnModal}
        onClose={() => setReturnModal(false)}
        title="Schedule Return Doorstep Pickup"
        subtitle="Select return root-cause to calibrate product operations analytics."
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Reason for Return</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800"
            >
              {[
                'Size too small across chest/shoulders',
                'Size too large / baggy silhouette',
                'Fabric texture differs from studio imagery',
                'Color shade discrepancy under daylight',
                'Defective seam or loose button',
                'Delivered later than expected'
              ].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
            Reverse pickup courier will arrive within 48 hours. Simulated refund will process upon courier scan.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setReturnModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReturn}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow"
            >
              Confirm Simulated Return
            </button>
          </div>
        </div>
      </Modal>

      {/* Exchange Size Modal */}
      <Modal
        isOpen={exchangeModal}
        onClose={() => setExchangeModal(false)}
        title="Instant Doorstep Exchange"
        subtitle="Select your replacement size for simultaneous drop-off and pickup."
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Choose Replacement Size</label>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setExchangeTargetSize(s)}
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    exchangeTargetSize === s
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'border border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 text-[11px]">
            New size {exchangeTargetSize} will be handed over by delivery agent while collecting the original garment.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setExchangeModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitExchange}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow"
            >
              Confirm 1-Click Swap
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
