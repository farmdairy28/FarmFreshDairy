'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Star,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { getAllReviewsAdmin } from '@/lib/supabase/api';
import { deleteReviewAction, toggleReviewStatusAction } from '@/app/actions/reviews';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviewsAdmin();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the review from "${name}"? This action cannot be undone.`);
    if (!confirmed) return;

    setActionLoading(id);
    setMessage(null);

    try {
      const res = await deleteReviewAction(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setMessage({ text: `Review from "${name}" has been permanently deleted.`, type: 'success' });
      } else {
        setMessage({ text: res.error || 'Failed to delete review.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err?.message || 'Error occurred while deleting review.', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      const res = await toggleReviewStatusAction(id, !currentStatus);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_active: !currentStatus } : r))
        );
        setMessage({
          text: `Review is now ${!currentStatus ? 'Visible' : 'Hidden'} on storefront.`,
          type: 'success',
        });
      }
    } catch (err) {
      setMessage({ text: 'Failed to update review status.', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customer_type && r.customer_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.review.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating === 'all' || r.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '0.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const withPhotoCount = reviews.filter((r) => Boolean(r.avatar_url)).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews Management</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Monitor, moderate, and delete reviews submitted by customers across Islamabad
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            Total Reviews
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalReviews}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>Community feedback</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            Average Rating
          </div>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>{avgRating}</span>
            <span className="text-amber-500 text-lg">★</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Out of 5.0 maximum</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            5-Star Reviews
          </div>
          <div className="text-2xl font-bold text-emerald-700">{fiveStarCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0}% of all reviews
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            With Profile Photo
          </div>
          <div className="text-2xl font-bold text-slate-900">{withPhotoCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Optional customer photos</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, area, or review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Rating Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterRating === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            return (
              <button
                key={stars}
                onClick={() => setFilterRating(stars)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  filterRating === stars
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{stars}</span>
                <span className="text-[10px]">★</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
            Loading customer reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">No reviews found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || filterRating !== 'all'
                ? 'No reviews match your current filter or search keyword.'
                : 'Customer reviews will appear here once submitted on the storefront.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((rev) => {
              const isBusy = actionLoading === rev.id;

              return (
                <div
                  key={rev.id}
                  className={`p-6 transition-colors hover:bg-slate-50/70 flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                    rev.is_active === false ? 'opacity-60 bg-slate-50/50' : ''
                  }`}
                >
                  {/* Left: Customer Info & Review */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Customer Avatar / Photo */}
                    <div className="shrink-0">
                      {rev.avatar_url ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rev.avatar_url}
                            alt={rev.customer_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold text-base flex items-center justify-center shadow-xs">
                          {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Name, Type & Verified */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {rev.customer_name}
                        </span>
                        {rev.customer_type && (
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {rev.customer_type}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                        {rev.is_active === false && (
                          <span className="text-[10px] font-mono text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                            Hidden from Storefront
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (rev.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-mono font-bold text-slate-600 ml-1.5">
                          {rev.rating || 5}.0 Stars
                        </span>
                        {rev.created_at && (
                          <span className="text-[10px] font-mono text-slate-400 ml-2">
                            • {new Date(rev.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Review Quote */}
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                        &ldquo;{rev.review}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleStatus(rev.id, rev.is_active !== false)}
                      disabled={isBusy}
                      title={rev.is_active !== false ? 'Hide Review' : 'Show Review'}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      {rev.is_active !== false ? (
                        <>
                          <EyeOff className="w-4 h-4 text-slate-500" />
                          <span className="hidden sm:inline text-[11px]">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span className="hidden sm:inline text-[11px] text-emerald-600">Show</span>
                        </>
                      )}
                    </button>

                    {/* Delete Review Button */}
                    <button
                      onClick={() => handleDelete(rev.id, rev.customer_name)}
                      disabled={isBusy}
                      title="Delete Review Permanently"
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span className="text-[11px] font-bold">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
