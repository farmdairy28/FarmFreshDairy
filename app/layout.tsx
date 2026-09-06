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
  title: 'Farm Fresh Dairy Products — 100% Pure & Original Cow Milk | Islamabad',
  description: 'Farm Fresh Dairy Products: 100% pure cow milk delivered straight from happy cows to your home. Lab tested, adulterant free, Rs. 250/Litre with Free Delivery in Shahzad Town.',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: 'Farm Fresh Dairy Products — 100% Pure Cow Milk | Islamabad',
    description: 'Fresh & pure cow milk straight from happy cows. Free home delivery in Shahzad Town & across Islamabad.',
    url: siteUrl,
    siteName: 'Farm Fresh Dairy Products',
    locale: 'en_US',
    type: 'website',
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
