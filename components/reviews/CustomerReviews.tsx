'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, AlertCircle, PenLine, X, ChevronLeft, ChevronRight, Quote, ShieldCheck, Camera, Upload, Trash2 } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { submitReviewAction } from '@/app/actions/reviews';

interface CustomerReviewsProps {
  initialReviews: Testimonial[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function CustomerReviews({
  initialReviews,
  title = 'Kind Words From Our Customers',
  subtitle = 'Discover what families and culinary chefs in Islamabad say about our 100% pure raw cow milk and chilled doorstep service.',
  eyebrow = 'COMMUNITY VOICE & REVIEWS',
}: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Testimonial[]>(initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = reviews[currentIndex] || reviews[0];

  const handleNext = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const handlePrev = () => {
    if (reviews.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Photo size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setErrorMessage('');
    };
    reader.onerror = () => {
      setErrorMessage('Failed to load image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await submitReviewAction({
        customer_name: customerName,
        customer_type: customerType || 'Verified Customer',
        rating,
        review: reviewText,
        avatar_url: avatarUrl || undefined,
      });

      if (res.success && res.testimonial) {
        // Prepend new review so it immediately shows on the page!
        setReviews((prev) => [res.testimonial!, ...prev]);
        setCurrentIndex(0);
        setSuccessMessage('Thank you! Your review has been submitted and is now live on the page.');
        setCustomerName('');
        setCustomerType('');
        setReviewText('');
        setAvatarUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setRating(5);

        // Auto close modal after brief delay
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMessage('');
        }, 2200);
      } else {
        setErrorMessage(res.error || 'Failed to submit your review. Please check the fields.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" className="py-24 bg-cream-100 border-t border-earth-200 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
                {eyebrow}
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {avgRating} / 5.0 ({reviews.length} Reviews)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-earth-900">
              {title}
            </h2>
            <p className="text-earth-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Write a Review Button */}
            <button
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 font-semibold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Review</span>
            </button>

            {/* Carousel Arrows */}
            {reviews.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-cream-200 text-earth-800 hover:bg-farm-700 hover:text-cream-100 transition-colors border border-earth-300 shadow-sm"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-cream-200 text-earth-800 hover:bg-farm-700 hover:text-cream-100 transition-colors border border-earth-300 shadow-sm"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success toast if review just submitted */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-medium flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Featured Review Hero Card */}
        {current && (
          <div className="relative p-8 sm:p-12 md:p-14 rounded-3xl bg-cream-200/80 border border-earth-200 shadow-soft max-w-4xl mx-auto mb-16 transition-all">
            <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-farm-300/30 pointer-events-none" />

            <div className="space-y-6">
              {/* Rating Stars */}
              <div className="flex items-center gap-1.5 text-amber-500">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-xs font-mono font-bold text-earth-600 ml-2">
                  {current.rating || 5}.0 Rating
                </span>
              </div>

              {/* Review Text */}
              <p className="font-serif text-xl sm:text-2xl md:text-3xl text-earth-900 leading-snug font-medium italic">
                &ldquo;{current.review}&rdquo;
              </p>

              {/* Author Details */}
              <div className="flex items-center gap-4 pt-6 border-t border-earth-300/60">
                {current.avatar_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-farm-600 shrink-0">
                    <Image
                      src={current.avatar_url}
                      alt={current.customer_name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-farm-700 text-cream-100 font-serif font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                    {current.customer_name ? current.customer_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <div>
                  <div className="font-serif font-bold text-base sm:text-lg text-earth-900 flex items-center gap-2">
                    <span>{current.customer_name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className="text-xs font-mono text-farm-700 font-medium">
                    {current.customer_type || 'Verified Customer'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Grid of Community Reviews (Showing multiple reviews directly on the page) */}
        {reviews.length > 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-earth-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-earth-900">
                All Community Feedback ({reviews.length})
              </h3>
              <span className="text-xs font-mono text-earth-500">
                Click any review to highlight
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <div
                    key={rev.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-white border-farm-600 shadow-md ring-2 ring-farm-600/20'
                        : 'bg-white/80 border-earth-200 hover:border-earth-400 hover:bg-white shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-earth-400">
                          Verified
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-earth-800 italic line-clamp-3 leading-relaxed">
                        &ldquo;{rev.review}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-earth-100">
                      {rev.avatar_url ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-farm-600 shrink-0 shadow-xs">
                          <Image
                            src={rev.avatar_url}
                            alt={rev.customer_name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-farm-700 text-cream-100 font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-xs text-earth-900 truncate">
                          {rev.customer_name}
                        </div>
                        <div className="text-[10px] font-mono text-earth-500 truncate">
                          {rev.customer_type || 'Customer'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-earth-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-earth-400 hover:text-earth-700 hover:bg-earth-100 transition-colors"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
                Share Your Experience
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
                Write a Customer Review
              </h3>
              <p className="text-xs text-earth-600">
                Your authentic feedback helps families across Islamabad discover pure, natural dairy.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-mono uppercase text-earth-700 font-semibold mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                          aria-label={`${star} Star rating`}
                        >
                          <Star
                            className={`w-7 h-7 ${
                              filled
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-earth-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-mono font-bold text-earth-700 ml-2">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-earth-700 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Ahmed"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
                />
              </div>

              {/* Customer Type / Location */}
              <div>
                <label className="block text-xs font-mono uppercase text-earth-700 font-semibold mb-1">
                  Customer Type or Area (Optional)
                </label>
                <input
                  type="text"
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  placeholder="e.g. Shahzad Town Resident / Daily Subscriber"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
                />
              </div>

              {/* Optional Photo / Avatar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-earth-700 font-semibold">
                    Profile Photo (Optional)
                  </label>
                  <span className="text-[11px] font-mono text-earth-400">Optional</span>
                </div>

                <div className="p-3 rounded-2xl bg-cream-100/70 border border-earth-200 flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview Thumbnail or Placeholder */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-dashed border-earth-300 bg-white flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-5 h-5 text-earth-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-earth-50 border border-earth-300 text-earth-800 text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-farm-600" />
                        <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Or paste an image web link (optional)..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-earth-200 text-earth-800 placeholder-earth-400 focus:outline-none focus:ring-1 focus:ring-farm-600"
                    />
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-mono uppercase text-earth-700 font-semibold mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the milk purity, taste, thickness of malai, or doorstep delivery speed..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600 leading-relaxed"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-full bg-farm-700 hover:bg-farm-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Post Review</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 rounded-full bg-earth-100 hover:bg-earth-200 text-earth-700 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
