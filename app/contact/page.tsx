import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact Us & Visit Our Farm — Pure Pastures Dairy',
  description: 'Get in touch with our farm management desk or schedule a weekend guided tour of our pastures in Islamabad.',
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-700 font-semibold">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Contact & Farm Visits
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            Have questions about morning delivery, bulk orders, or scheduling a visit to see our open pasture herd? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-farm-900 text-cream-100 space-y-6 shadow-float">
              <h3 className="font-serif text-2xl font-bold">
                Farm Desk Details
              </h3>

              <div className="space-y-4 text-sm text-cream-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-cream-100">Farm Location</div>
                    <div>Park Road, Chak Shahzad Valley, Islamabad, Pakistan</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-cream-100">Helpline</div>
                    <div>+92 (051) 111-787-332</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-cream-100">Email</div>
                    <div>fresh@purepasturesfarm.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-cream-100">Delivery Hours</div>
                    <div>Daily Morning 6:00 AM - 9:00 AM</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-farm-800 text-xs font-mono text-farm-300">
                Weekend guided farm tours available by appointment for families & school visits.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
