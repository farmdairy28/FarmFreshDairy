import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream-100 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-farm-200 border-t-farm-700 animate-spin"></div>
        <span className="text-xs font-mono uppercase tracking-widest text-farm-800 font-semibold">
          Loading Pure Pastures...
        </span>
      </div>
    </div>
  );
}
