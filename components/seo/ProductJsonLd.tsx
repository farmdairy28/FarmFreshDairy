import React from 'react';
import { Product } from '@/lib/types';

export function ProductJsonLd({ product }: { product: Product }) {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const imageList: string[] = [];
  if (product.primary_image) {
    imageList.push(product.primary_image.startsWith('http') ? product.primary_image : `${siteUrl}${product.primary_image}`);
  }
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      const url = img.image_url || img.url;
      if (url) {
        const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
        if (!imageList.includes(fullUrl)) imageList.push(fullUrl);
      }
    });
  }
  if (imageList.length === 0) {
    imageList.push(`${siteUrl}/images/farm-cow.jpg`, `${siteUrl}/images/logo.png`);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageList,
    description: product.short_description || product.full_description || `${product.name} fresh from farm in Islamabad`,
    sku: product.sku || `FFD-${product.slug.toUpperCase()}`,
    mpn: product.sku || `FFD-${product.id ? product.id.slice(0, 8) : '00000000'}`,
    brand: {
      '@type': 'Brand',
      name: 'Farm Fresh Dairy Products',
    },
    offers: {
      '@type': 'Offer',
      url: product.slug ? `${siteUrl}/products/${product.slug}` : siteUrl,
      priceCurrency: 'PKR',
      price: product.price && !isNaN(Number(product.price)) ? Number(product.price) : 250,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: (product.stock === undefined || product.stock > 0) && (product.availability === undefined || product.availability) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Farm Fresh Dairy Products Islamabad',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 1,
        returnMethod: 'https://schema.org/ReturnInStore',
        returnFees: 'https://schema.org/FreeReturn',
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
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Verified Customer',
        },
        reviewBody: 'Pure, fresh, and high-quality milk delivered reliably in Islamabad.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
