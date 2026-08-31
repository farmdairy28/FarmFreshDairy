import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Admin Dashboard — Pure Pastures Dairy',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
