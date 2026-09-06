'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Where do you deliver fresh cow milk in Islamabad and Rawalpindi?',
    answer: 'We deliver fresh cow milk across Islamabad and Rawalpindi. Doorstep delivery is 100% FREE in Shahzad Town, Sector I-8, and Sector I-9. For other sectors including F-6, F-7, F-8, F-10, F-11, G-6 through G-13, E-7, E-11, DHA Islamabad, and Bahria Town, delivery is efficiently dispatched via dedicated riders (nominal rider charges apply upon delivery).',
  },
  {
    question: 'What is the price of 100% pure cow milk and when is it delivered?',
    answer: 'Our pure pasture cow milk is priced at Rs. 250 per litre. Deliveries are dispatched daily in two convenient slots: Morning delivery (6:00 AM – 9:00 AM) and Evening delivery (4:30 PM – 7:30 PM) so you always receive fresh milk chilled from the farm.',
  },
  {
    question: 'How do you guarantee the milk is 100% pure and adulterant-free?',
    answer: 'Our milk comes exclusively from pasture-raised, healthy cows fed on green oats and natural non-GMO forage. We use hygienic, touchless milking machines and immediately chill the milk to 4°C within 15 minutes. Our milk is certified 100% free from added water, urea, formalin, preservatives, or hormones. You can view our official Lab Quality Test Report on our website.',
  },
  {
    question: 'How can I place an order or set up a daily milk delivery in Islamabad?',
    answer: 'You can order directly online through our website cart & checkout, or simply WhatsApp / call our farm dispatch desk at 0310-9361932. Just share your address, preferred litre quantity, and delivery time slot (morning or evening).',
  },
  {
    question: 'Do you also provide Pure Desi Ghee and Fresh Dahi?',
    answer: 'Yes! In addition to pure cow milk, we produce small-batch traditional Bilona Desi Ghee, rich probiotic Dahi (curd), natural Makhan (butter), and fresh Paneer, all made from 100% pure farm milk without artificial additives.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const siteUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://www.farmfreshdairyproducts.com').replace(/\/$/, '');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-cream-100 border-t border-earth-200/80">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100 text-farm-800 text-xs font-mono font-bold tracking-wider uppercase border border-farm-200">
            <HelpCircle className="w-3.5 h-3.5 text-farm-700" />
            Hyper-Local FAQs &amp; Delivery Guide
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-earth-900">
            Frequently Asked Questions
          </h2>
          <p className="text-earth-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to know about fresh cow milk home delivery, purity guarantees, and service sectors in Islamabad &amp; Rawalpindi.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-farm-500 shadow-sm'
                    : 'bg-cream-50/70 border-earth-200 hover:border-earth-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-earth-900 pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-farm-800 text-white rotate-180' : 'bg-earth-200/70 text-earth-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-earth-700 text-sm sm:text-base leading-relaxed border-t border-earth-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-farm-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Have a specific question about your sector?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100">
              Our farm delivery desk is ready to assist you every morning and evening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20have%20a%20question%20about%20milk%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              WhatsApp Help
            </a>
            <a
              href="tel:03109361932"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-farm-800 hover:bg-farm-700 text-sky-100 hover:text-white text-xs font-semibold uppercase tracking-wider border border-farm-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-300" />
              0310 9361932
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
