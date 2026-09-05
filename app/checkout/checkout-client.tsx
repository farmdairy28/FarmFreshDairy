'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { DeliveryRegion, Order } from '@/lib/types';
import { submitOrderAction } from '@/app/actions/orders';

const DELIVERY_TIMING = 'Morning 6:00 AM - 9:00 AM';

export function CheckoutClient({ regions }: { regions: DeliveryRegion[] }) {
  const router = useRouter();
  const { items, cartSubtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: 'Islamabad',
    area_name: regions[0]?.areas[0]?.name || 'Shahzad Town (FREE Doorstep Delivery)',
    delivery_notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        delivery_address: formData.delivery_address,
        city: formData.city,
        area_name: formData.area_name,
        delivery_notes: formData.delivery_notes,
      };

      const result = await submitOrderAction(orderPayload);

      if (result.success && result.order) {
        try {
          sessionStorage.setItem('ffd_last_order', JSON.stringify(result.order));
        } catch (storageErr) {
          console.warn('sessionStorage cache failed', storageErr);
        }

        clearCart();
        router.push(`/checkout/success?order=${encodeURIComponent(result.order.order_number)}`);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Order checkout error:', err);
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'An unexpected error occurred during checkout.');
    }
  };

  if (isSubmitting) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-farm-200 shadow-soft space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full border-4 border-farm-200 border-t-farm-700 animate-spin mx-auto"></div>
        <h2 className="font-serif text-2xl font-bold text-earth-900">
          Confirming Your Order...
        </h2>
        <p className="text-earth-600 text-sm">
          Dispatching order details to our farm desk and preparing your receipt.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-cream-200/50 rounded-3xl border border-earth-200 space-y-4 max-w-lg mx-auto">
        <h2 className="font-serif text-2xl font-bold text-earth-900">
          No items to checkout
        </h2>
        <p className="text-earth-600 text-sm">
          Please add fresh dairy products to your cart before proceeding.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3.5 rounded-full bg-farm-700 text-cream-100 font-bold text-xs uppercase"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Form Fields */}
      <div className="lg:col-span-7 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft space-y-6">
          <h2 className="font-serif text-2xl font-bold text-earth-900">
            1. Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Ayesha Khan"
                className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              placeholder="ayesha@example.com (optional)"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft space-y-6">
          <h2 className="font-serif text-2xl font-bold text-earth-900">
            2. Delivery Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
                City
              </label>
              <input
                type="text"
                disabled
                value={formData.city}
                className="w-full px-4 py-3 rounded-2xl bg-earth-200/60 border border-earth-300 text-earth-800 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
                Delivery Area *
              </label>
              <select
                value={formData.area_name}
                onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
              >
                {regions.map((reg) => (
                  <optgroup key={reg.id} label={reg.name}>
                    {reg.areas.map((area) => (
                      <option key={area.id} value={area.name}>
                        {area.name} (Free Morning Route)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
              Complete Street Address *
            </label>
            <textarea
              rows={3}
              required
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              placeholder="House #, Street #, Sector/Block, Landmark"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-earth-600 mb-1 font-semibold">
              Special Delivery Notes (Optional)
            </label>
            <input
              type="text"
              value={formData.delivery_notes}
              onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
              placeholder="e.g. Leave bottle on front door hook if before 7:00 AM"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft space-y-4">
          <h2 className="font-serif text-2xl font-bold text-earth-900">
            3. Payment Method
          </h2>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm text-earth-900">Cash on Delivery (COD)</div>
                <div className="text-xs text-earth-600">Pay cash upon receiving morning chilled milk</div>
              </div>
            </div>
            <span className="text-xs font-mono uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>

      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-farm-200 shadow-soft space-y-6 sticky top-32">
        <h2 className="font-serif font-bold text-2xl text-earth-900">
          Order Items ({items.length})
        </h2>

        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center justify-between gap-4 py-2 border-b border-earth-200/60">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-earth-200 overflow-hidden shrink-0">
                  <Image src={product.primary_image || ''} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-earth-900 leading-tight">
                    {product.name}
                  </div>
                  <div className="text-xs text-earth-500 font-mono">
                    {quantity} × {product.currency} {product.price}
                  </div>
                </div>
              </div>

              <div className="font-serif font-bold text-sm text-farm-900">
                {product.currency} {product.price * quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-earth-300/60 pt-4">
          <div className="flex justify-between text-earth-600">
            <span>Estimated Subtotal</span>
            <span className="font-mono font-semibold">Rs. {cartSubtotal}</span>
          </div>
          <div className="flex justify-between text-earth-600">
            <span>Morning Delivery Fee</span>
            <span className="font-mono font-bold text-emerald-600 uppercase text-xs">FREE</span>
          </div>
          <div className="flex justify-between font-serif font-bold text-2xl text-earth-900 pt-3 border-t border-earth-300">
            <span>Total Payable</span>
            <span className="text-farm-700">Rs. {cartSubtotal}</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Placing Morning Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Morning Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="text-center text-xs font-mono text-earth-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Direct Doorstep Chilled Delivery
          </div>
          <div>Morning Route 6:00 AM – 9:00 AM • Cash on Delivery</div>
        </div>
      </div>

    </form>
  );
}
