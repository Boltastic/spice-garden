/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, ClipboardCheck, ArrowRight, Smartphone, Download, Printer } from 'lucide-react';

export default function QRGeneratorSection() {
  const [tableNumber, setTableNumber] = useState('04');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'instructions'>('preview');

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://spice-garden.in';
  const tableMenuUrl = `${appUrl.split('?')[0]}?table=${tableNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableMenuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="qr-generator-section" className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 mb-3">
            <QrCode size={12} />
            <span>Digital Dining Suite</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-sans tracking-tight mb-2">
            Contactless Table Menu Generator
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Eliminate print menus. Generate dynamic QR codes for each table of Spice Garden. Customers can scan to order directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
          <div className="md:col-span-5 flex flex-col justify-center space-y-5">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg max-w-xs">
              <button
                id="qr-tab-preview"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 text-xs font-semibold py-2 px-3 rounded-md transition cursor-pointer ${activeTab === 'preview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Table Setup
              </button>
              <button
                id="qr-tab-instructions"
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 text-xs font-semibold py-2 px-3 rounded-md transition cursor-pointer ${activeTab === 'instructions' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Owner Guide
              </button>
            </div>

            {activeTab === 'preview' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="qr-table-input" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Assign Table Number</label>
                  <div className="flex gap-2">
                    <input
                      id="qr-table-input"
                      type="text"
                      maxLength={4}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                      className="w-20 text-center font-mono font-bold text-lg p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 bg-gray-50"
                      placeholder="e.g. 04"
                    />
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-500 flex items-center">
                      Configuring Table #{tableNumber || 'N/A'} digital menu link.
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Dynamic Target URL</span>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-[11px] font-mono text-gray-400 truncate flex-1">{tableMenuUrl}</span>
                    <button
                      id="qr-copy-btn"
                      onClick={handleCopyLink}
                      className="text-[10px] font-bold bg-white hover:bg-gray-100 text-gray-700 hover:text-orange-500 border border-gray-200 py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <ClipboardCheck size={11} />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-400 flex items-start gap-2">
                  <Smartphone className="text-orange-500 mt-0.5 flex-shrink-0" size={14} />
                  <span>Scanning encodes Table Number so that our kitchen staff knows exactly where the orders are dispatched from!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900 text-sm">Spice Garden Digitalization Playbook:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Choose the designated table number configuration.</li>
                  <li>Click **Print Table Tent** to generate a card.</li>
                  <li>Incorporate the code in acrylic table tents.</li>
                  <li>Customers scan, browse, click items, and order.</li>
                </ol>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-orange-800 text-[11px]">
                  <strong>Revenue Lift:</strong> Eliminates waiting times, increases dessert orders by an average of 18%, and enables seamless peak-hour table turnovers.
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                id="qr-print-btn"
                onClick={() => window.print()}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs py-3 px-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer size={13} />
                Print Table Tent
              </button>
              <button
                id="qr-download-btn"
                onClick={() => handleCopyLink()}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs py-3 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                Export High-Res
              </button>
            </div>
          </div>

          {/* QR Standee Visualization Card */}
          <div className="md:col-span-7 flex justify-center">
            <div className="relative bg-orange-600 text-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center overflow-hidden border-4 border-orange-500">
              {/* Overlay accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-2xl opacity-50 -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-700 rounded-full blur-2xl opacity-40 -ml-10 -mb-10" />

              {/* Spice Garden Logo Brand */}
              <div className="relative mb-3 flex flex-col items-center">
                <span className="font-serif italic text-lg leading-none tracking-wide text-orange-200">Spice Garden</span>
                <span className="text-[9px] uppercase tracking-widest text-orange-300 font-sans font-semibold mt-0.5">Family Restaurant</span>
              </div>

              {/* Table Tag */}
              <span className="relative text-xs font-semibold tracking-wider uppercase bg-orange-800/60 leading-none py-1.5 px-3 rounded-full mb-5">
                Table Number {tableNumber || '00'}
              </span>

              {/* Render simulated high-fidelity QR Code */}
              <div className="relative bg-white p-5 rounded-2xl shadow-md mb-5 border-4 border-orange-100">
                <svg className="w-40 h-40 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Decorative Anchor Corners */}
                  <rect x="0" y="0" width="24" height="24" rx="2" fill="currentColor" />
                  <rect x="3" y="3" width="18" height="18" rx="1" fill="white" />
                  <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />

                  <rect x="76" y="0" width="24" height="24" rx="2" fill="currentColor" />
                  <rect x="79" y="3" width="18" height="18" rx="1" fill="white" />
                  <rect x="82" y="6" width="12" height="12" rx="1" fill="currentColor" />

                  <rect x="0" y="76" width="24" height="24" rx="2" fill="currentColor" />
                  <rect x="3" y="79" width="18" height="18" rx="1" fill="white" />
                  <rect x="6" y="82" width="12" height="12" rx="1" fill="currentColor" />

                  {/* Tiny Anchor dots */}
                  <rect x="76" y="76" width="8" height="8" rx="1" />

                  {/* Fake QR columns of custom dots changing slightly based on Table Number to look genuine */}
                  <rect x="30" y="2" width="6" height="4" />
                  <rect x="42" y="0" width="8" height="8" />
                  <rect x="56" y="4" width="4" height="8" />
                  <rect x="66" y="1" width="6" height="4" />

                  <rect x="30" y="10" width="10" height="4" />
                  <rect x="44" y="12" width="8" height="10" />
                  <rect x="58" y="16" width="12" height="4" />

                  <rect x="2" y="30" width="6" height="8" />
                  <rect x="12" y="34" width="10" height="4" />
                  <rect x="26" y="28" width="6" height="14" />
                  <rect x="36" y="32" width="8" height="8" />

                  {/* Saffron Centre Dot */}
                  <circle cx="50" cy="50" r="10" fill="#f97316" />
                  <rect x="48" y="48" width="4" height="4" fill="white" />

                  {/* QR details lower half */}
                  <rect x="54" y="30" width="16" height="6" />
                  <rect x="74" y="32" width="12" height="10" />
                  <rect x="90" y="28" width="8" height="18" />

                  <rect x="2" y="44" width="18" height="4" />
                  <rect x="24" y="48" width="12" height="6" />
                  <rect x="40" y="46" width="6" height="12" />

                  <rect x="52" y="44" width="8" height="8" />
                  <rect x="66" y="48" width="18" height="4" />

                  <rect x="30" y="60" width="14" height="8" />
                  <rect x="48" y="58" width="6" height="14" />
                  <rect x="58" y="64" width="12" height="8" />
                  <rect x="74" y="60" width="8" height="12" />
                  <rect x="86" y="56" width="12" height="6" />

                  <rect x="30" y="74" width="8" height="16" />
                  <rect x="42" y="78" width="12" height="4" />
                  <rect x="58" y="76" width="14" height="12" />
                  <rect x="76" y="88" width="20" height="6" />
                  <rect x="88" y="74" width="8" height="10" />

                  {/* Dynamic noise variation */}
                  <rect x="10" y="60" width={parseInt(tableNumber) % 2 === 0 ? "12" : "6"} height="6" />
                  <rect x="15" y="70" width="6" height={parseInt(tableNumber) % 3 === 0 ? "10" : "5"} />
                </svg>
              </div>

              {/* Instructions on Standee */}
              <h4 className="font-bold text-base tracking-wide uppercase mb-1">Scan to View Menu</h4>
              <p className="text-[10px] text-orange-100 max-w-xs leading-normal">
                Place orders, track your loyalty punches, and pre-order food instantly on your smartphone. No signup required.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-orange-200">
                <span>https://spice-garden.in/menu</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
