import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { JsonLd } from '@/components/seo/JsonLd';
import { FloatingContactWidget } from '@/components/layout/FloatingContactWidget';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: {
    template: '%s | Farm Fresh Dairy Products Islamabad',
    default: 'Farm Fresh Dairy Products Islamabad | 100% Pure Cow Milk Delivery',
  },
  description: 'Get 100% pure, unadulterated fresh cow milk delivered daily in Islamabad & Rawalpindi. Free delivery in Shahzad Town, I-8 & I-9. Certified chemical-free, Rs. 250/Litre.',
  keywords: [
    'cow milk in islamabad',
    'fresh milk delivery islamabad',
    'pure cow milk rawalpindi',
    'organic dairy products islamabad',
    'best milk shop islamabad',
    'desi ghee rawalpindi islamabad',
    'raw milk home delivery islamabad',
    'pure milk shahzad town',
    'fresh cow milk chak shahzad',
    'unpasteurized pure milk islamabad',
    'farm fresh dairy products',
    'milk delivery bahria town islamabad',
    'milk delivery dha islamabad',
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-icon.png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Farm Fresh Dairy Products Islamabad | 100% Pure Cow Milk Delivery',
    description: 'Fresh & pure cow milk straight from pasture cows to your doorstep in Islamabad & Rawalpindi. Free delivery in Shahzad Town, I-8 & I-9.',
    url: siteUrl,
    siteName: 'Farm Fresh Dairy Products Islamabad',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Farm Fresh Dairy Products Islamabad - 100% Pure Cow Milk Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Fresh Dairy Products Islamabad | 100% Pure Cow Milk Delivery',
    description: '100% pure cow milk delivered to your door in Islamabad. Free delivery in Shahzad Town, I-8 & I-9. Rs. 250/L.',
    images: [`${siteUrl}/images/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-cream-100 text-earth-900 selection:bg-farm-600 selection:text-white">
        <CartProvider>
          <JsonLd />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingContactWidget />
        </CartProvider>
      </body>
    </html>
  );
}
