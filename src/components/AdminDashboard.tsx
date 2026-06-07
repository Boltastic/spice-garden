/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  UserCheck,
  CalendarCheck,
  Utensils,
  X,
  Lock,
  ChevronRight,
  Database,
  Mail,
  Smartphone,
  Star,
  Check,
  Ban,
  Tag,
  Save,
  FileDown,
  Sparkles,
  PieChart,
  Search
} from 'lucide-react';
import { Reservation, Lead, Feedback, SpecialItem, FestivalOffer, CartItem } from '../types';

interface AdminDashboardProps {
  reservations: Reservation[];
  leads: Lead[];
  feedbacks: Feedback[];
  specials: SpecialItem[];
  offers: FestivalOffer[];
  orders: Array<{ id: string; name: string; phone: string; pickupTime: string; totalAmount: number; items: CartItem[]; status: string; createdAt: string }>;
  onUpdateReservationStatus: (id: string, status: 'confirmed' | 'cancelled') => void;
  onUpdateSpecial: (id: string, updated: Partial<SpecialItem>) => void;
  onToggleOffer: (id: string) => void;
  onUpdateFeedbackFeatured: (id: string, isFeatured: boolean) => void;
  onAddSpecial: (special: SpecialItem) => void;
  onToggleDashboard: () => void;
}

