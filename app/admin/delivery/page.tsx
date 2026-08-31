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
        <p className="text-xs text-slate-500 font-mono">Configure delivery cities, regions, and morning routes</p>
      </div>

      <div className="space-y-6">
        {regions.map((reg) => (
          <div key={reg.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {reg.name} ({reg.areas.length} Areas)
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-bold">
                Free Delivery Route
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reg.areas.map((area) => (
                <div key={area.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                  {area.name}
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{area.timing_info}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
