'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, MessageCircle, Phone, Copy, Check } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { DeliveryRegion, Order } from '@/lib/types';
import { submitOrderAction } from '@/app/actions/orders';

const WHATSAPP_NUMBER = '923109361932';
const WHATSAPP_DISPLAY = '0310-9361932';

function buildWhatsAppMessage(
  order: Order, 
  items: { product: any; quantity: number }[], 
  subtotal: number, 
  formData: { customer_name: string; customer_phone: string; customer_email: string; area_name: string; delivery_address: string; delivery_notes: string }
) {
  const itemsList = items.map((it, idx) => {
    const itemTotal = it.product.price * it.quantity;
    return `${idx + 1}. *${it.product.name}* (${it.product.weight_volume || it.product.unit || '1 Litre'})\n   Qty: ${it.quantity} × Rs. ${it.product.price} = *Rs. ${itemTotal}*`;
  }).join('\n\n');

  return `🥛 *NEW ORDER - FARM FRESH DAIRY*
━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.order_number}
👤 *Name:* ${formData.customer_name}
📞 *Phone:* ${formData.customer_phone}
${formData.customer_email ? `📧 *Email:* ${formData.customer_email}\n` : ''}📍 *Delivery Area:* ${formData.area_name}
🏠 *Address:* ${formData.delivery_address}
${formData.delivery_notes ? `📝 *Special Notes:* ${formData.delivery_notes}\n` : ''}
🛒 *ORDER ITEMS:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 *Estimated Subtotal:* Rs. ${subtotal}
🚚 *Delivery Fee:* FREE (Shahzad Town & Islamabad)
💵 *TOTAL AMOUNT PAYABLE:* *Rs. ${subtotal}*
💳 *Payment:* Cash on Delivery (COD)
⏰ *Delivery Slot:* Morning 6:00 AM - 9:00 AM
━━━━━━━━━━━━━━━━━━━━
_Please confirm my morning milk delivery order!_`;
}

export function CheckoutClient({ regions }: { regions: DeliveryRegion[] }) {
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
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [copied, setCopied] = useState(false);

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
        // Construct the full formatted WhatsApp payload
        const messageText = buildWhatsAppMessage(result.order, items, cartSubtotal, formData);
        const encodedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
        
        setWhatsappLink(encodedUrl);
        setCompletedOrder(result.order);
        clearCart();

        // Attempt to directly open WhatsApp in new tab
        if (typeof window !== 'undefined') {
          const win = window.open(encodedUrl, '_blank');
          if (!win) {
            // Popup blocked by browser, user can click the button
            console.log('Popup blocked, using fallback link button.');
          }
        }
      } else {
        setErrorMessage(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Order checkout error:', err);
      setErrorMessage(err?.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderSummary = () => {
    if (!completedOrder) return;
    const messageText = buildWhatsAppMessage(completedOrder, completedOrder.items as any || [], completedOrder.total_amount, formData);
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 sm:px-10 rounded-3xl bg-white border border-farm-200 shadow-float space-y-6 animate-fade-in text-center">
        
        {/* Animated Check & WhatsApp Badge */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <MessageCircle className="w-4 h-4 fill-current" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Order Successfully Placed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
            Thank You, {completedOrder.customer_name}!
          </h2>
          <div className="text-sm font-mono font-bold text-farm-800 bg-farm-50/80 py-1.5 px-4 rounded-xl inline-block border border-farm-200">
            Order #{completedOrder.order_number}
          </div>
          {completedOrder.customer_email ? (
            <p className="text-earth-600 text-xs sm:text-sm max-w-md mx-auto pt-1">
              A confirmation email has been sent to:<br />
              <strong className="text-farm-900 font-semibold">{completedOrder.customer_email}</strong>
            </p>
          ) : (
            <p className="text-earth-600 text-xs sm:text-sm max-w-md mx-auto pt-1">
              Your order has been received successfully.
            </p>
          )}
        </div>

        {/* Big WhatsApp CTA Button */}
        {whatsappLink && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-emerald-50 border border-emerald-300 space-y-3">
            <div className="text-xs font-mono uppercase text-emerald-800 font-bold flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WhatsApp Message Ready
            </div>
            <p className="text-xs text-earth-700 leading-relaxed max-w-md mx-auto">
              Tap below to open WhatsApp with your full order payload and send it directly to our farm dispatch desk:
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Send Order on WhatsApp ({WHATSAPP_DISPLAY})
            </a>
          </div>
        )}

        {/* Order Details Receipt Box */}
        <div className="p-6 rounded-2xl bg-farm-50/70 border border-farm-200/80 text-left space-y-3 font-mono text-xs text-earth-800">
          <div className="flex items-center justify-between pb-2 border-b border-farm-200 font-bold text-farm-900">
            <span>RECEIPT #{completedOrder.order_number}</span>
            <span className="text-emerald-700">Cash on Delivery (COD)</span>
          </div>

          <div className="space-y-1 text-[11px] text-earth-700">
            <div><strong>Deliver to:</strong> {completedOrder.customer_name} ({completedOrder.customer_phone})</div>
            <div><strong>Area:</strong> {completedOrder.area_name}</div>
            <div><strong>Address:</strong> {completedOrder.delivery_address}</div>
            <div><strong>Total Payable:</strong> <span className="text-farm-800 font-bold text-sm">Rs. {completedOrder.total_amount}</span> (FREE Delivery)</div>
          </div>

          <div className="pt-2 border-t border-farm-200 flex justify-end">
            <button
              type="button"
              onClick={handleCopyOrderSummary}
              className="inline-flex items-center gap-1.5 text-farm-700 hover:text-farm-900 text-[11px] font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Order Text'}
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/products"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Order More Products
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-farm-100 text-earth-800 font-bold text-xs uppercase tracking-wider transition-colors border border-earth-300"
          >
            Back to Home
          </Link>
        </div>
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
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            {isSubmitting ? 'Processing & Opening WhatsApp...' : 'Confirm Morning Order'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center text-xs font-mono text-earth-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Direct WhatsApp Integration Enabled
          </div>
          <div>Chilled Delivery 6:00 AM – 9:00 AM • Cancel Anytime</div>
        </div>
      </div>

    </form>
  );
}
