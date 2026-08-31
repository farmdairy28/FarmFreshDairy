import React from 'react';
import { getDeliveryRegions } from '@/lib/supabase/api';
import { DeliverySection } from '@/components/home/DeliverySection';

export const metadata = {
  title: 'Delivery Coverage — Pure Pastures Dairy',
  description: 'View our morning delivery coverage areas, timings, and free shipping options across Islamabad.',
};

export default async function DeliveryPage() {
  const regions = await getDeliveryRegions();

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            MORNING CHILLED ROUTE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Delivery Coverage
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            We operate a dedicated cold-chain delivery fleet that delivers fresh glass bottles and sealed pouches directly to your door every morning between 6:00 AM and 9:00 AM.
          </p>
        </div>
      </div>

      <DeliverySection regions={regions} />
    </div>
  );
}
