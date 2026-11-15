import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { api } from '../../api/client';
import { Modal } from '../common/Modal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart, trackInteraction, addToast } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103');
  const [paymentMethod, setPaymentMethod] = useState('UPI - Simulated');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const totalMRP = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(totalMRP * 0.15); // Standard 15% discount
  const finalTotal = Math.max(0, totalMRP - discountAmount);

  const handleStartCheckout = () => {
    trackInteraction('checkout_started', {
      properties: { cart_size: cart.length, total: finalTotal }
    });
    setIsCheckingOut(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: 'Aarav Sharma',
        customer_email: 'aarav.sharma@threadiq.internal',
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        items: cart.map((i) => ({
          product_id: i.product.id,
          size: i.size,
          quantity: i.quantity,
          unit_price: i.product.price
        }))
      };

      const result = await api.storefront.checkout(orderPayload);
      setCompletedOrder(result);
      clearCart();

      trackInteraction('purchase_completed', {
        properties: { order_number: result.order_number, final_amount: result.final_amount }
      });

      addToast({
        type: 'success',
        title: 'Order Confirmed (Simulated)',
        message: `Order #${result.order_number} created with simulated UPI authorization.`
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Checkout Simulation Failed',
        message: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-fashion-accent" />
              <h2 className="text-base font-bold text-slate-900">Your Shopping Bag ({cart.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">Your bag is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Explore our fashion storefront to add curated apparel items and test telemetry instrumentation.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 flex gap-3 items-center hover:border-slate-300 transition-colors bg-white"
                >
                  <img
                    src={item.product.hero_image}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-lg shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      {item.product.brand?.name || 'ThreadIQ Brand'}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-slate-900">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Size: {item.size}
                      </span>
                      <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Bag Total MRP</span>
                  <span>₹{totalMRP.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Fashion Savings Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doorstep Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Simulated checkout sandbox. No real monetary transactions will occur.</span>
              </div>

              <button
                onClick={handleStartCheckout}
                className="w-full py-2.5 rounded-xl bg-fashion-accent hover:bg-fashion-accentHover text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-fashion-accent/25 transition-all"
              >
                <span>Proceed to Simulated Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Simulation Modal */}
      <Modal
        isOpen={isCheckingOut}
        onClose={() => {
          setIsCheckingOut(false);
          setCompletedOrder(null);
        }}
        title={completedOrder ? "Order Confirmation" : "Simulate E-Commerce Checkout"}
        subtitle={
          completedOrder
            ? "Your simulated purchase was placed and instrumented in the event database."
            : "Complete a zero-risk simulated order to verify conversion funnel telemetry."
        }
      >
        {completedOrder ? (
          <div className="space-y-4 py-2 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Purchase Successfully Completed!</h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-slate-800">{completedOrder.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-slate-800">₹{completedOrder.final_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono text-brand-600 font-semibold">{completedOrder.tracking_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Instrument:</span>
                <span className="text-slate-700">{completedOrder.payment_method}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              The event <code className="bg-slate-100 px-1.5 py-0.5 rounded text-brand-700 font-mono">purchase_completed</code> has been persisted to the PostgreSQL/SQLite telemetry store.
            </p>

            <button
              onClick={() => {
                setIsCheckingOut(false);
                setCompletedOrder(null);
                onClose();
              }}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              Done & View Analytics
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Simulated Payment Method</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'UPI - Simulated (GPay/PhonePe)',
                  'Credit Card - Simulated',
                  'Net Banking - Simulated',
                  'Cash on Delivery - Simulated'
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMethod(mode)}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      paymentMethod === mode
                        ? 'border-brand-600 bg-brand-50/60 text-brand-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Final Order Value</span>
              <span className="text-base text-brand-700">₹{finalTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="px-6 py-2 bg-fashion-accent hover:bg-fashion-accentHover text-white font-semibold text-xs rounded-xl shadow-lg shadow-fashion-accent/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Simulating Authorization...' : 'Confirm Simulated Order'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
