import React from 'react';
import { getDeliveryRegions } from '@/lib/supabase/api';
import { CheckoutClient } from './checkout-client';

export const metadata = {
  title: 'Checkout — Farm Fresh Dairy',
  description: 'Complete your morning doorstep milk delivery order.',
};

export default async function CheckoutPage() {
  const regions = await getDeliveryRegions();

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            FINAL STEP
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Delivery Details & Checkout
          </h1>
          <p className="text-earth-600 text-base">
            Please provide your morning delivery address and contact details. Payment is Cash on Delivery.
          </p>
        </div>

        <CheckoutClient regions={regions} />

      </div>
    </div>
  );
}
