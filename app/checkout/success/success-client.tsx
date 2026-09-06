'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Copy, Check, MessageCircle, Phone, ArrowRight, Truck, Clock } from 'lucide-react';
import { Order } from '@/lib/types';
import { getOrderByNumberAction } from '@/app/actions/orders';
import { isFreeDeliveryArea } from '@/lib/constants';

const WHATSAPP_NUMBER = '923109361932';
const WHATSAPP_DISPLAY = '0310-9361932';

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('order') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let foundOrder: Order | null = null;

    // 1. Try retrieving from sessionStorage for immediate instant render
    try {
      const stored = sessionStorage.getItem('ffd_last_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!orderNumberParam || parsed.order_number === orderNumberParam) {
          foundOrder = parsed;
          setOrder(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached order from sessionStorage', e);
    }

    // 2. Fetch authoritative data from server if needed
    if (orderNumberParam && (!foundOrder || !foundOrder.items || foundOrder.items.length === 0)) {
      getOrderByNumberAction(orderNumberParam)
        .then((dbOrder) => {
          if (dbOrder) {
            setOrder(dbOrder);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumberParam]);

  const handleCopyReceipt = () => {
    if (!order) return;
    const itemsSummary = (order.items || [])
      .map((it: any, idx: number) => `${idx + 1}. ${it.product_name || it.name} (Qty: ${it.quantity}) - Rs. ${it.subtotal || it.product_price * it.quantity}`)
      .join('\n');

    const slot = (order as any)?.delivery_slot || 'Morning';
    const isFree = isFreeDeliveryArea(order.area_name);
    const feeText = isFree ? 'FREE Doorstep Delivery' : 'Delivered via Rider (Rider charges apply)';

    const text = `🥛 FARM FRESH DAIRY — ORDER #${order.order_number}
Customer: ${order.customer_name}
Phone: ${order.customer_phone}
Address: ${order.delivery_address}, ${order.area_name || order.city || 'Islamabad'}
${itemsSummary ? `Items:\n${itemsSummary}\n` : ''}
Delivery: ${feeText}
Total Payable: Rs. ${order.total_amount} (Cash on Delivery)
Delivery Slot: ${slot}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const slot = (order as any)?.delivery_slot || 'Morning';
  const isFree = isFreeDeliveryArea(order?.area_name);
  const feeLabel = isFree ? 'FREE Doorstep Delivery' : 'Via Rider';
  const whatsappMessage = order
    ? encodeURIComponent(
        `🥛 Hello Farm Fresh Dairy! I just placed order #${order.order_number} for ${slot.toLowerCase()} delivery to ${order.delivery_address}, ${order.area_name || ''}. Total: Rs. ${order.total_amount} (Delivery: ${feeLabel}). Please confirm delivery!`
      )
    : encodeURIComponent(`🥛 Hello Farm Fresh Dairy! Please confirm my milk delivery order #${orderNumberParam}.`);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  if (loading && !order) {
    return (
      <div className="text-center py-20 bg-cream-200/50 rounded-3xl border border-earth-200 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full border-4 border-farm-200 border-t-farm-700 animate-spin mx-auto"></div>
        <p className="text-earth-700 text-sm font-semibold">Loading your order confirmation...</p>
      </div>
    );
  }

  const displayOrderNumber = order?.order_number || orderNumberParam || 'FFD-ORDER';
  const customerName = order?.customer_name || 'Valued Customer';
  const customerEmail = order?.customer_email;
  const customerPhone = order?.customer_phone;
  const deliveryAddress = order?.delivery_address;
  const areaName = order?.area_name || 'Islamabad';
  const totalAmount = order?.total_amount;

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 sm:px-10 rounded-3xl bg-white border border-farm-200 shadow-float space-y-6 animate-fade-in text-center">
      
      {/* Animated Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Order Confirmed & Received
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
          Thank You, {customerName}!
        </h1>
        <div className="text-sm font-mono font-bold text-farm-800 bg-farm-50/80 py-1.5 px-4 rounded-xl inline-block border border-farm-200">
          Order #{displayOrderNumber}
        </div>

        {customerEmail ? (
          <p className="text-earth-600 text-xs sm:text-sm max-w-md mx-auto pt-1 leading-relaxed">
            Your order has been recorded in our dispatch system and an email alert has been sent to our farm dispatch desk.<br />
            A confirmation receipt has also been sent to: <strong className="text-farm-900 font-semibold">{customerEmail}</strong>
          </p>
        ) : (
          <p className="text-earth-600 text-xs sm:text-sm max-w-md mx-auto pt-1 leading-relaxed">
            Your order has been recorded in our dispatch system and an email alert has been sent to our farm dispatch desk. We will deliver fresh to your doorstep!
          </p>
        )}
      </div>

      {/* Delivery Slot Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-left flex items-start gap-3.5 text-xs text-emerald-950 shadow-sm">
        <span className="text-2xl mt-0.5">
          {slot === 'Evening' ? '🌙' : '☀️'}
        </span>
        <div className="space-y-1">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            {slot === 'Evening' ? 'Evening Delivery Route' : 'Morning Delivery Route'}
          </div>
          <div className="text-emerald-800 text-[11px] leading-relaxed">
            Your milk is scheduled for your selected {slot.toLowerCase()} delivery route. Our rider will bring fresh, cold milk directly to your doorstep and collect cash upon delivery.
          </div>
        </div>
      </div>

      {/* Order Details Receipt Box */}
      <div className="p-6 rounded-2xl bg-farm-50/70 border border-farm-200/80 text-left space-y-3 font-mono text-xs text-earth-800">
        <div className="flex items-center justify-between pb-2 border-b border-farm-200 font-bold text-farm-900">
          <span>RECEIPT #{displayOrderNumber}</span>
          <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
            Cash on Delivery (COD)
          </span>
        </div>

        <div className="space-y-1 text-[11px] text-earth-700">
          {customerPhone && (
            <div><strong>Deliver to:</strong> {customerName} ({customerPhone})</div>
          )}
          {areaName && (
            <div><strong>Delivery Area:</strong> {areaName}</div>
          )}
          <div><strong>Delivery Slot:</strong> {slot} Delivery</div>
          {deliveryAddress && (
            <div><strong>Street Address:</strong> {deliveryAddress}</div>
          )}
          {order?.delivery_notes && (
            <div><strong>Special Notes:</strong> <em>{order.delivery_notes}</em></div>
          )}
          {totalAmount !== undefined && (
            <div className="pt-1">
              <strong>Total Payable:</strong>{' '}
              <span className="text-farm-800 font-bold text-sm">Rs. {totalAmount}</span>{' '}
              {isFree ? (
                <span className="text-emerald-700 font-bold">(FREE Doorstep Delivery)</span>
              ) : (
                <span className="text-amber-800 font-semibold text-[11px]">(+ Rider delivery charges payable upon delivery)</span>
              )}
            </div>
          )}
        </div>

        {/* Ordered items breakdown if available */}
        {order?.items && order.items.length > 0 && (
          <div className="pt-2 border-t border-farm-200 space-y-1">
            <div className="font-bold text-farm-900 text-[11px] pb-1">Items:</div>
            {order.items.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between text-[11px] text-earth-700">
                <span>{it.product_name || it.name} × {it.quantity}</span>
                <span className="font-bold">Rs. {it.subtotal || (it.product_price ? it.product_price * it.quantity : '')}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-farm-200 flex justify-between items-center text-[11px]">
          <span className="text-earth-500">Status: <strong className="text-amber-700">Pending Dispatch ({slot})</strong></span>
          <button
            type="button"
            onClick={handleCopyReceipt}
            className="inline-flex items-center gap-1.5 text-farm-700 hover:text-farm-900 font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Order Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* WhatsApp Dispatch Desk CTA */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-center space-y-2">
        <div className="text-xs text-earth-700 font-medium">
          Need to confirm instructions or have questions for our farm team?
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          WhatsApp Dispatch Desk ({WHATSAPP_DISPLAY})
        </a>
      </div>

      {/* Action Navigation Buttons */}
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
