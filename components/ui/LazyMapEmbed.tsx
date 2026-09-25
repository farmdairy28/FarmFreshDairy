'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface LazyMapEmbedProps {
  src: string;
  title: string;
  containerClassName?: string;
  badgeLabel?: string;
}

export function LazyMapEmbed({
  src,
  title,
  containerClassName = 'relative h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-lg bg-farm-950',
  badgeLabel = 'Chak Shahzad, Islamabad',
}: LazyMapEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={containerClassName}>
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-farm-950/90 text-cream-200 p-6 space-y-3 select-none">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-emerald-300 font-semibold tracking-wider uppercase">
            Loading Interactive Farm Map...
          </span>
        </div>
      )}

      {/* Floating Badge */}
      <div className="absolute top-3 right-3 bg-farm-950/85 backdrop-blur-sm text-[10px] font-mono text-sky-200 px-2.5 py-1 rounded-lg border border-farm-700 flex items-center gap-1.5 shadow-sm pointer-events-none z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{badgeLabel}</span>
      </div>
    </div>
  );
}
