/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  Sparkles,
  MessageSquare,
  CheckCircle,
  Star,
  Users,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Settings,
  Heart,
  Flame,
  ThumbsUp,
  Percent,
  Clock3,
  CalendarDays
} from 'lucide-react';

import { MenuItem, CartItem, Reservation, Lead, Feedback, SpecialItem, FestivalOffer } from './types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TODAYS_SPECIALS,
  INITIAL_REVIEWS,
  FESTIVAL_OFFERS
} from './data';

import LeadPopup from './components/LeadPopup';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import QRGeneratorSection from './components/QRGeneratorSection';
import LoyaltySection from './components/LoyaltySection';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // --- DATABASE STATES (LOADS FROM LOCALSTORAGE OR SETS DEFAULTS) ---
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  const [specials, setSpecials] = useState<SpecialItem[]>(() => {
    const saved = localStorage.getItem('sg_specials');
    return saved ? JSON.parse(saved) : INITIAL_TODAYS_SPECIALS;
  });

  const [offers, setOffers] = useState<FestivalOffer[]>(() => {
    const saved = localStorage.getItem('sg_offers');
    return saved ? JSON.parse(saved) : FESTIVAL_OFFERS;
  });

  const [reviews, setReviews] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem('sg_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('sg_reservations');
    if (saved) return JSON.parse(saved);
    // Initial cool dummy database for owner to view
    return [
      {
        id: 'res-71',
        name: 'Aditya Sen',
        phone: '9845012345',
        email: 'adityasen@gmail.com',
        date: '2026-06-08',
        time: '08:30 PM',
        guests: 4,
        tablePref: 'garden',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'res-72',
        name: 'Pritha Mukherjee Meeting',
        phone: '9177234567',
        email: 'pritha.it@wipro.com',
        date: '2026-06-09',
        time: '01:00 PM',
        guests: 6,
        tablePref: 'private',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('sg_leads');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'le-1', name: 'Manish Kumar', phone: '9440112233', email: 'manish.k@infotech.com', code: 'SPICE10-F8DH', createdAt: '2026-06-06T10:00:00Z' },
      { id: 'le-2', name: 'Divya Rao', phone: '9123456780', email: 'divya.reddy@gmail.com', code: 'SPICE10-PL8A', createdAt: '2026-06-07T02:30:00Z' }
    ];
  });

  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('sg_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord-101',
        name: 'Kshitij Sharma (IT Express)',
        phone: '9876543210',
        pickupTime: '20 minutes',
        totalAmount: 494,
        items: [
          { menuItem: INITIAL_MENU_ITEMS[4], quantity: 1 }, // Biryani
          { menuItem: INITIAL_MENU_ITEMS[12], quantity: 1 }  // Mango Lassi
        ],
        status: 'ready',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // --- CLIENT NAVIGATION & UTILITY STATES ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'beverages' | 'desserts'>('lunch');
  const [scannedTable, setScannedTable] = useState<string | null>(null);
  
  // Custom reservation forms
  const [reserveName, setReserveName] = useState('');
  const [reservePhone, setReservePhone] = useState('');
  const [reserveEmail, setReserveEmail] = useState('');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('07:30 PM');
  const [reserveGuests, setReserveGuests] = useState(2);
  const [reserveTablePref, setReserveTablePref] = useState<'inside' | 'garden' | 'private' | 'any'>('any');
  const [reserveSuccess, setReserveSuccess] = useState(false);

  // Review submission forms
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revFoodRating, setRevFoodRating] = useState(5);
  const [revServiceRating, setRevServiceRating] = useState(5);
  const [revAmbianceRating, setRevAmbianceRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  // Admin and popup states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // --- SYNC STATE TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('sg_specials', JSON.stringify(specials));
  }, [specials]);

  useEffect(() => {
    localStorage.setItem('sg_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('sg_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sg_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('sg_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('sg_orders', JSON.stringify(orders));
  }, [orders]);

  // --- SCAN PARSER ---
  useEffect(() => {
    // Look at URL parameters to see if scanned table query exists (e.g. ?table=04)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableQuery = params.get('table');
      if (tableQuery) {
        setScannedTable(tableQuery);
      }
    }
  }, []);

  // --- COMPONENT HANDLERS & MODIFIERS ---
  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
  };

  const handleAddToCart = (item: MenuItem) => {
    const existingIndex = cart.findIndex((c) => c.menuItem.id === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { menuItem: item, quantity: 1 }]);
    }
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    const existingIndex = cart.findIndex((c) => c.menuItem.id === itemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      const nextQty = updated[existingIndex].quantity + delta;
      if (nextQty <= 0) {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex].quantity = nextQty;
      }
      setCart(updated);
    }
  };

  const handleConfirmPreOrder = (orderDetails: { name: string; phone: string; pickupTime: string; totalAmount: number; items: CartItem[] }) => {
    const newOrder = {
      id: `ord-${Math.floor(100 + Math.random() * 900)}`,
      ...orderDetails,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
  };

  const handleReserveTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveName || !reservePhone || !reserveEmail || !reserveDate) return;

    const newRes: Reservation = {
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      name: reserveName,
      phone: reservePhone,
      email: reserveEmail,
      date: reserveDate,
      time: reserveTime,
      guests: reserveGuests,
      tablePref: reserveTablePref,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReservations([newRes, ...reservations]);
    setReserveSuccess(true);
    setTimeout(() => {
      setReserveSuccess(false);
      setReserveName('');
      setReservePhone('');
      setReserveEmail('');
      setReserveDate('');
      setReserveGuests(2);
    }, 5000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) return;

    const newRev: Feedback = {
      id: `rev-${Math.floor(100 + Math.random() * 900)}`,
      name: revName,
      rating: revRating,
      foodRating: revFoodRating,
      serviceRating: revServiceRating,
      ambianceRating: revAmbianceRating,
      comment: revComment,
      createdAt: new Date().toISOString(),
      isFeatured: false // Standard moderation queue: requires admin toggle to publish!
    };

    setReviews([newRev, ...reviews]);
    setRevSuccess(true);
    setTimeout(() => {
      setRevSuccess(false);
      setRevName('');
      setRevComment('');
      setRevRating(5);
      setRevFoodRating(5);
      setRevServiceRating(5);
      setRevAmbianceRating(5);
    }, 5000);
  };

  // --- SPECIAL CONTROL FUNCTIONS FOR ADMIN PASSTHROUGHS ---
  const handleUpdateReservationStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    const updated = reservations.map((r) => r.id === id ? { ...r, status } : r);
    setReservations(updated);
  };

  const handleUpdateSpecial = (id: string, updatedFields: Partial<SpecialItem>) => {
    const updated = specials.map((s) => s.id === id ? { ...s, ...updatedFields } : s);
    setSpecials(updated);
  };

  const handleToggleOffer = (id: string) => {
    const updated = offers.map((o) => o.id === id ? { ...o, isActive: !o.isActive } : o);
    setOffers(updated);
  };

  const handleUpdateFeedbackFeatured = (id: string, isFeatured: boolean) => {
    const updated = reviews.map((r) => r.id === id ? { ...r, isFeatured } : r);
    setReviews(updated);
  };

  // --- DYNAMIC CALCULATOR ELEMENTS ---
  const activeOffers = offers.filter((o) => o.isActive);

  return (
    <div id="website-root" className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* 1. MARKETING / FESTIVAL STICKY TOP BANNER */}
      {activeOffers.length > 0 && (
        <div id="offers-carousel-banner" className="bg-orange-500 text-white animate-fade-in text-xs py-2.5 px-4 font-sans font-medium flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-orange-400">
          <div className="max-w-7xl mx-auto flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4">
            <span className="flex items-center gap-1 opacity-90 tracking-wide uppercase font-black text-[10px] bg-orange-700/50 py-0.5 px-2 rounded-md">
              <Percent size={11} className="inline" />
              Promotion
            </span>
            <span className="text-center truncate">
              <strong>{activeOffers[currentOfferIndex]?.title}:</strong> {activeOffers[currentOfferIndex]?.description}
            </span>
            <span className="font-mono bg-white text-orange-600 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider select-all">
              Code: {activeOffers[currentOfferIndex]?.code}
            </span>
          </div>
          {activeOffers.length > 1 && (
            <button
              id="banner-next-btn"
              onClick={() => setCurrentOfferIndex((prev) => (prev + 1) % activeOffers.length)}
              className="px-2 font-black text-white/80 hover:text-white transition text-xs"
              title="Next promotional offer"
            >
              Next ➔
            </button>
          )}
        </div>
      )}

      {/* DYNAMIC SCANNED TABLE TOP NOTICE */}
      {scannedTable && (
        <div id="table-scanned-notice" className="bg-gray-950 text-white py-2 px-4 shadow-md text-xs font-semibold flex items-center justify-center border-b border-gray-850">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>You scanned <strong>Table #{scannedTable}</strong>. Placing custom pre-orders automatically routes cooking layout to table {scannedTable}!</span>
            <button
              id="clear-scanned-table-btn"
              onClick={() => setScannedTable(null)}
              className="text-[10px] text-gray-400 hover:text-white underline ml-3"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. GENERAL CORE HEADER / NAVIGATION BAR */}
      <header id="main-navigation-header" className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 sticky top-0 sm:top-10 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Hyderabad metadata */}
          <a href="#" className="flex flex-col items-start leading-none group select-none">
            <span className="font-serif italic font-bold text-xl sm:text-[23px] tracking-wide text-gray-950 group-hover:text-orange-500 transition-colors">
              Spice Garden
            </span>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 mt-1 font-sans font-bold flex items-center gap-1">
              Family Restaurant
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
              Hyderabad
            </span>
          </a>

          {/* Desktop Links (Georgia list) */}
          <nav id="desktop-navbar-nav" className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <a href="#featured-specials-section" className="hover:text-orange-500 transition">Specials</a>
            <a href="#about-us-section" className="hover:text-orange-500 transition">Our Story</a>
            <a href="#complete-menu-section" className="hover:text-orange-500 transition">Full Menu</a>
            <a href="#photo-gallery-section" className="hover:text-orange-500 transition">Gallery</a>
            <a href="#loyalty-hub-section" className="hover:text-orange-500 transition">Loyalty Club</a>
            <a href="#reservation-form-section" className="hover:text-orange-500 transition">Reservations</a>
            <a href="#customer-testimonials-section" className="hover:text-orange-500 transition">Reviews</a>
            <a href="#contact-location-section" className="hover:text-orange-500 transition">Contact</a>
          </nav>

          {/* Utilities CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Private Admin toggle button represent premium software capabilities */}
            <button
              id="admin-dashboard-toggle-nav"
              onClick={() => setIsAdminOpen(true)}
              className="p-2 sm:p-2.5 rounded-full border border-gray-100 bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-200 transition cursor-pointer"
              title="Restaurant Owner Portal"
            >
              <Settings size={18} />
            </button>

            {/* Main Reservation Core CTA - Smooth Scroll */}
            <a
              href="#reservation-form-section"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md cursor-pointer transition hidden sm:inline-block border border-orange-500 active:scale-95"
            >
              Book a Table
            </a>
          </div>

        </div>
      </header>

      {/* 3. HERO BANNER LANDING */}
      <section id="hero-landing-banner" className="relative bg-white pt-6 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
              <Sparkles size={12} className="animate-spin-slow" />
              <span>Finest Multicuisine Heritage in Hyderabad</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold font-serif leading-none tracking-tight text-gray-950">
              Authentic Flavours,<br className="hidden sm:inline" />
              <span className="text-orange-500 italic block mt-2">Memorable Experiences.</span>
            </h1>
            
            <p className="text-gray-550 text-sm leading-relaxed max-w-md">
              Indulge in a premium, hand-crafted culinary journey featuring rich aromatic North Indian Dum Biryanis, sizzling Chinese wok noodles, and traditional South Indian tiffins spiced with multi-generational family secrets. Best enjoyed with friends and family.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#complete-menu-section"
                className="bg-gray-950 hover:bg-gray-900 border border-gray-950 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 transition"
              >
                <Utensils size={14} />
                View Full Menu
              </a>

              <a
                href="#reservation-form-section"
                className="bg-orange-500 hover:bg-orange-600 border border-orange-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 active:scale-98 transition"
              >
                <Calendar size={14} />
                Reserve Table
              </a>
            </div>

            {/* Quick value indicators */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 max-w-md">
              <div>
                <span className="block text-2xl font-black font-sans text-gray-950">4.8★</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5 block">Google Rating</span>
              </div>
              <div>
                <span className="block text-2xl font-black font-sans text-gray-950">100%</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5 block">Premium Halal</span>
              </div>
              <div>
                <span className="block text-2xl font-black font-sans text-gray-950">20+ Yrs</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5 block">Nizami Heritage</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Banner Image */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
                alt="Spice Garden Table Spread with Nizami delicacies"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Dynamic Overlay Floating Badges */}
              <div id="hero-floating-card-1" className="absolute bottom-5 left-5 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 max-w-xs animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center font-bold font-mono">20m</div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 leading-none">Fast Online Pickup</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">Pre-order now and collect fresh hot meals in 20 minutes.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. TODAY'S SPECIAL (EDITABLE CARD SECTION) */}
      <section id="featured-specials-section" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 mb-2 uppercase tracking-widest leading-none">
                <Flame size={10} className="inline mr-0.5" />
                Hot Out The Kitchen
              </div>
              <h2 className="text-3xl font-bold font-sans tracking-tight text-gray-900">
                Today's Special Creations
              </h2>
              <p className="text-gray-500 text-xs mt-1 leading-normal max-w-md">
                Indulge in today's bespoke chef selections, available only dynamically for limited quantities.
              </p>
            </div>
            <p className="text-xs text-orange-600 font-semibold hover:underline cursor-pointer flex items-center gap-1 mt-2 sm:mt-0" onClick={() => setIsAdminOpen(true)}>
              <span>Configure specials as restaurant owner</span>
              ➔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specials.map((special) => (
              <div
                key={special.id}
                id={`special-card-${special.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-12 hover:shadow-xl transition duration-300"
              >
                {/* Special Image */}
                <div className="sm:col-span-5 h-48 sm:h-full relative">
                  <img
                    src={special.image}
                    alt={special.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {special.discountPercentage && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white font-mono font-extrabold text-xs py-1 px-2.5 rounded-full shadow-md animate-bounce">
                      -{special.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Special Content */}
                <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif italic font-bold text-lg text-gray-990 leading-tight">
                        {special.name}
                      </h3>
                      <span className="text-xs font-black text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-md leading-none">
                        Chef Choice
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {special.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      {special.discountPercentage ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans text-xl font-black text-gray-900">
                            ₹{Math.round(special.price * (1 - special.discountPercentage / 100))}
                          </span>
                          <span className="font-sans text-xs text-gray-400 line-through">
                            ₹{special.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-sans text-xl font-black text-gray-900">
                          ₹{special.price}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase leading-none mt-1">Freshly Cooked</span>
                    </div>

                    <button
                      id={`add-special-${special.id}-btn`}
                      onClick={() => {
                        const calculatedPrice = special.discountPercentage
                          ? Math.round(special.price * (1 - special.discountPercentage / 100))
                          : special.price;
                        handleAddToCart({
                          id: special.id,
                          name: special.name,
                          description: special.description,
                          price: calculatedPrice,
                          image: special.image,
                          category: 'lunch',
                          isVegetarian: !special.name.toLowerCase().includes('prawn') && !special.name.toLowerCase().includes('chicken') && !special.name.toLowerCase().includes('mutton')
                        });
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase cursor-pointer py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Plus size={12} />
                      Add Pre-Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ABOUT US & CHEF BIOS */}
      <section id="about-us-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Photos collage */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=350"
                  alt="Our Nizami Chef cooking in kitchen"
                  className="w-full h-64 object-cover rounded-3xl shadow-md border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=350"
                  alt="Traditional hand-ground spices"
                  className="w-full h-40 object-cover rounded-3xl shadow-md border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-8">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=350"
                  alt="Elegant dining room interior"
                  className="w-full h-96 object-cover rounded-3xl shadow-lg border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Story details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 select-all">
                <Award size={12} className="inline mr-0.5" />
                <span>Estd. 2005 • Multi-Cuisine Excellence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-995 leading-tight">
                Our Gastronomy Story & Heritage
              </h2>

              <p className="text-gray-550 text-sm leading-relaxed">
                Nestled in the beating heart of Hyderabad, Spice Garden Family Restaurant began its journey inside a cozy open-air courtyard with a single tandoor oven and three recipes passed down through generations of Nizami royal culinary lineage. Today, we cater to over 10,000 visitors weekly—incorporating students, corporate tech employees from adjacent IT hubs, and multi-generational families.
              </p>

              <div className="border-l-4 border-orange-500 pl-4 py-1 italic font-serif text-gray-700 text-sm my-4 bg-orange-50/30 rounded-r-xl pr-2">
                "We do not cook for customers; we craft memories. Our spices are ground by hand, our oils are local cold-press extracts, and our clay dum pots are baked specifically for our Biryani ovens."
              </div>

              {/* Chef Introduction */}
              <div className="pt-4 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150"
                  alt="Head Chef Kausar Qureshi portrait"
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Chef Kausar Qureshi</h4>
                  <p className="text-[10px] uppercase font-bold text-orange-600 mt-0.5 tracking-wider">Executive Head Chef</p>
                  <p className="text-[11px] text-gray-400 mt-1">22+ Years in Hyatt, Nizami Dum-cooking Certified</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. COMPLETE MENU (BREAKFAST / LUNCH / DINNER / BEVERAGES / DESSERTS) WITH FILTERS */}
      <section id="complete-menu-section" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 py-1 px-3 rounded-full uppercase tracking-widest inline-block mb-3 leading-none">
              Explore Our Fare
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-gray-950 mb-3">
              Spice Garden Gastronomic Menu
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Every dish is freshly prepared to order using hand-selected ingredients. Filter by categories below to construct your online pre-order.
            </p>
          </div>

          {/* Quick Search and Filters */}
          <div className="flex flex-col items-center gap-6 mb-12">
            {/* Category Button Slots */}
            <div className="no-scrollbar flex items-center gap-2 max-w-full overflow-x-auto p-1 bg-white rounded-2xl border border-gray-150 shadow-sm leading-none">
              {(['breakfast', 'lunch', 'dinner', 'beverages', 'desserts'] as const).map((cat) => (
                <button
                  key={cat}
                  id={`filter-menu-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-3 px-5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex-shrink-0 ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  {cat === 'breakfast' && '☀️ Breakfast'}
                  {cat === 'lunch' && '🍲 Royal Lunch / Mains'}
                  {cat === 'dinner' && '🌙 Dinner Specialties'}
                  {cat === 'beverages' && '🥤 Coolers & Beverages'}
                  {cat === 'desserts' && '🍨 Royal Desserts'}
                </button>
              ))}
            </div>
            
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Tip: Click any item to add it to your online pre-order bag. Click the green floating button to complete order.
            </span>
          </div>

          {/* Grid Layout of Menu cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map((item) => (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-150 flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide leading-none p-1.5 rounded-md shadow-md ${item.isVegetarian ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-emerald-200' : 'bg-red-200'}`} />
                        {item.isVegetarian ? 'VEG' : 'Non-Veg'}
                      </span>
                      {item.isPopular && (
                        <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-wide leading-none p-1.5 rounded-md shadow-md">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Spicy indicator */}
                    {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                      <span className="absolute bottom-3 right-3 bg-black/60 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5 backdrop-blur-xs">
                        {Array.from({ length: item.spicyLevel }).map((_, i) => (
                          <Flame key={i} size={11} className="text-orange-500 fill-orange-500 inline" />
                        ))}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11.5px] text-gray-500 leading-relaxed truncate-3-lines">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[15px] font-black text-gray-900">
                        ₹{item.price}
                      </span>

                      <button
                        id={`add-menu-${item.id}-btn`}
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-bold text-xs p-2 rounded-xl transition cursor-pointer flex items-center gap-1"
                        title="Add to pre-order bag"
                      >
                        <Plus size={14} />
                        Add To Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </section>

      {/* 7. DIGITAL QR MENU GENERATOR COMPONENT */}
      <QRGeneratorSection />

      {/* 8. LOYALTY CARD PORTAL */}
      <LoyaltySection onRegisterReferral={(ref) => handleAddLead({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        name: `Friend Referral from ${ref.referrerPhone}`,
        phone: ref.friendContact,
        email: 'referral_invitation@email.com',
        code: ref.code,
        createdAt: new Date().toISOString()
      })} />

      {/* 9. TODAY'S COMMODITY: PHOTO GALLERY */}
      <section id="photo-gallery-section" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 py-1 px-3 rounded-full uppercase tracking-widest inline-block mb-3 leading-none">
              Explore Our Spaces
            </span>
            <h2 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">
              Spice Garden Photo Archives
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Peek inside our hygienic live kitchen and curated family dining room environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Grand Nizami Dining Ballroom",
                cat: "Interior",
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Live Charcoal Tandoor Kitchen",
                cat: "Hygiene Cooking",
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Open Air Canopy Pavillion",
                cat: "Garden Space",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Ghee Roast Masala Cook Spreed",
                cat: "Masterclass Foods",
                image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600"
              }
            ].map((pic, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-2xl aspect-square shadow-md border border-gray-150">
                <img
                  src={pic.image}
                  alt={pic.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] uppercase tracking-wider text-orange-400 font-bold font-mono">{pic.cat}</span>
                  <h4 className="text-white font-bold text-xs mt-0.5">{pic.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. INTERACTIVE REVENUE SECTION: RESERVATION BOOKINGS */}
      <section id="reservation-form-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-150 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-orange-600 opacity-20 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-orange-700 opacity-20 rounded-full blur-2xl -ml-10 -mb-10" />

            <div className="relative text-center max-w-lg mx-auto mb-8 space-y-2">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-widest bg-orange-950 border border-orange-900 rounded-full px-3 py-1 inline-block">
                Assured Seating
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight">Reserve Your Family Table</h2>
              <p className="text-gray-400 text-xs">
                Avoid peak hours delays. Instant confirm table. Complete information logs table details dynamically to Hyderabad queue.
              </p>
            </div>

            <AnimatePresence>
              {reserveSuccess ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="text-center py-6 bg-orange-950/40 border border-orange-500/20 rounded-2xl backdrop-blur-md"
                >
                  <CheckCircle size={56} className="mx-auto text-orange-500 mb-3 animate-bounce" />
                  <h3 className="font-bold text-[18px] text-white">Table Booking Submitted!</h3>
                  <p className="text-xs text-orange-200 p-2 max-w-sm mx-auto leading-relaxed">
                    Check your email and WhatsApp shortly. We have logged this table booking. Administrators are reviewing seating vacancies.
                  </p>
                  <div className="mt-4 bg-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded-full w-fit mx-auto">
                    Awaiting Host Confirmation
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleReserveTableSubmit} className="space-y-4 relative z-10 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="res-name-input" className="block text-gray-400 font-semibold mb-1">Full Guest Name</label>
                      <input
                        id="res-name-input"
                        type="text"
                        required
                        placeholder="e.g. Aditya Sen"
                        value={reserveName}
                        onChange={(e) => setReserveName(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="res-phone-input" className="block text-gray-400 font-semibold mb-1">WhatsApp Cell</label>
                      <input
                        id="res-phone-input"
                        type="tel"
                        required
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        value={reservePhone}
                        onChange={(e) => setReservePhone(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="res-email-input" className="block text-gray-400 font-semibold mb-1">Email Receipts</label>
                      <input
                        id="res-email-input"
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={reserveEmail}
                        onChange={(e) => setReserveEmail(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="res-date-input" className="block text-gray-400 font-semibold mb-1">Dining Date</label>
                      <input
                        id="res-date-input"
                        type="date"
                        required
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="res-time-select" className="block text-gray-400 font-semibold mb-1">Preferred Time slot</label>
                      <select
                        id="res-time-select"
                        value={reserveTime}
                        onChange={(e) => setReserveTime(e.target.value)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white font-semibold"
                      >
                        <option value="08:00 AM">08:00 AM (Breakfast)</option>
                        <option value="09:30 AM">09:30 AM (Breakfast)</option>
                        <option value="12:30 PM">12:30 PM (Lunch)</option>
                        <option value="01:30 PM">01:30 PM (Lunch)</option>
                        <option value="07:30 PM">07:30 PM (Dinner)</option>
                        <option value="08:30 PM">08:30 PM (Dinner)</option>
                        <option value="09:45 PM">09:45 PM (Dinner)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="res-guests-input" className="block text-gray-400 font-semibold mb-1">Co-Guests count</label>
                      <input
                        id="res-guests-input"
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={reserveGuests}
                        onChange={(e) => setReserveGuests(parseInt(e.target.value) || 2)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="res-table-pref-select" className="block text-gray-400 font-semibold mb-1">Ambient Area</label>
                      <select
                        id="res-table-pref-select"
                        value={reserveTablePref}
                        onChange={(e) => setReserveTablePref(e.target.value as any)}
                        className="w-full p-3 bg-gray-900 border border-gray-800 focus:outline-none focus:border-orange-500 rounded-xl text-white"
                      >
                        <option value="any">Standard Vacancy</option>
                        <option value="garden">Open Air Canopy</option>
                        <option value="inside">AC Classic Salon</option>
                        <option value="private">VIP Closed Lounge</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="reserve-submit-btn"
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer shadow-md shadow-orange-500/10 active:scale-95 transition"
                  >
                    Confirm Vacancy Request
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 11. CUSTOMER FEEDBACK & GOOGLE-STYLE REVIEWS TESTIMONIALS */}
      <section id="customer-testimonials-section" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Reviews display (Left Col-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 py-1 px-3 rounded-full uppercase tracking-widest inline-block mb-3 leading-none animate-pulse">
                  Guest Book Sentiment
                </span>
                <h2 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">
                  Google Testimonials
                </h2>
                <p className="text-gray-500 text-xs leading-normal mt-1">
                  100% verified comments from local corporate staffs, local students, and family customers
                </p>
              </div>

              <div className="space-y-4">
                {reviews
                  .filter((r) => r.isFeatured)
                  .map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                          <span className="text-[10px] font-medium text-gray-400">Verified Diner • {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Render stars */}
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: item.rating }).map((_, idx) => (
                            <Star key={idx} size={13} className="fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-650 italic leading-relaxed">
                        "{item.comment}"
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Inline Review entry (Right Col-5) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                <MessageSquare className="text-orange-500 animate-bounce" size={18} />
                <span>Publish Your Experience</span>
              </h3>
              <p className="text-xs text-gray-400 leading-normal mb-5">
                We read every review. Share ratings for culinary flavor, service hospitality, and ambient vibes.
              </p>

              <AnimatePresence>
                {revSuccess ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-orange-50 border border-orange-100 text-center p-5 rounded-2xl"
                  >
                    <CheckCircle className="mx-auto text-orange-600 mb-2" size={32} />
                    <h4 className="font-bold text-sm text-orange-950">Review Submited Successfully!</h4>
                    <p className="text-[11px] text-orange-700 leading-relaxed mt-2.5">
                      Your rating is cataloged. To avoid promotional spam, customer reviews are audited inside the Owner Control center before publishing.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                    <div>
                      <label htmlFor="rev-name-input" className="block text-gray-500 font-bold mb-1">Your Professional Name</label>
                      <input
                        id="rev-name-input"
                        type="text"
                        required
                        placeholder="e.g. Rohini Prasad"
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Overall Star Rating</label>
                        <select
                          value={revRating}
                          onChange={(e) => setRevRating(parseInt(e.target.value) || 5)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Very Good)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Poor)</option>
                          <option value="1">1 Star (Disgrace)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Culinary Flavor</label>
                        <select
                          value={revFoodRating}
                          onChange={(e) => setRevFoodRating(parseInt(e.target.value) || 5)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <option value="5">5/5 Elite</option>
                          <option value="4">4/5 Fresh</option>
                          <option value="3">3/5 Satisfactory</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Service & Hospitality</label>
                        <select
                          value={revServiceRating}
                          onChange={(e) => setRevServiceRating(parseInt(e.target.value) || 5)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <option value="5">5/5 Responsive</option>
                          <option value="4">4/5 Courteous</option>
                          <option value="3">3/5 Medium</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Ambient Vibe</label>
                        <select
                          value={revAmbianceRating}
                          onChange={(e) => setRevAmbianceRating(parseInt(e.target.value) || 5)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <option value="5">5/5 Peaceful</option>
                          <option value="4">4/5 Well-lit</option>
                          <option value="3">3/5 Average</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rev-comment-input" className="block text-gray-500 font-bold mb-1">Your Detailed Review</label>
                      <textarea
                        id="rev-comment-input"
                        required
                        rows={3}
                        placeholder="Write details about the Butter Chicken, the service, or the Nizami Dum Biryani here..."
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl resize-none"
                      />
                    </div>

                    <button
                      id="feed-submit-btn"
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase py-3.5 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
                    >
                      Publish Checked Review
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 12. CONTACT & INTEGRATED GOOGLE MAP */}
      <section id="contact-location-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Quick specifications (Left Col-5) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 py-1 px-3 rounded-full uppercase tracking-widest inline-block mb-3 leading-none">
                  Get In Touch
                </span>
                <h2 className="text-3xl font-bold font-sans text-gray-950 tracking-tight">
                  Reach Spice Garden
                </h2>
                <p className="text-gray-500 text-xs">
                  We are conveniently situated centrally in Cyberabad hub, catering to both digital and residential guests.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <MapPin size={20} className="text-orange-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Main Destination Address</p>
                    <p className="text-gray-500 leading-normal mt-1">
                      Plot 14, Hi-Tech City Main Road, Opposite Cyber Towers, Madhapur, Hyderabad, Telangana 500081
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Phone size={20} className="text-orange-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Phone Hotline</p>
                    <p className="text-gray-500 leading-normal mt-1">
                      General queries: +91 98765 43210<br />
                      Corporate team events: +91 91772 34567
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Mail size={20} className="text-orange-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Email Services</p>
                    <p className="text-gray-500 mt-1">booking@spicegardenhyderabad.in</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Clock size={20} className="text-orange-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">Live Hours</p>
                    <p className="text-gray-500 leading-normal mt-1">
                      Mon - Fri: 11:30 AM – 11:30 PM<br />
                      Sat - Sun: 08:00 AM – 11:45 PM (Breakfast starts early!)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium CSS Maps skeleton (Right Col-7) */}
            <div className="lg:col-span-7 bg-gray-150 rounded-3xl h-96 overflow-hidden relative shadow-inner border border-gray-200">
              {/* Decorative premium map layer styling */}
              <div className="absolute inset-0 bg-orange-100/10 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-sm bg-white/95 p-6 rounded-2xl border border-gray-100 shadow-xl relative z-10">
                  <MapPin className="text-orange-500 mx-auto animate-bounce" size={40} />
                  <div>
                    <h4 className="font-bold text-gray-950 text-sm">Opposite Cyber Towers, Madhapur</h4>
                    <p className="text-gray-450 text-[11px] leading-relaxed mt-1">
                      Situated exactly in Madhapur IT Terminal. High parking space available with standard secure valets.
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] uppercase py-2.5 px-4 rounded-xl inline-block mt-2 transition"
                  >
                    Open Live Navigation Guide
                  </a>
                </div>
              </div>

              {/* Vector grid simulation to resemble premium location visualizer */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f97316 1.3px, transparent 1.3px)', backgroundSize: '16px 16px' }} />
              <div className="absolute top-1/2 left-1/3 w-32 h-2 bg-gray-400 rounded-full" />
              <div className="absolute top-1/3 left-1/2 w-2 h-44 bg-gray-400 rounded-full" />
              <div className="absolute top-1/4 left-1/4 w-44 h-2 bg-gray-300 rounded-full" />
            </div>

          </div>
        </div>
      </section>

      {/* 13. CORE DOCUMENT FOOTER */}
      <footer id="main-application-footer" className="bg-gray-950 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-gray-850">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
          
          <div className="space-y-4">
            <span className="font-serif italic font-bold text-2xl text-white tracking-wide">Spice Garden</span>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 mt-1 block font-bold font-sans">Family Restaurant</span>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Delectable multi-cuisine dining options specializing in North Indian Dum Biryani, South Indian breakfast, and classic Chinese takeaways.
            </p>
            {/* Direct Admin Launch link in footer */}
            <p
              onClick={() => setIsAdminOpen(true)}
              className="text-[11px] font-bold text-orange-400 hover:text-orange-500 transition cursor-pointer underline flex items-center gap-1 w-fit"
            >
              <span>🔒 Admin Console Login</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Quick Links</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400 font-semibold">
              <a href="#featured-specials-section" className="hover:text-white transition">Kitchen Specials</a>
              <a href="#complete-menu-section" className="hover:text-white transition">Gastronomy Menu</a>
              <a href="#about-us-section" className="hover:text-white transition">Heritage Dossier</a>
              <a href="#loyalty-hub-section" className="hover:text-white transition">Privilege Club</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Opening Standard Hours</h4>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p className="flex items-center gap-2">
                <Clock3 size={12} className="text-gray-500" />
                <span>Weekdays: 11:30 AM – 11:30 PM</span>
              </p>
              <p className="flex items-center gap-2 text-white font-semibold">
                <CalendarDays size={12} className="text-orange-400 animate-pulse" />
                <span>Weekends: 08:00 AM – 11:45 PM</span>
              </p>
              <span className="text-[10px] text-gray-500 block">Early weekend breakfast services available!</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Spice Garden Madhapur</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Plot 14, Hi-Tech City Main Road, Opposite Cyber Towers, Madhapur, Hyderabad - 500081<br />
              Telangana, India
            </p>
            <p className="text-xs text-orange-400 font-bold mt-1">Hotline: +91 98765 43210</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-850/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Spice Garden Family Restaurant Terminal. All Rights Reserved. Co-managed in Cyberabad.</p>
          <div className="flex gap-4 font-semibold">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">F&B Licensing</a>
            <a href="#" className="hover:text-white">Terms of Privileges</a>
          </div>
        </div>
      </footer>

      {/* --- INTEGRATED EXCLUSIVE OVERLAY POPUPS AND DRAWER COMPONENTS --- */}
      
      {/* 1. Lead popup triggers selectively based on timer rules loaded */}
      <LeadPopup onAddLead={handleAddLead} />

      {/* 2. Floating action button handles online shopping cart bag & Whatsapp messaging */}
      <WhatsAppFloatingButton
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCart([])}
        onConfirmPreOrder={handleConfirmPreOrder}
      />

      {/* 3. Fully Working Admin Panel/Console Modal Drawer */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard
            reservations={reservations}
            leads={leads}
            feedbacks={reviews}
            specials={specials}
            offers={offers}
            orders={orders}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onUpdateSpecial={handleUpdateSpecial}
            onToggleOffer={handleToggleOffer}
            onUpdateFeedbackFeatured={handleUpdateFeedbackFeatured}
            onAddSpecial={(special) => setSpecials([...specials, special])}
            onToggleDashboard={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
