'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 bg-cream-100">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-cream-200/60 border border-earth-200 shadow-soft space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-bold">
            Farm Fresh Dairy Desk
          </span>
          <h2 className="font-serif text-3xl font-bold text-earth-900">
            Something went wrong
          </h2>
          <p className="text-earth-600 text-xs leading-relaxed">
            We encountered a temporary hiccup while fetching fresh farm data. Please try refreshing or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-farm-700 hover:bg-farm-800 text-cream-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-cream-100 hover:bg-cream-200 text-earth-800 text-xs font-bold uppercase tracking-wider transition-colors border border-earth-300"
          >
            <Home className="w-3.5 h-3.5" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
