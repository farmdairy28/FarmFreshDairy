import React from 'react';
import { Metadata } from 'next';
import { getDeliveryRegions } from '@/lib/supabase/api';
import { DeliverySection } from '@/components/home/DeliverySection';
import { FaqSection } from '@/components/home/FaqSection';

export const metadata: Metadata = {
  title: 'Fresh Milk Home Delivery Islamabad — Coverage & Timings | Farm Fresh Dairy',
  description: '100% pure cow milk home delivery across Islamabad & Rawalpindi. 100% FREE delivery in Shahzad Town, Sector I-8 & I-9. Morning (6-9 AM) and evening routes daily.',
  keywords: [
    'milk home delivery islamabad',
    'fresh milk delivery islamabad timings',
    'raw milk delivery rawalpindi',
    'free milk delivery shahzad town',
    'milk delivery i-8 islamabad',
    'milk delivery i-9 islamabad',
    'milk delivery bahria town islamabad',
    'milk delivery dha islamabad',
  ],
  alternates: {
    canonical: 'https://www.farmfreshdairyproducts.com/delivery',
  },
  openGraph: {
    title: 'Fresh Milk Home Delivery Islamabad — Coverage & Timings | Farm Fresh Dairy',
    description: 'Chilled doorstep cow milk delivery in Islamabad. Free in Shahzad Town, I-8 & I-9. Morning (6-9 AM) & evening slots.',
    url: 'https://www.farmfreshdairyproducts.com/delivery',
  },
};

export default async function DeliveryPage() {
  const regions = await getDeliveryRegions();

  return (
    <div className="pt-36 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-600 font-semibold">
            FREE IN SHAHZAD TOWN, I-8 &amp; I-9 · ALL ISLAMABAD SECTORS VIA RIDER
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Fresh Milk Delivery Coverage &amp; Schedule in Islamabad
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            We operate a dedicated cold-chain delivery fleet delivering fresh milk directly to your door with morning and evening routes daily. Doorstep delivery is completely FREE in Shahzad Town, I-8 Sector, and I-9 Sector. For all other sectors across Islamabad (including F-6 to F-11, G-6 to G-13, E-7 to E-11, DHA, and Bahria Town), delivery is dispatched via dedicated riders.
          </p>
        </div>
      </div>

      <DeliverySection regions={regions} />

      <div className="mt-12">
        <FaqSection />
      </div>
    </div>
  );
}
