'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Simulate clean submission handling or wire to server action
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMessage('Failed to send message. Please try calling our farm helpline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-cream-200/50 border border-earth-200 shadow-soft space-y-6">
      <h2 className="font-serif text-2xl font-bold text-earth-900">
        Send Us a Message
      </h2>

      {isSubmitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you! Your message has been received. Our farm team will reach out to you shortly.</span>
        </div>
      )}

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
            placeholder="Tell us about your delivery requirement or visit request..."
            className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-earth-300 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-farm-600"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-farm-700 hover:bg-farm-800 disabled:opacity-50 text-cream-100 font-bold text-sm uppercase tracking-wider transition-colors shadow-md"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting Message...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
