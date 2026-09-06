import React from 'react';
import { Product } from '@/lib/types';

export function ProductJsonLd({ product }: { product: Product }) {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl = product.primary_image || `${siteUrl}/images/logo.png`;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imageUrl],
    description: product.short_description || product.full_description || `${product.name} fresh from farm in Islamabad`,
    sku: product.sku || `FFD-${product.slug.toUpperCase()}`,
    mpn: product.sku || `FFD-${product.id.slice(0, 8)}`,
    brand: {
      '@type': 'Brand',
      name: 'Farm Fresh Dairy Products',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PKR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 && product.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Farm Fresh Dairy Products Islamabad',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Islamabad Capital Territory, Pakistan',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'PKR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PK',
          addressRegion: 'Islamabad Capital Territory',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
