import React from 'react';
import Image from 'next/image';

interface FarmFreshLogoProps {
  variant?: 'light' | 'dark' | 'color';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FarmFreshLogo({
  variant = 'dark',
  className = '',
  showTagline = true,
  size = 'md',
}: FarmFreshLogoProps) {
  const isLight = variant === 'light';
  
  const dimMap = {
    sm: { img: 40, container: 'w-10 h-10', title: 'text-base', sub: 'text-xs' },
    md: { img: 52, container: 'w-12 h-12 sm:w-13 sm:h-13', title: 'text-lg sm:text-xl', sub: 'text-xs sm:text-sm' },
    lg: { img: 64, container: 'w-14 h-14 sm:w-16 sm:h-16', title: 'text-xl sm:text-2xl', sub: 'text-sm sm:text-base' },
  };

  const curr = dimMap[size] || dimMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Farm Fresh Dairy Products Emblem Seal */}
      <div className={`relative ${curr.container} rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm shrink-0 transition-transform group-hover:scale-105 border-2 ${
        isLight ? 'border-emerald-400/80 shadow-farm-950/20' : 'border-emerald-700/80 shadow-emerald-950/10'
      }`}>
        <Image
          src="/images/logo.png"
          alt="Farm Fresh Dairy Products Logo"
          width={curr.img * 2}
          height={curr.img * 2}
          className="w-full h-full object-cover object-center scale-[1.03]"
          priority
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-serif font-black tracking-tight ${curr.title} ${
            isLight ? 'text-white' : 'text-farm-900'
          }`}>
            Farm Fresh
          </span>
          <span className={`font-serif font-bold tracking-wide ${curr.sub} ${
            isLight ? 'text-farm-300' : 'text-farm-700'
          }`}>
            Dairy Products
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5 leading-none">
            <span className={`text-[10px] sm:text-[11px] tracking-wider uppercase font-mono font-semibold ${
              isLight ? 'text-emerald-300/90' : 'text-emerald-700'
            }`}>
              Pure · Natural · Healthy
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
