'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Plus } from 'lucide-react';
import { DeliveryRegion } from '@/lib/types';
import { getDeliveryRegions } from '@/lib/supabase/api';

export default function AdminDeliveryPage() {
  const [regions, setRegions] = useState<DeliveryRegion[]>([]);

  useEffect(() => {
    getDeliveryRegions().then(setRegions);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Delivery Coverage CMS</h2>
        <p className="text-xs text-slate-500 font-mono">Configure delivery cities, regions, and morning &amp; evening routes</p>
      </div>

      <div className="space-y-6">
        {regions.map((reg) => (
          <div key={reg.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {reg.name} ({reg.areas.length} Areas)
              </h3>
              <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold ${
                reg.areas.some(a => a.name.toLowerCase().includes('shahzad town') && !a.name.toLowerCase().includes('chak shahzad'))
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {reg.areas.some(a => a.name.toLowerCase().includes('shahzad town') && !a.name.toLowerCase().includes('chak shahzad'))
                  ? 'Free Route (Shahzad Town)'
                  : 'Via Rider Route'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reg.areas.map((area) => {
                const isShahzad = area.name.toLowerCase().includes('shahzad town') && !area.name.toLowerCase().includes('chak shahzad');

                return (
                  <div key={area.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1.5">
                      <span>{area.name}</span>
                      {isShahzad ? (
                        <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold shrink-0">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                          Via Rider
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">{area.timing_info}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
