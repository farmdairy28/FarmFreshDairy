import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';

export function JsonLd() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': ['DairyStore', 'LocalBusiness', 'FoodEstablishment'],
    '@id': `${siteUrl}/#organization`,
    name: 'Farm Fresh Dairy Products Islamabad',
    alternateName: 'Farm Fresh Dairy',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/farm-cow.jpg`,
    description: 'Farm Fresh Dairy Products delivers 100% pure, unadulterated raw cow milk, organic desi ghee, and pure dairy products across Islamabad and Rawalpindi. Free delivery in Shahzad Town, I-8, and I-9.',
    telephone: '+923109361932',
    email: 'farmfreshdairy28@gmail.com',
    priceRange: 'PKR 250 - PKR 3000',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Park Road, Chak Shahzad / Shahzad Town',
      addressLocality: 'Islamabad',
      addressRegion: 'Islamabad Capital Territory',
      postalCode: '44000',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.66913,
      longitude: 73.13563,
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Islamabad',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Rawalpindi',
      },
      {
        '@type': 'Place',
        name: 'Shahzad Town, Islamabad',
      },
      {
        '@type': 'Place',
        name: 'Chak Shahzad, Islamabad',
      },
      {
        '@type': 'Place',
        name: 'Sector I-8, Islamabad',
      },
      {
        '@type': 'Place',
        name: 'Sector I-9, Islamabad',
      },
      {
        '@type': 'Place',
        name: 'Bahria Town Islamabad/Rawalpindi',
      },
      {
        '@type': 'Place',
        name: 'DHA Islamabad',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '06:00',
        closes: '21:00',
      },
    ],
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.googleMaps,
      SOCIAL_LINKS.openStreetMap,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fresh Dairy Products & Cow Milk',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '100% Pure Fresh Cow Milk',
            description: 'Raw unpasteurized 100% pure cow milk delivered chilled in Islamabad. Free from water dilution, chemical preservatives, or urea.',
            offers: {
              '@type': 'Offer',
              price: '250',
              priceCurrency: 'PKR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Pure Desi Ghee (Bilona Method)',
            description: 'Traditional slow-churned pure cow desi ghee with rich golden aroma.',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'PKR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}
