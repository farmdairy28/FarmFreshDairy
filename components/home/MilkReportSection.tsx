'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Award, 
  Sparkles, 
  FlaskConical, 
  PhoneCall, 
  MessageCircle,
  Download,
  Info
} from 'lucide-react';

export function MilkReportSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'composition' | 'adulterants'>('all');

  const compositionParameters = [
    {
      parameter: 'Lactometer Reading',
      sampleValue: '28',
      normalRange: '27 – 32',
      status: 'Passed / Pure',
      description: 'Density indicator verifying natural purity without excess dilution.',
    },
    {
      parameter: 'Total Solids (%)',
      sampleValue: '11.86%',
      normalRange: '12 – 14%',
      status: 'Optimal',
      description: 'Complete nutritional solids of natural raw whole cow milk.',
    },
    {
      parameter: 'Fat (%)',
      sampleValue: '3.8%',
      normalRange: '3.5 – 5.0%',
      status: 'Rich & Creamy',
      description: 'Natural wholesome butterfat layer essential for taste and health.',
    },
    {
      parameter: 'Solids-not-fat (SNF %)',
      sampleValue: '8.06%',
      normalRange: '8.5 – 9.5%',
      status: 'Natural Balance',
      description: 'Proteins, lactose, and minerals naturally present.',
    },
    {
      parameter: 'Water Content (%)',
      sampleValue: '88.14%',
      normalRange: '85 – 88%',
      status: 'Natural Hydration',
      description: 'Natural hydration ratio straight from healthy pasture cows.',
    },
  ];

  const adulterantTests = [
    { name: 'Urea Test', result: 'Negative', passed: true },
    { name: 'Neutralizer (Soda / Alkalis)', result: 'Negative', passed: true },
    { name: 'Bleaching Agent', result: 'Negative', passed: true },
    { name: 'Formalin (Chemical Preservative)', result: 'Negative', passed: true },
    { name: 'Added Salt / Sugar', result: 'Negative', passed: true },
    { name: 'Boric Acid', result: 'Negative', passed: true },
    { name: 'Hydrogen Peroxide', result: 'Negative', passed: true },
    { name: 'Detergent & Surfactants', result: 'Negative', passed: true },
  ];

  const hashtags = [
    '#FarmFreshDairy',
    '#MilkReport',
    '#QualityTested',
    '#PureMilk',
    '#FreshMilk',
    '#Certified',
    '#AdulterantFree',
    '#HealthyLiving',
    '#TrustYourDairy',
    '#LabTested'
  ];

  return (
    <section id="milk-report" className="relative py-24 bg-gradient-to-b from-farm-100 via-white to-farm-100/60 border-t border-farm-200/80 overflow-hidden">
      {/* Decorative Sky Blue Splash Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-farm-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-farm-600 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            OFFICIAL LAB QUALITY VERIFICATION
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-earth-900 leading-tight">
            Our Latest Milk Quality Report
          </h2>

          <p className="text-earth-600 text-base sm:text-lg leading-relaxed">
            Our latest milk report is in! We are committed to delivering pure, wholesome milk, and this lab test confirms our strict dedication to quality, safety, and 100% adulterant-free purity.
          </p>

          {/* Social Hashtags Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {hashtags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white text-farm-700 font-semibold border border-farm-200/80 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Hero Card with Blue Splash Header */}
        <div className="bg-white rounded-3xl border border-farm-200 shadow-float overflow-hidden mb-12">
          
          {/* Blue Header Banner */}
          <div className="bg-gradient-to-r from-farm-700 via-farm-600 to-farm-800 text-white p-6 sm:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-200 font-semibold">
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Farm Fresh Dairy · Certified Batch Testing
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  MILK REPORT & PURITY AUDIT
                </h3>
                <p className="text-sky-100 text-sm max-w-xl">
                  Tested under standard laboratory protocols. Zero synthetic preservatives, zero water dilution, 100% natural pasture cow milk.
                </p>
              </div>

              {/* Certified Stamp */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 self-start md:self-auto shrink-0">
                <Award className="w-9 h-9 text-emerald-300" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-200">
                    Lab Verified Status
                  </span>
                  <span className="font-serif font-bold text-base text-white">
                    100% Pure & Safe
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Tables Container */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              
              {/* Table 1: Physical & Nutritional Parameters */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-earth-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-farm-100 text-farm-700 flex items-center justify-center font-bold">
                      01
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-earth-900 text-lg">
                        Milk Composition & Density
                      </h4>
                      <p className="text-xs text-earth-500 font-mono">
                        Standard Physical & Chemical Parameters
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Standard Range
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-earth-200 bg-farm-50/60 text-xs font-mono uppercase text-earth-600">
                        <th className="py-3 px-3.5 rounded-l-lg font-semibold">Parameter</th>
                        <th className="py-3 px-3.5 font-semibold text-center">Value in Sample</th>
                        <th className="py-3 px-3.5 rounded-r-lg font-semibold text-right">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100 text-earth-800 font-medium">
                      {compositionParameters.map((item, idx) => (
                        <tr key={idx} className="hover:bg-farm-50/40 transition-colors">
                          <td className="py-3.5 px-3.5 font-medium text-earth-900">
                            {item.parameter}
                          </td>
                          <td className="py-3.5 px-3.5 text-center font-mono font-bold text-farm-700">
                            <span className="inline-block px-2.5 py-1 rounded bg-farm-100 text-farm-800">
                              {item.sampleValue}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-right font-mono text-earth-600 text-xs">
                            {item.normalRange}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-farm-50 border border-farm-200/70 text-xs text-earth-600 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-farm-600 shrink-0 mt-0.5" />
                  <span>
                    Our lactometer reading of <strong>28</strong> confirms full body density with natural butterfat of <strong>3.8%</strong>, without skimming or dilution.
                  </span>
                </div>
              </div>

              {/* Table 2: Detection of Chemical Adulterants */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-earth-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      02
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-earth-900 text-lg">
                        Detection of Adulterants
                      </h4>
                      <p className="text-xs text-earth-500 font-mono">
                        8-Point Chemical & Contaminant Screen
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                    100% Passed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-earth-200 bg-emerald-50/60 text-xs font-mono uppercase text-earth-600">
                        <th className="py-3 px-3.5 rounded-l-lg font-semibold">Name of Adulterant</th>
                        <th className="py-3 px-3.5 font-semibold text-right rounded-r-lg">Lab Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100 text-earth-800 font-medium">
                      {adulterantTests.map((item, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3 px-3.5 font-medium text-earth-900 flex items-center gap-2">
                            <FlaskConical className="w-3.5 h-3.5 text-farm-600 shrink-0" />
                            {item.name}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono">
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {item.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Adulterants Detected:</strong> No urea, formalin, detergent, synthetic bleaches, or neutralizing chemicals. Pure from farm to home.
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Guarantee Banner & Order Hotline */}
            <div className="mt-10 pt-8 border-t border-earth-200 bg-gradient-to-br from-farm-900 via-farm-800 to-farm-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1.5 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sky-300 text-xs font-mono uppercase font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Fresh & Pure Cow Milk Direct to Your Door
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold">
                  Order 100% Tested Pure Milk Today
                </div>
                <div className="text-xs text-sky-100/90 font-mono">
                  Price: <strong className="text-white text-sm">Rs. 250 / Litre</strong> · Free Home Delivery in Shahzad Town & Across Islamabad
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp: 0310-9361932
                </a>

                <a
                  href="tel:03109361932"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call: 0310 9361932
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
