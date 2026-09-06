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
      {/* Cow & Pasture Icon Emblem Badge (Matching Official Brand Artwork) */}
      <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 overflow-hidden border-2 ${
        isLight ? 'bg-white border-farm-400' : 'bg-white border-farm-700 shadow-farm-900/10'
      }`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Badge Background */}
          <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
          
          {/* Top Green Arch Ring */}
          <path
            d="M 12 50 A 38 38 0 0 1 88 50"
            fill="none"
            stroke="#0B532C"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Holstein Dairy Cow Illustration */}
          {/* Cow Head & Body Silhouette */}
          <path
            d="M 32 30 C 26 34 24 40 30 45 C 33 42 37 40 42 40 C 39 46 39 52 40 58 C 36 53 31 52 26 53 C 29 60 34 62 40 62 C 42 68 47 72 50 75 C 53 72 58 68 60 62 C 66 62 71 60 74 53 C 69 52 64 53 60 58 C 61 52 61 46 58 40 C 63 40 67 42 70 45 C 76 40 74 34 68 30 C 62 34 58 35 53 36 C 50 33 50 33 47 36 C 42 35 38 34 32 30 Z"
            fill="#0F172A"
          />

          {/* Cow White Face Blaze & Ears */}
          <path
            d="M 46 38 C 45 44 44 52 45 58 C 47 64 50 67 53 67 C 55 64 56 58 55 52 C 55 45 54 38 46 38 Z"
            fill="#FFFFFF"
          />
          {/* Muzzle */}
          <ellipse cx="50" cy="65" rx="7" ry="4.5" fill="#FCE7F3" />
          <circle cx="47" cy="65" r="1.2" fill="#334155" />
          <circle cx="53" cy="65" r="1.2" fill="#334155" />

          {/* Horns */}
          <path d="M 33 33 C 31 27 34 22 38 23 C 37 26 36 29 35 32 Z" fill="#D97706" />
          <path d="M 67 33 C 69 27 66 22 62 23 C 63 26 64 29 65 32 Z" fill="#D97706" />

          {/* Layered Green Pastures & Rolling Hills */}
          <path
            d="M 6 76 Q 28 64 50 70 Q 72 76 94 66 L 94 94 Q 50 98 6 94 Z"
            fill="#15803D"
          />
          <path
            d="M 4 80 Q 30 70 56 76 Q 80 82 96 74 L 96 96 L 4 96 Z"
            fill="#0B532C"
          />
          <path
            d="M 8 86 Q 35 78 62 82 Q 85 86 92 82 L 92 96 L 8 96 Z"
            fill="#22C55E"
          />

          {/* Fresh Green Twin Leaves on Top Badge */}
          <path
            d="M 50 14 C 44 8 38 12 40 18 C 44 19 49 17 50 14 Z"
            fill="#22C55E"
          />
          <path
            d="M 50 14 C 56 8 62 12 60 18 C 56 19 51 17 50 14 Z"
            fill="#15803D"
          />
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
          <span className={`font-serif font-bold tracking-wide text-xs sm:text-sm ${
            isLight ? 'text-farm-300' : 'text-farm-700'
          }`}>
            Dairy Products
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-1 leading-none">
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
