/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, PartyPopper } from 'lucide-react';
import { Lead } from '../types';

interface LeadPopupProps {
  onAddLead: (lead: Lead) => void;
}

export default function LeadPopup({ onAddLead }: LeadPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    // Check if user already subscribed or closed the modal
    const hasSeen = localStorage.getItem('sg_subscribed');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // Trigger after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('sg_subscribed', 'dismissed');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    // Generate promo code: SPICE10-[Random 4 letters]
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `SPICE10-${randomSuffix}`;
    setPromoCode(code);

    const newLead: Lead = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      name,
      email,
      phone,
      code,
      createdAt: new Date().toISOString()
    };

    onAddLead(newLead);
    localStorage.setItem('sg_subscribed', 'true');
    setStep('success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="lead-popup-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
          >
            {/* Close button */}
            <button
              id="lead-popup-close-btn"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close promotion popup"
            >
              <X size={18} />
            </button>

            {step === 'form' ? (
              <div id="lead-popup-form">
                <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm tracking-wider uppercase mb-2">
                  <Sparkles size={16} className="animate-pulse" />
                  <span>Exclusive Offer</span>
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-tight text-gray-900 mb-1">
                  Enjoy 10% Off
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Join our privilege club. Register below to unlock a flat 10% coupon for your next dining experience or online order at Spice Garden!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-phone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        id="lead-phone"
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit Indian mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="yourname@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                      />
                    </div>
                  </div>

                  <button
                    id="lead-popup-submit-btn"
                    type="submit"
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium p-3 rounded-lg transition duration-200 shadow-md tracking-wide flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Send My Coupon Code
                  </button>
                </form>

                <p className="text-[10px] text-gray-400 text-center mt-4">
                  By joining, you consent to receive periodic promotional WhatsApp/SMS alerts. We never spam.
                </p>
              </div>
            ) : (
              <div id="lead-popup-success" className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-4 animate-bounce">
                  <PartyPopper size={32} />
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-tight text-gray-900 mb-2">
                  Welcome to the Club, {name}!
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Check your phone. We have logged your request. Present the exclusive promo code below on billing to redeem your 10% discount:
                </p>

                <div className="bg-orange-50 border border-dashed border-orange-200 rounded-xl p-4 mb-6">
                  <span className="block text-xs font-semibold text-orange-600 uppercase tracking-widest mb-1">Your Promo Code</span>
                  <span className="font-mono text-2xl font-black tracking-wider text-orange-700">{promoCode}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    id="lead-popup-done-btn"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium p-3 rounded-lg transition"
                  >
                    Start Browsing Menu
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
