'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdminAction } from '@/app/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    urlError === 'missing_config'
      ? 'Supabase credentials are not configured.'
      : urlError === 'unauthorized'
      ? 'Access denied: You do not have administrator permissions.'
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await loginAdminAction(formData);

    if (result.success) {
      router.push(redirectUrl);
      router.refresh();
    } else {
      setError(result.error || 'Authentication failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 space-y-6">
      {/* Header Logo */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-serif font-bold text-2xl mx-auto flex items-center justify-center shadow-md">
          F
        </div>
        <h1 className="font-bold text-2xl text-slate-900">Admin Portal Login</h1>
        <p className="text-xs text-slate-500 font-mono">Farm Fresh Dairy CMS Management</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmfreshdairy28@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm uppercase transition-colors shadow-md"
        >
          {isSubmitting ? 'Authenticating with Supabase...' : 'Sign In To Dashboard'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Protected with Supabase Auth & Role-Based Access Control.</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-xs font-mono">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
