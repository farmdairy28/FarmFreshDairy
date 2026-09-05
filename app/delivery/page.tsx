import React from 'react';
import { getDeliveryRegions } from '@/lib/supabase/api';
import { DeliverySection } from '@/components/home/DeliverySection';

export const metadata = {
  title: 'Delivery Coverage — Farm Fresh Dairy Islamabad',
  description: 'Doorstep chilled milk delivery across Islamabad with free delivery in Shahzad Town.',
};

export default async function DeliveryPage() {
  const regions = await getDeliveryRegions();

  return (
    <div className="pt-36 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-600 font-semibold">
            FREE IN SHAHZAD TOWN · DOORSTEP DELIVERY ACROSS ISLAMABAD
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Delivery Coverage
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            We operate a dedicated cold-chain delivery fleet delivering fresh milk directly to your door with morning and evening routes daily. Doorstep delivery is completely FREE in Shahzad Town; standard delivery fee applies to other areas.
          </p>
        </div>
      </div>

      <DeliverySection regions={regions} />
    </div>
  );
}
