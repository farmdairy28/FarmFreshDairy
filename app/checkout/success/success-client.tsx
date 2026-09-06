'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Copy, Check, MessageCircle, Phone, ArrowRight, Truck, Clock, Star, Sparkles, Send, AlertCircle } from 'lucide-react';
import { Order } from '@/lib/types';
import { getOrderByNumberAction } from '@/app/actions/orders';
import { submitReviewAction } from '@/app/actions/reviews';
import { isFreeDeliveryArea } from '@/lib/constants';

const WHATSAPP_NUMBER = '923109361932';
const WHATSAPP_DISPLAY = '0310-9361932';

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('order') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

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

  const paymentMethodDisplay = order?.payment_method || 'Cash on Delivery (Daily)';
  const isPermanentMonthly = paymentMethodDisplay.toLowerCase().includes('monthly');
  const isPermanentWeekly = paymentMethodDisplay.toLowerCase().includes('weekly');
  const isPermanentCustomer = isPermanentMonthly || isPermanentWeekly;

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
Payment Plan: ${paymentMethodDisplay}
Total Payable: Rs. ${order.total_amount}
Delivery Slot: ${slot}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const slot = (order as any)?.delivery_slot || 'Morning';
  const isFree = isFreeDeliveryArea(order?.area_name);
  const feeLabel = isFree ? 'FREE Doorstep Delivery' : 'Via Rider';
  const planTag = isPermanentMonthly ? '[Monthly Billing Plan]' : isPermanentWeekly ? '[Weekly Billing Plan]' : '[Daily COD]';
  const whatsappMessage = order
    ? encodeURIComponent(
        `🥛 Hello Farm Fresh Dairy! I just placed order #${order.order_number} ${planTag} for ${slot.toLowerCase()} delivery to ${order.delivery_address}, ${order.area_name || ''}. Total: Rs. ${order.total_amount} (Delivery: ${feeLabel}, Payment: ${paymentMethodDisplay}). Please confirm delivery!`
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const res = await submitReviewAction({
        customer_name: customerName,
        customer_type: areaName ? `Verified Customer • ${areaName}` : 'Verified Customer',
        rating: reviewRating,
        review: reviewComment.trim(),
      });

      if (res.success) {
        setReviewSuccess(true);
      } else {
        setReviewError(res.error || 'Failed to submit review. Please try again.');
      }
    } catch (err: any) {
      setReviewError(err?.message || 'Error submitting review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const quickReviewTags = [
    '🥛 100% Pure & Fresh Milk',
    '🚚 Fast Morning/Evening Delivery',
    '👑 Excellent Quality & Taste',
    '❤️ Highly Recommended for Families',
  ];

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
            Your milk is scheduled for your selected {slot.toLowerCase()} delivery route. Our rider will bring fresh, cold milk directly to your doorstep {isPermanentMonthly ? 'under your Permanent Monthly Billing Plan.' : isPermanentWeekly ? 'under your Permanent Weekly Billing Plan.' : 'and collect cash upon delivery.'}
          </div>
        </div>
      </div>

      {/* Order Details Receipt Box */}
      <div className="p-6 rounded-2xl bg-farm-50/70 border border-farm-200/80 text-left space-y-3 font-mono text-xs text-earth-800">
        <div className="flex items-center justify-between pb-2 border-b border-farm-200 font-bold text-farm-900 flex-wrap gap-2">
          <span>RECEIPT #{displayOrderNumber}</span>
          <span className={`px-2.5 py-0.5 rounded text-[11px] ${
            isPermanentMonthly
              ? 'text-amber-900 bg-amber-100 border border-amber-300 font-bold'
              : isPermanentWeekly
              ? 'text-emerald-900 bg-emerald-100 border border-emerald-300 font-bold'
              : 'text-emerald-700 bg-emerald-100/70'
          }`}>
            {paymentMethodDisplay}
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
          <div><strong>Payment / Billing:</strong> {paymentMethodDisplay}</div>
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

      {/* Customer Review & Rating Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-200/90 text-left space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-earth-900 leading-tight">
                Leave a Quick Review
              </h3>
              <p className="text-xs text-earth-600">
                How was your ordering experience? Your feedback helps fellow dairy lovers!
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
            Live on Website
          </span>
        </div>

        {reviewSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <div className="font-serif font-bold text-sm text-emerald-950">
              Thank You for Your Feedback!
            </div>
            <p className="text-xs text-emerald-700">
              Your {reviewRating}★ review has been submitted and is now featured live on our homepage!
            </p>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-3.5 pt-1">
            {reviewError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            {/* Star Picker */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono uppercase font-bold text-earth-700">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (reviewHover || reviewRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-earth-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-mono font-bold text-amber-800 ml-1">
                  {reviewRating === 5
                    ? '5.0 — Excellent!'
                    : reviewRating === 4
                    ? '4.0 — Very Good'
                    : reviewRating === 3
                    ? '3.0 — Good'
                    : `${reviewRating}.0`}
                </span>
              </div>
            </div>

            {/* Quick Tag Suggestions */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase font-bold text-earth-600">
                Quick Comments (Tap to fill)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickReviewTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setReviewComment((prev) =>
                        prev ? `${prev} ${tag}` : tag
                      );
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-earth-700 hover:text-amber-950 border border-earth-300/80 hover:border-amber-300 transition-all font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment Text Area */}
            <div>
              <textarea
                rows={2}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with our fresh milk, delivery speed, or packaging..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-earth-300 text-earth-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview || !reviewComment.trim()}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmittingReview ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Customer Review</span>
                </>
              )}
            </button>
          </form>
        )}
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
