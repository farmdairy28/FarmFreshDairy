import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { JsonLd } from '@/components/seo/JsonLd';

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

export const metadata: Metadata = {
  title: 'Pure Pastures Farm — 100% Pure Pasture Dairy Direct to Doorstep',
  description: 'Pasture-raised, unadulterated fresh milk, clay-pot dahi, desi ghee, and organic butter delivered straight from our farm to your family table.',
  metadataBase: new URL('https://purepasturesfarm.com'),
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: 'Pure Pastures Farm — Pure Dairy Direct to Doorstep',
    description: '100% pure pasture-raised fresh dairy delivered daily.',
    url: 'https://purepasturesfarm.com',
    siteName: 'Pure Pastures Farm',
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
      <body className="min-h-screen flex flex-col antialiased font-sans bg-cream-100 text-earth-900 selection:bg-farm-600 selection:text-cream-100">
        <CartProvider>
          <JsonLd />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
