import React from 'react';

interface FarmFreshLogoProps {
  variant?: 'light' | 'dark' | 'color';
  className?: string;
  showTagline?: boolean;
}

export function FarmFreshLogo({
  variant = 'dark',
  className = '',
  showTagline = true,
}: FarmFreshLogoProps) {
  const isLight = variant === 'light';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Cow & Pasture Icon Emblem Badge */}
      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 border-2 ${
        isLight ? 'bg-white text-farm-800 border-farm-400' : 'bg-farm-800 text-white border-farm-600 shadow-farm-800/20'
      }`}>
        <svg
          viewBox="0 0 100 100"
          className="w-7 h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Cow Head Silhouette */}
          <path d="M 22 24 C 18 30 18 36 28 38 C 30 35 34 33 39 33 C 35 38 34 45 35 52 C 30 46 25 45 20 46 C 24 53 29 55 35 55 C 37 62 42 66 45 70 C 40 70 36 72 36 76 C 36 81 44 83 50 83 C 56 83 64 81 64 76 C 64 72 60 70 55 70 C 58 66 63 62 65 55 C 71 55 76 53 80 46 C 75 45 70 46 65 52 C 66 45 65 38 61 33 C 66 33 70 35 72 38 C 82 36 82 30 78 24 C 70 29 65 30 58 31 C 55 27 50 26 50 26 C 50 26 45 27 42 31 C 35 30 30 29 22 24 Z" />
          {/* Leaf green pasture detail */}
          <path d="M 43 73 C 44 71 47 71 48 73 C 48 74 46 75 44 75 C 43 75 43 74 43 73 Z" fill="#22C55E" opacity="0.9" />
          <path d="M 57 73 C 56 71 53 71 52 73 C 52 74 54 75 56 75 C 57 75 57 74 57 73 Z" fill="#22C55E" opacity="0.9" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-serif font-black tracking-tight text-lg sm:text-xl ${
            isLight ? 'text-white' : 'text-farm-900'
          }`}>
            Farm Fresh
          </span>
          <span className={`font-serif font-medium tracking-wide text-xs sm:text-sm ${
            isLight ? 'text-farm-300' : 'text-farm-600 font-bold'
          }`}>
            Dairy
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] tracking-wider uppercase font-mono font-semibold ${
              isLight ? 'text-farm-200/90' : 'text-farm-700'
            }`}>
              Pure · Natural · Healthy
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
