import React, { Suspense } from 'react';
import { OrderSuccessClient } from './success-client';

export const metadata = {
  title: 'Order Confirmed — Farm Fresh Dairy',
  description: 'Your morning doorstep milk delivery order has been successfully placed.',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="text-center py-20 bg-cream-200/50 rounded-3xl border border-earth-200 space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full border-4 border-farm-200 border-t-farm-700 animate-spin mx-auto"></div>
              <p className="text-earth-700 text-sm font-semibold">Loading your order confirmation...</p>
            </div>
          }
        >
          <OrderSuccessClient />
        </Suspense>
      </div>
    </div>
  );
}
