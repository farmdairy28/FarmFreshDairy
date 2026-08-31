'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { HomepageHero, HomepagePromise } from '@/lib/types';
import { getHomepageHero, saveHomepageHero, getHomepagePromise, saveHomepagePromise } from '@/lib/supabase/api';

export default function AdminContentPage() {
  const [hero, setHero] = useState<HomepageHero | null>(null);
  const [promise, setPromise] = useState<HomepagePromise | null>(null);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHomepageHero().then(setHero);
    getHomepagePromise().then(setPromise);
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setLoading(true);
    await saveHomepageHero(hero);
    setLoading(false);
    setSavedMessage('Hero section updated! Changes are live on the public landing page.');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleSavePromise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promise) return;
    setLoading(true);
    await saveHomepagePromise(promise);
    setLoading(false);
    setSavedMessage('Our Promise section updated! Changes are live on the public landing page.');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  if (!hero || !promise) return <div className="p-8 text-xs text-slate-500 font-mono">Loading CMS data...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Homepage Content CMS</h2>
        <p className="text-xs text-slate-500 font-mono">Edit homepage copy, headings, eyebrows, and hero stats in real-time</p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {savedMessage}
        </div>
      )}

      {/* Hero CMS Form */}
      <form onSubmit={handleSaveHero} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          1. Hero Section CMS Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Primary CTA Text
            </label>
            <input
              type="text"
              value={hero.primaryCtaText}
              onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Main Editorial Heading
          </label>
          <input
            type="text"
            value={hero.heading}
            onChange={(e) => setHero({ ...hero, heading: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Hero Paragraph
          </label>
          <textarea
            rows={3}
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Hero Image URL
          </label>
          <input
            type="text"
            value={hero.imageUrl || ''}
            onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Update Hero Section
        </button>
      </form>

      {/* Promise CMS Form */}
      <form onSubmit={handleSavePromise} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          2. Our Promise Section CMS Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={promise.eyebrow}
              onChange={(e) => setPromise({ ...promise, eyebrow: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Promise Headline
            </label>
            <input
              type="text"
              value={promise.heading}
              onChange={(e) => setPromise({ ...promise, heading: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Subtitle Statement
          </label>
          <input
            type="text"
            value={promise.subtitle}
            onChange={(e) => setPromise({ ...promise, subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Promise Description
          </label>
          <textarea
            rows={3}
            value={promise.description}
            onChange={(e) => setPromise({ ...promise, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Update Promise Section
        </button>
      </form>

    </div>
  );
}
