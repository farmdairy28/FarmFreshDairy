import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/supabase/api';
import { DELIVERY_AREAS } from '@/lib/seo/deliveryAreas';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');
  const products = await getProducts();

  const staticRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/delivery', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/about', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/process', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  const staticUrls = staticRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  const areaUrls = DELIVERY_AREAS.map((area) => ({
    url: `${baseUrl}/areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...productUrls, ...areaUrls];
}
