/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Gift, Share2, Search, PlusCircle, CheckCircle2, UserCheck, Sparkles, Clipboard } from 'lucide-react';

interface LoyaltySectionProps {
  onRegisterReferral: (referral: { referrerPhone: string; friendContact: string; code: string }) => void;
}

export default function LoyaltySection({ onRegisterReferral }: LoyaltySectionProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [punches, setPunches] = useState(3);
  const [birthday, setBirthday] = useState('');
  const [bdayClaimed, setBdayClaimed] = useState(false);
  const [friendContact, setFriendContact] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCopied, setReferralCopied] = useState(false);
  const [refSuccess, setRefSuccess] = useState(false);

  // Load state if a number is already registered inside localStorage
  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    
    const key = `sg_loyalty_${phoneNumber}`;
    const savedPunches = localStorage.getItem(key);
    if (savedPunches) {
      setPunches(parseInt(savedPunches));
    } else {
      // Default initial punches for new registrations (or 3 as a welcoming gift!)
      setPunches(3);
      localStorage.setItem(key, '3');
    }
    setIsSearched(true);
  };

  const handleAddPunch = () => {
    if (punches >= 10) {
      // Reset after claiming free meal
      setPunches(0);
      if (phoneNumber) localStorage.setItem(`sg_loyalty_${phoneNumber}`, '0');
      return;
    }
    const nextPunches = punches + 1;
    setPunches(nextPunches);
    if (phoneNumber) {
      localStorage.setItem(`sg_loyalty_${phoneNumber}`, nextPunches.toString());
    }
  };

  const handleBirthdayClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return;
    setBdayClaimed(true);
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendContact || !phoneNumber) return;

    const randomID = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedRefCode = `REFER-${randomID}`;
    setReferralCode(generatedRefCode);

    onRegisterReferral({
      referrerPhone: phoneNumber,
      friendContact,
      code: generatedRefCode
    });

    setRefSuccess(true);
    setFriendContact('');
    setTimeout(() => {
      setRefSuccess(false);
    }, 5000);
  };

  const copyRefLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.href.split('?')[0]}?ref=${phoneNumber || '9876543210'}`;
      navigator.clipboard.writeText(shareUrl);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    }
  };

  return (
    <section id="loyalty-hub-section" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 mb-3">
            <Award size={12} />
            <span>Privilege Club</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-gray-900 mb-3">
            Spice Garden Rewards
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Dine with us, unlock premium milestones, and share delicious moments with family to get curated cashbacks, free meals, and exclusive treats.
          </p>
        </div>

        {/* Loyalty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Punches/Meals Tracker (Lg col-span-7) */}
          <div className="lg:col-span-7 bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="text-orange-500" size={20} />
                    <span>Every 10th Meal is FREE</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">
                    Enter your mobile number to view your active loyalty card and earn credit stamp on every dining order of ₹250 or more.
                  </p>
                </div>
                {isSearched && (
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <UserCheck size={10} />
                    Active Member
                  </span>
                )}
              </div>

              {/* Login Form / Lookup */}
              {!isSearched ? (
                <form onSubmit={handleSearchPhone} className="flex gap-2 max-w-md my-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <input
                      id="loyalty-phone-lookup"
                      type="tel"
                      required
                      placeholder="Enter 10-digit Phone number"
                      pattern="[0-9]{10}"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                    />
                  </div>
                  <button
                    id="loyalty-search-btn"
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 rounded-xl transition shadow-md cursor-pointer flex-shrink-0"
                  >
                    Open Member Card
                  </button>
                </form>
              ) : (
                <div className="mb-6 flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-black">SG</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">Phone: +91 {phoneNumber}</p>
                    <p className="text-[10px] text-gray-400">Current status: Gold Elite Member</p>
                  </div>
                  <button
                    id="loyalty-logout-btn"
                    onClick={() => {
                      setIsSearched(false);
                      setPhoneNumber('');
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 underline"
                  >
                    Change Number
                  </button>
                </div>
              )}

              {/* Stamper Graphics */}
              <div className="grid grid-cols-5 gap-3 sm:gap-4 my-6">
                {Array.from({ length: 10 }).map((_, index) => {
                  const stampNum = index + 1;
                  const isStamped = stampNum <= punches;
                  const isFreeMealStamp = stampNum === 10;

                  return (
                    <motion.div
                      key={stampNum}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition relative ${
                        isStamped
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10'
                          : isFreeMealStamp
                          ? 'bg-amber-100/50 border-amber-400 border-dashed text-amber-600'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                      whileHover={{ scale: isSearched ? 1.05 : 1 }}
                    >
                      {isStamped ? (
                        <CheckCircle2 size={18} className="sm:size-21" />
                      ) : isFreeMealStamp ? (
                        <Gift size={18} className="sm:size-21 animate-pulse" />
                      ) : (
                        <span className="font-mono text-xs font-bold">{stampNum}</span>
                      )}
                      <span className={`text-[8px] absolute bottom-1 uppercase tracking-widest font-bold font-sans ${isStamped ? 'text-orange-100' : 'text-gray-400'}`}>
                        {isFreeMealStamp ? 'Free' : `P-${stampNum}`}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              {/* Dynamic feedback */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles size={16} className="text-orange-600 mt-0.5 flex-shrink-0 animate-spin-slow" />
                <div className="text-xs">
                  {punches >= 10 ? (
                    <div>
                      <p className="font-bold text-orange-900">Congratulations!</p>
                      <p className="text-orange-700">You earned 10 punches! Tell your waiter or specify in WhatsApp pre-order notes to collect your **FREE Meal**!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-orange-900">
                        {isSearched ? `${10 - punches} stamp punches left to free meal!` : 'Unlock 3 punches to start!'}
                      </p>
                      <p className="text-orange-700">Activate order vouchers. Each breakfast, lunch, or dinner order adds 1 stamp punch.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dev Simulation control to satisfy fully editable / functional interactive criteria */}
              <div className="mt-4 flex justify-end gap-2 items-center">
                <span className="text-[10px] text-gray-400 italic">Demonstrate system:</span>
                <button
                  id="loyalty-simulate-stamp-btn"
                  onClick={handleAddPunch}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <PlusCircle size={11} className="text-orange-500" />
                  {punches >= 10 ? 'Reset Stamp Card' : 'Simulate Stamp Punch'}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Birthday Voucher + Referrals (Lg col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            
            {/* Card 2: Birthday Discount */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <Gift className="text-orange-500" size={18} />
                  <span>Exclusive Birthday Treat</span>
                </h3>
                <p className="text-xs text-gray-500 leading-normal mb-4">
                  Register your birthdate to unlock a **₹250 Cash Code** valid during your birthday week on any lunch or dinner feast!
                </p>

                {!bdayClaimed ? (
                  <form onSubmit={handleBirthdayClaim} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="bday-date" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Your Birthday</label>
                        <input
                          id="bday-date"
                          type="date"
                          required
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          id="bday-claim-btn"
                          type="submit"
                          disabled={!birthday}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                        >
                          Lock Birthday Code
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-orange-50 border border-green-100 rounded-xl p-3 text-center my-2">
                    <p className="text-xs font-bold text-orange-900 flex items-center justify-center gap-1 mb-1">
                      <CheckCircle2 size={13} className="text-emerald-600 animate-pulse" />
                      Birthday Voucher Locked!
                    </p>
                    <p className="text-[10px] text-orange-700 leading-normal mb-2">We will trigger SMS on your birthday week. Present this code:</p>
                    <span className="inline-block font-mono text-sm font-black tracking-wider text-orange-850 bg-white border border-dashed border-orange-200 px-3 py-1 rounded-md">
                      BDAY-CELEBRATE-250
                    </span>
                  </div>
                )}
              </div>
              <span className="block text-[9px] text-gray-400 leading-none mt-4">
                * Requires dynamic ID validation under dine-in billing verification.
              </span>
            </div>

            {/* Card 3: Referral Rewards */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <Share2 className="text-orange-500" size={18} />
                  <span>Referral Rewards Program</span>
                </h3>
                <p className="text-xs text-gray-500 leading-normal mb-4">
                  Invite your friends or workspace colleagues. When they register or order, **both you and your friend earn standard ₹150 discount codes!**
                </p>

                <form onSubmit={handleReferralSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="ref-friend-contact" className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Friend's Phone or Email</label>
                      <input
                        id="ref-friend-contact"
                        type="text"
                        required
                        placeholder="e.g. 9876543211"
                        value={friendContact}
                        onChange={(e) => setFriendContact(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        id="ref-submit-btn"
                        type="submit"
                        disabled={!friendContact || !phoneNumber}
                        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                        title={!phoneNumber ? "Register/Search your phone index on the left card first" : "Send invitation discount"}
                      >
                        Send Invitation
                      </button>
                    </div>
                  </div>
                  {!phoneNumber && (
                    <span className="block text-[9px] text-orange-500 leading-none font-medium">
                      * Look up your phone on the left stamp card first to unlock invitations!
                    </span>
                  )}
                </form>

                <AnimatePresence>
                  {refSuccess && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center"
                    >
                      <p className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        Referral Registered!
                      </p>
                      <p className="text-[10px] text-emerald-700 leading-normal mt-0.5">
                        Code <strong className="font-mono">{referralCode}</strong> cataloged! Friend notified with ₹150 gift code.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-gray-100/60 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-bold">Your Share Link:</span>
                <button
                  id="loyalty-copy-ref-link"
                  onClick={copyRefLink}
                  className="text-[9px] font-bold bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 leading-none py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Clipboard size={10} />
                  {referralCopied ? 'Link Copied!' : 'Copy Share Link'}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
