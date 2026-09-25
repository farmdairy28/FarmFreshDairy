import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Farm Fresh Dairy Islamabad',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
