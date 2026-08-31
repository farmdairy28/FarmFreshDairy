'use client';

import React from 'react';

export function BrandMarquee() {
  const items = [
    "Naturally Pure",
    "Farm Fresh",
    "Raised With Care",
    "Honest Farming",
    "Rich & Wholesome",
    "Zero Chemicals",
    "Chilled Morning Delivery",
    "Grass-Fed Herds"
  ];

  return (
    <div className="w-full max-w-full py-6 bg-farm-900 text-cream-100 overflow-hidden border-y border-farm-800 select-none">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-6 gap-6">
            <span className="font-serif font-semibold text-lg tracking-wider text-cream-200 uppercase">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-farm-500"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