export default function AdminDashboard({
  reservations,
  leads,
  feedbacks,
  specials,
  offers,
  orders,
  onUpdateReservationStatus,
  onUpdateSpecial,
  onToggleOffer,
  onUpdateFeedbackFeatured,
  onAddSpecial,
  onToggleDashboard
}: AdminDashboardProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'orders' | 'specials' | 'leads' | 'feedback'>('overview');

  // Fields for editable current specials
  const [editingSpecialId, setEditingSpecialId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);

  // Search leads
  const [leadSearch, setLeadSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Use standard passcode "1234" to enter.');
    }
  };

  const handleBypass = () => {
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleStartEditSpecial = (item: SpecialItem) => {
    setEditingSpecialId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
    setEditPrice(item.price);
    setEditDiscount(item.discountPercentage || 0);
  };

  const handleSaveSpecial = (id: string) => {
    onUpdateSpecial(id, {
      name: editName,
      description: editDescription,
      price: editPrice,
      discountPercentage: editDiscount
    });
    setEditingSpecialId(null);
  };

  const downloadLeadsCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Name,Phone,Email,PromoCode,DateCollected\n';
    leads.forEach((l) => {
      csvContent += `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.code}","${l.createdAt}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Spice_Garden_Leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.phone.includes(leadSearch) ||
    l.code.toLowerCase().includes(leadSearch.toLowerCase())
  );

  // Stats Calculations
  const totalLeadCount = leads.length;
  const activeReservationCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedReservationCount = reservations.filter((r) => r.status === 'confirmed').length;
  const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) : '5.0';
  const foodRatingAvg = feedbacks.length > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.foodRating, 0) / feedbacks.length).toFixed(1) : '5.0';
  const serviceRatingAvg = feedbacks.length > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.serviceRating, 0) / feedbacks.length).toFixed(1) : '5.0';
  const totalVolume = orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + (confirmedReservationCount * 1200); // Multiplying confirmed tables by a hypothetical ₹1200 dining average

  return (
    <div id="admin-board-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-gray-990/60 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100"
      >
        {/* Banner header */}
        <div className="bg-gray-950 text-white p-5 flex justify-between items-center relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500 flex items-center justify-center text-orange-500 animate-pulse">
              <PieChart size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans tracking-tight">Spice Studio Control Center</h2>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">Spice Garden Family Restaurant • Hyderabad Terminal</span>
            </div>
          </div>
          <button
            id="admin-close-btn"
            onClick={onToggleDashboard}
            className="rounded-full p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Lock Gate */}
        {!isAuthenticated ? (
          <div id="admin-auth-panel" className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto p-6 text-center">
            <Lock size={44} className="text-orange-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-950 mb-1">Owner Authentication</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Enter the administration passcode to manage reservations, track lead databases, and update restaurant specials.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  id="admin-passcode-input"
                  type="password"
                  required
                  placeholder="Enter Passcode (e.g. 1234)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full text-center text-sm p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 uppercase tracking-widest font-black"
                />
              </div>

              {authError && (
                <span className="block text-[11px] font-semibold text-red-500 mt-1">
                  {authError}
                </span>
              )}

              <button
                id="admin-auth-submit"
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition text-xs tracking-wider uppercase cursor-pointer"
              >
                Verify Credentials
              </button>
            </form>

            <button
              id="admin-bypass-btn"
              onClick={handleBypass}
              className="mt-4 text-xs font-bold text-gray-400 hover:text-orange-500 transition underline cursor-pointer"
            >
              Demo Auto-Login (Bypass Gate)
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/60 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto select-none">
              <span className="hidden md:block text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Operations Port</span>
              <button
                id="tab-overview-btn"
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Live Metrics</span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
              <button
                id="tab-reservations-btn"
                onClick={() => setActiveTab('reservations')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'reservations' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-1.5">
                  Seats
                  {activeReservationCount > 0 && <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full text-[9px]">{activeReservationCount}</span>}
                </span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
              <button
                id="tab-orders-btn"
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'orders' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Pre-orders ({orders.length})</span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
              <button
                id="tab-specials-btn"
                onClick={() => setActiveTab('specials')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'specials' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Kitchen Specials</span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
              <button
                id="tab-leads-btn"
                onClick={() => setActiveTab('leads')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'leads' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Leads Index ({totalLeadCount})</span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
              <button
                id="tab-feedback-btn"
                onClick={() => setActiveTab('feedback')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition flex items-center justify-between cursor-pointer flex-shrink-0 ${activeTab === 'feedback' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>Reviews Board</span>
                <ChevronRight size={12} className="hidden md:block" />
              </button>
            </div>

            {/* Dashboard Content Panel */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div id="overview-pane" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Executive Summary</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Real-time indicators across customer digital channels</p>
                    </div>
                    <span className="text-[10px] text-orange-600 bg-orange-50 py-1.5 px-3 rounded-full font-bold flex items-center gap-1">
                      <Sparkles size={11} />
                      Refreshed: Just Now
                    </span>
                  </div>

                  {/* Top Analytics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Velocity</span>
                      <p className="font-sans text-2xl font-black text-gray-900 mt-1">₹{totalVolume.toLocaleString()}</p>
                      <div className="text-[9px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                        <TrendingUp size={10} />
                        <span>+18.4% today</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Leads Logged</span>
                      <p className="font-sans text-2xl font-black text-gray-900 mt-1">{totalLeadCount}</p>
                      <div className="text-[9px] text-gray-500 font-medium mt-1 leading-none">Registered for 10% coupon</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Reservations Ledger</span>
                      <p className="font-sans text-2xl font-black text-gray-900 mt-1">{reservations.length}</p>
                      <div className="text-[9px] text-orange-600 font-semibold mt-1">
                        {activeReservationCount} waiting confirmation
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Customer Sentiment</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <p className="font-sans text-2xl font-black text-gray-900 leading-none">{averageRating}</p>
                        <span className="text-xs text-gray-400">/ 5.0</span>
                      </div>
                      <div className="text-[9px] text-gray-500 font-medium mt-1 flex items-center gap-0.5">
                        <Star className="text-amber-400 fill-amber-400" size={10} />
                        <span>Based on real comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Operations and Promotions Quick Config */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Sentiment Breakdown */}
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Database size={15} className="text-orange-500" />
                        <span>Sentiment Analytics</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-gray-600">Culinary Quality (Food Score)</span>
                            <span className="text-gray-900">{foodRatingAvg} / 5.0</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${(parseFloat(foodRatingAvg) / 5) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-gray-600">Customer Service Score</span>
                            <span className="text-gray-900">{serviceRatingAvg} / 5.0</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${(parseFloat(serviceRatingAvg) / 5) * 100}%` }} />
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            Averages loaded automatically from client submitted ratings. Admins can moderate reviews on the Reviews board tab.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Active Promotions controller */}
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Tag size={15} className="text-orange-500" />
                        <span>Festival Offer Controller</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg leading-normal">
                        Toggle campaigns. Inactive campaigns are immediately hidden from the public header banner carousel on the front-end!
                      </p>
                      <div className="space-y-3">
                        {offers.map((offer) => (
                          <div key={offer.id} className="flex justify-between items-center p-2.5 bg-gray-50/50 rounded-xl border border-gray-100">
                            <div>
                              <p className="text-xs font-bold text-gray-950 truncate max-w-[200px]">{offer.title}</p>
                              <span className="text-[10px] font-mono text-orange-600 font-semibold uppercase">{offer.code}</span>
                            </div>
                            <button
                              id={`toggle-offer-${offer.id}`}
                              onClick={() => onToggleOffer(offer.id)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${offer.isActive ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500'}`}
                            >
                              {offer.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESERVATIONS TAB */}
              {activeTab === 'reservations' && (
                <div id="reservations-pane" className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Seat Allocations & Bookings</h3>
                      <p className="text-xs text-gray-500">Confirm seat reservations for dine-in family customers</p>
                    </div>
                  </div>

                  {reservations.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <CalendarCheck className="mx-auto text-gray-300 mb-2 animate-bounce" size={32} />
                      <p className="text-xs font-bold text-gray-500">No Reservations Yet</p>
                      <p className="text-[10px] text-gray-400">Fill the reservation form on the front website to test tracking</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400 font-bold bg-gray-50 p-3">
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-2">Schedule</th>
                            <th className="py-3 px-2 text-center">Guests</th>
                            <th className="py-3 px-2">Preferences</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {reservations.map((res) => (
                            <tr key={res.id} id={`admin-res-${res.id}`} className="hover:bg-gray-50/50 transition">
                              <td className="py-3 px-4">
                                <p className="font-bold text-gray-900">{res.name}</p>
                                <span className="block text-[10px] text-gray-400 font-medium">{res.phone} | {res.email}</span>
                              </td>
                              <td className="py-3 px-2">
                                <p className="font-bold text-gray-800">{res.date}</p>
                                <span className="block text-[10px] text-orange-500 font-semibold uppercase">{res.time}</span>
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-gray-800">{res.guests}</td>
                              <td className="py-3 px-2">
                                <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-full uppercase">
                                  {res.tablePref} Area
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full ${
                                  res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                  res.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                  'bg-amber-50 text-amber-700 animate-pulse'
                                }`}>
                                  {res.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {res.status === 'pending' && (
                                  <div className="flex gap-1.5 justify-end">
                                    <button
                                      id={`confirm-res-${res.id}`}
                                      onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                                      className="p-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] cursor-pointer transition"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      id={`cancel-res-${res.id}`}
                                      onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                                      className="p-1 px-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] cursor-pointer transition"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                                {res.status !== 'pending' && (
                                  <span className="text-[10px] text-gray-400 italic font-medium">Logged</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* PRE-ORDERS TAB */}
              {activeTab === 'orders' && (
                <div id="orders-pane" className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Pickup Pre-Orders</h3>
                    <p className="text-xs text-gray-500">Live tracker of takeaway/pre-orders compiled from online and WhatsApp checkouts</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Utensils className="mx-auto text-gray-300 mb-2 animate-bounce" size={32} />
                      <p className="text-xs font-bold text-gray-500">No takeaway orders processed yet</p>
                      <p className="text-[10px] text-gray-400">Add food items to basket and triggers checkout to populate this database!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Takeway</span>
                              <h4 className="font-bold text-gray-950 text-sm">{order.name}</h4>
                            </div>
                            <div className="text-xs font-semibold text-gray-600 flex flex-wrap items-center gap-1.5 font-mono">
                              <Mail size={11} className="text-gray-400" />
                              <span>{order.phone}</span>
                              <span className="text-gray-300">|</span>
                              <span>Est. Pickup: <strong>{order.pickupTime}</strong></span>
                            </div>
                            {/* Items listed */}
                            <div className="space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                  <span className="text-orange-500 font-bold">•</span>
                                  <span>{it.menuItem.name} <strong className="font-mono text-gray-800">x{it.quantity}</strong></span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end justify-between self-stretch text-left sm:text-right">
                            <div className="text-xs">
                              <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Amount Due</span>
                              <span className="font-sans text-lg font-black text-orange-600">₹{order.totalAmount}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                              <Check size={11} />
                              <span>Ready for pickup</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TODAY'S SPECIALS EDIT TAB */}
              {activeTab === 'specials' && (
                <div id="specials-pane" className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Today's Specials Live Editor</h3>
                    <p className="text-xs text-gray-500">Edit elements of promotional specials instantly on the live website.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specials.map((item) => {
                      const isEditing = editingSpecialId === item.id;

                      return (
                        <div key={item.id} className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex flex-col justify-between">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Special Name</label>
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price (₹)</label>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                                  className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Discount (%)</label>
                                  <input
                                    type="number"
                                    value={editDiscount}
                                    onChange={(e) => setEditDiscount(parseInt(e.target.value) || 0)}
                                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Special Recipe Bio</label>
                                <textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg h-16 focus:outline-none resize-none"
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => handleSaveSpecial(item.id)}
                                  className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-1.5 hover:bg-orange-600 transition cursor-pointer"
                                >
                                  <Save size={12} />
                                  Save Updates
                                </button>
                                <button
                                  onClick={() => setEditingSpecialId(null)}
                                  className="px-4 border border-gray-200 text-gray-500 font-bold py-2 rounded-lg text-xs hover:bg-white transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-between h-full">
                              <div className="flex gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-xl object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-1.5 flex-1">
                                  <h4 className="font-bold text-gray-900 text-xs">{item.name}</h4>
                                  <p className="text-[11px] text-gray-650 leading-relaxed truncate-2-lines">{item.description}</p>
                                  <div className="flex gap-2 text-[10px] font-bold">
                                    <span className="text-orange-500">Price: ₹{item.price}</span>
                                    {item.discountPercentage && <span className="text-emerald-600">Discount: {item.discountPercentage}%</span>}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleStartEditSpecial(item)}
                                className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold py-2 rounded-lg text-xs text-center cursor-pointer transition shadow-xs"
                              >
                                Modify Special Offer Details
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LEADS DATABASE TAB */}
              {activeTab === 'leads' && (
                <div id="leads-pane" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Leads Database</h3>
                      <p className="text-xs text-gray-500">Collected email & phone logs for coupons and privileges</p>
                    </div>
                    <button
                      id="download-leads-btn"
                      onClick={downloadLeadsCSV}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition self-start cursor-pointer"
                    >
                      <FileDown size={14} />
                      Download CSV database
                    </button>
                  </div>

                  {/* Search query box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={14} />
                    <input
                      id="leads-search-input"
                      type="text"
                      placeholder="Search lead database by Name, Email, Phone, or PromoCode..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                    />
                  </div>

                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Database className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-xs font-bold text-gray-500">No matching leads found</p>
                      <p className="text-[10px] text-gray-400">Check spelling or trigger more entries dynamically on the website.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 text-gray-400 font-bold bg-gray-50 p-3">
                            <th className="py-2.5 px-4">Contact</th>
                            <th className="py-2.5 px-2">Phone</th>
                            <th className="py-2.5 px-2">Email</th>
                            <th className="py-2.5 px-2">Assigned Code</th>
                            <th className="py-2.5 px-4 text-right">Date Subscribed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50/30 transition">
                              <td className="py-3 px-4 font-bold text-gray-900">{lead.name}</td>
                              <td className="py-3 px-2 font-mono">{lead.phone}</td>
                              <td className="py-3 px-2 text-gray-500">{lead.email}</td>
                              <td className="py-3 px-2">
                                <span className="font-mono text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded-md font-bold">
                                  {lead.code}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-gray-400 text-[10px]">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* FEEDBACK TAB */}
              {activeTab === 'feedback' && (
                <div id="feedback-pane" className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-sans tracking-tight text-gray-900">Feedback and Reviews Dashboard</h3>
                    <p className="text-xs text-gray-500">Moderation center: Approve which guest reviews to render on the home page carousel!</p>
                  </div>

                  <div className="space-y-4">
                    {feedbacks.map((item) => (
                      <div key={item.id} id={`admin-feed-${item.id}`} className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5 font-bold">
                              <span className="text-orange-500">Stars: {item.rating}★</span>
                              <span>Food: {item.foodRating}★</span>
                              <span>Service: {item.serviceRating}★</span>
                              <span>Ambiance: {item.ambianceRating}★</span>
                            </div>
                          </div>
                          {/* Toggle featured */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-500">Show on Homepage:</span>
                            <button
                              id={`toggle-feed-${item.id}`}
                              onClick={() => onUpdateFeedbackFeatured(item.id, !item.isFeatured)}
                              className={`text-[9.5px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${item.isFeatured ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                            >
                              {item.isFeatured ? 'Featured Yes' : 'No (Hidden)'}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic leading-relaxed bg-white p-2.5 rounded-lg">
                          "{item.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
