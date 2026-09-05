import React from 'react';

export function JsonLd() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Farm Fresh Dairy',
    url: 'https://farmfreshdairy.pk',
    logo: 'https://farmfreshdairy.pk/logo.png',
    description: '100% pure cow milk delivered direct from happy cows to your home. Lab certified adulterant-free.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Park Road, Shahzad Town',
      addressLocality: 'Islamabad',
      addressRegion: 'Islamabad Capital Territory',
      postalCode: '44000',
      addressCountry: 'PK',
    },
    telephone: '+92-310-9361932',
    servesCuisine: 'Organic Dairy Products',
    priceRange: '$$',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}
