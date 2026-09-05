'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageCircle, Mail, RotateCcw, PhoneCall } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    whatsappUrl: string;
    mailUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Build WhatsApp formatted message
      const whatsappText = `*Farm Fresh Dairy - Customer Inquiry*\n\n` +
        `👤 *Name:* ${formData.name.trim()}\n` +
        `📱 *Phone:* ${formData.phone.trim()}\n` +
        `✉️ *Email:* ${formData.email.trim()}\n` +
        `💬 *Message:* ${formData.message.trim()}\n\n` +
        `_Sent via Farm Fresh Dairy Website_`;

      const whatsappUrl = `https://wa.me/923109361932?text=${encodeURIComponent(whatsappText)}`;

      // 2. Build Mailto link
      const mailSubject = `New Inquiry from ${formData.name.trim()} - Farm Fresh Dairy`;
      const mailBody = `Customer Name: ${formData.name.trim()}\nPhone: ${formData.phone.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`;
      const mailUrl = `mailto:farmfreshdairy28@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

      // Save submission state
      setSubmittedData({ whatsappUrl, mailUrl });
      setIsSubmitted(true);

      // Attempt to automatically open WhatsApp in a new tab for seamless UX
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMessage('Could not process inquiry. Please message us directly on WhatsApp or call our helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-earth-900">
          Send Us a Message
        </h2>
        <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-semibold">
          ● Fast Response
        </span>
      </div>

      {isSubmitted && submittedData ? (
        <div className="space-y-5 animate-fade-in">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2.5 font-bold text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Inquiry Generated Successfully!</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              We have opened WhatsApp for you to send your inquiry directly to our farm hotline. You can also send it via Email.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={submittedData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Send on WhatsApp (0310-9361932)
            </a>

            <a
              href={submittedData.mailUrl}
              className="w-full py-3.5 px-5 rounded-2xl bg-farm-100 hover:bg-farm-200 text-farm-900 border border-farm-300 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-colors"
            >
              <Mail className="w-5 h-5 text-farm-700" />
              Send to farmfreshdairy28@gmail.com
            </a>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 text-xs font-mono text-earth-600 hover:text-earth-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-earth-600 mb-1.5 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ayesha Khan"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-earth-600 mb-1.5 font-semibold">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1.5 font-semibold">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ayesha@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-earth-600 mb-1.5 font-semibold">
                Message / Inquiry *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your delivery requirement, monthly subscription, or farm visit..."
                className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-farm-700 hover:bg-farm-800 disabled:opacity-50 text-cream-100 font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
