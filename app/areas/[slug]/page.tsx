import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';
import { DELIVERY_AREAS, getAreaBySlug } from '@/lib/seo/deliveryAreas';
import { BreadcrumbsJsonLd } from '@/components/seo/BreadcrumbsJsonLd';
import { FaqSection } from '@/components/home/FaqSection';
import { SOCIAL_LINKS } from '@/lib/constants';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return DELIVERY_AREAS.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const area = getAreaBySlug(params.slug);
  if (!area) return { title: 'Area Not Found | Farm Fresh Dairy' };

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');
  const areaUrl = `${siteUrl}/areas/${area.slug}`;
  const title = `Fresh Pure Cow Milk Delivery in ${area.name}, ${area.city} | Farm Fresh Dairy`;
  const description = `Get 100% pure, unadulterated fresh cow milk delivered chilled to your doorstep in ${area.shortName}, ${area.city}. ${area.deliveryFee}. Morning routes (${area.deliveryTimeMorning}). Rs. 250/Litre.`;

  return {
    title,
    description,
    keywords: [
      `cow milk delivery in ${area.shortName.toLowerCase()}`,
      `fresh milk in ${area.shortName.toLowerCase()}`,
      `milk home delivery ${area.shortName.toLowerCase()} ${area.city.toLowerCase()}`,
      `pure milk ${area.city.toLowerCase()}`,
      `desi ghee ${area.shortName.toLowerCase()}`,
      'raw cow milk islamabad',
    ],
    alternates: {
      canonical: areaUrl,
    },
    openGraph: {
      title,
      description,
      url: areaUrl,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/logo.png`,
          width: 800,
          height: 600,
          alt: `Farm Fresh Dairy Milk Delivery in ${area.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/images/logo.png`],
    },
  };
}

export default function AreaDeliveryPage({ params }: { params: { slug: string } }) {
  const area = getAreaBySlug(params.slug);
  if (!area) notFound();

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');
  const areaUrl = `${siteUrl}/areas/${area.slug}`;

  // Structured Data Schema for Local Delivery Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'DeliveryService',
    name: `Fresh Cow Milk Delivery in ${area.name}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Farm Fresh Dairy Products Islamabad',
      url: siteUrl,
      telephone: '+923109361932',
      image: `${siteUrl}/images/logo.png`,
    },
    areaServed: {
      '@type': 'Place',
      name: `${area.name}, ${area.city}`,
    },
    serviceType: 'Fresh Cow Milk & Dairy Doorstep Delivery',
    termsOfService: `${area.deliveryFee} for ${area.name}`,
    offers: {
      '@type': 'Offer',
      price: '250',
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbs = [
    { name: 'Home', item: siteUrl },
    { name: 'Delivery Coverage', item: `${siteUrl}/delivery` },
    { name: area.shortName, item: areaUrl },
  ];

  const otherAreas = DELIVERY_AREAS.filter((a) => a.slug !== area.slug);

  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      {/* Schema.org Breadcrumb & Service Schemas */}
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-earth-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-farm-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-earth-400" />
          <Link href="/delivery" className="hover:text-farm-800 transition-colors">
            Delivery Areas
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-earth-400" />
          <span className="text-farm-900 font-bold">{area.shortName}</span>
        </nav>

        {/* Hero Section for Hyper-Local Area */}
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-farm-950 via-farm-900 to-farm-800 text-white shadow-float mb-16 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-yellow text-farm-950 text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {area.deliveryFee}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 text-sky-100 text-xs font-mono font-semibold border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                {area.city}, Pakistan
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Fresh Cow Milk Delivery in <span className="text-brand-yellow">{area.name}</span>
            </h1>

            <p className="text-sky-100 text-base sm:text-lg leading-relaxed max-w-2xl">
              {area.description} Chilled to 4°C within 15 minutes of milking and delivered direct to your door every morning and evening.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={`https://wa.me/923109361932?text=${encodeURIComponent(`Hello Farm Fresh Dairy! I want to order pure cow milk delivery in ${area.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Order via WhatsApp (0310-9361932)
              </a>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-cream-100 text-earth-900 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Order Online
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="tel:03109361932"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-farm-800/80 hover:bg-farm-700 text-white font-semibold text-xs border border-farm-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-brand-yellow" />
                0310-9361932
              </a>
            </div>
          </div>
        </div>

        {/* 3 Key Operational Pillars for this Sector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Delivery Schedule */}
          <div className="p-8 rounded-3xl bg-white border border-earth-200 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-farm-700" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              Delivery Timings
            </h2>
            <div className="space-y-2 text-sm text-earth-700 font-mono">
              <div className="flex items-center justify-between py-1 border-b border-earth-100">
                <span className="text-earth-500">Morning Slot:</span>
                <span className="font-bold text-farm-900">{area.deliveryTimeMorning}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-earth-100">
                <span className="text-earth-500">Evening Slot:</span>
                <span className="font-bold text-farm-900">{area.deliveryTimeEvening}</span>
              </div>
            </div>
            <p className="text-xs text-earth-500">
              Freshly milked and dispatched in insulated crates so the milk arrives cold and fresh.
            </p>
          </div>

          {/* Card 2: Price & Purity Guarantee */}
          <div className="p-8 rounded-3xl bg-white border border-earth-200 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              Pure Cow Milk: Rs. 250/L
            </h2>
            <ul className="space-y-2 text-xs text-earth-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Negative for urea, formalin &amp; water</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pasture-fed Holstein &amp; Jersey herd</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Natural thick cream layer (malai)</span>
              </li>
            </ul>
            <div className="pt-1 text-xs font-mono font-bold text-farm-800">
              Status: {area.deliveryType}
            </div>
          </div>

          {/* Card 3: Key Landmarks Covered */}
          <div className="p-8 rounded-3xl bg-white border border-earth-200 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              Coverage Landmarks
            </h2>
            <div className="flex flex-wrap gap-2">
              {area.landmarks.map((landmark, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-cream-200/80 text-earth-800 text-xs font-mono font-semibold border border-earth-300/60"
                >
                  {landmark}
                </span>
              ))}
            </div>
            <p className="text-xs text-earth-500">
              Our riders deliver directly to apartments, houses, and offices in this zone.
            </p>
          </div>

        </div>

        {/* Popular Dairy Products for this Zone */}
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft mb-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-bold">
                FARM DIRECT IN {area.shortName.toUpperCase()}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900 mt-1">
                Popular Dairy Selections
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-farm-800 hover:text-farm-900 transition-colors"
            >
              Explore All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {area.popularProducts.map((prod, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-earth-200 shadow-xs flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  ✓
                </div>
                <div className="text-xs font-bold text-earth-900">
                  {prod}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <FaqSection />
        </div>

        {/* Other Areas Navigation Grid for Internal Linking */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-earth-200 shadow-soft space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-farm-600 font-bold">
              EXPLORE ALL COVERAGE REGIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
              Other Delivery Areas in Islamabad &amp; Rawalpindi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherAreas.map((other) => (
              <Link
                key={other.slug}
                href={`/areas/${other.slug}`}
                className="p-4 rounded-2xl bg-cream-50 hover:bg-farm-50 border border-earth-200 hover:border-farm-300 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-farm-700 font-bold uppercase">
                    {other.city} · {other.deliveryFee}
                  </div>
                  <div className="font-serif font-bold text-earth-900 group-hover:text-farm-900 text-sm mt-0.5">
                    {other.name}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-earth-400 group-hover:text-farm-700 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
