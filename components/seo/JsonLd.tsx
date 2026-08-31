import React from 'react';

export function JsonLd() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Pure Pastures Dairy Farm',
    url: 'https://purepasturesfarm.com',
    logo: 'https://purepasturesfarm.com/logo.png',
    description: '100% pure pasture-raised fresh dairy direct from our farm to your table.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Park Road, Chak Shahzad Valley',
      addressLocality: 'Islamabad',
      addressRegion: 'Islamabad Capital Territory',
      postalCode: '44000',
      addressCountry: 'PK',
    },
    telephone: '+92-51-111-787-332',
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
