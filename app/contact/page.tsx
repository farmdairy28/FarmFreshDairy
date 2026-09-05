import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact Us & Order — Farm Fresh Dairy Islamabad',
  description: 'Order pure cow milk directly via WhatsApp or phone (0310-9361932). Free home delivery in Shahzad Town and across Islamabad.',
};

export default function ContactPage() {
  return (
    <div className="pt-36 pb-24 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-farm-600 font-semibold">
            GET IN TOUCH & ORDER NOW
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-earth-900">
            Contact & Fresh Delivery Desk
          </h1>
          <p className="text-earth-600 text-base sm:text-lg">
            Ready for 100% pure, unadulterated cow milk? Contact our farm desk, send a message on WhatsApp, or schedule daily morning doorstep delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-farm-900 text-white space-y-6 shadow-float">
              <div className="flex items-center justify-between pb-3 border-b border-farm-800">
                <h3 className="font-serif text-2xl font-bold text-white">
                  Farm Desk Details
                </h3>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Open Daily
                </span>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 space-y-2">
                <div className="text-xs font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
                  Instant WhatsApp Order Desk
                </div>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Send your delivery address and quantity for instant order confirmation:
                </p>
                <a
                  href="https://wa.me/923109361932?text=Hello%20Farm%20Fresh%20Dairy%2C%20I%20would%20like%20to%20order%20pure%20cow%20milk."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Chat on 0310-9361932
                </a>
              </div>

              <div className="space-y-4 text-sm text-sky-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Farm & Delivery Hub</div>
                    <div>Park Road / Shahzad Town, Islamabad, Pakistan</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Direct Helpline</div>
                    <a href="tel:03109361932" className="hover:text-white font-mono transition-colors">
                      0310 9361932 / 0310-9361932
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Email Address</div>
                    <a href="mailto:farmfreshdairy28@gmail.com" className="hover:text-white transition-colors">
                      farmfreshdairy28@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Chilled Delivery Hours</div>
                    <div>Daily Morning 6:00 AM – 9:00 AM</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-farm-800 text-xs font-mono text-sky-300/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Certified 100% adulterant-free pure milk with free delivery in Shahzad Town.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
