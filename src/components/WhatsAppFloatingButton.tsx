/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ShoppingBag, X, Plus, Minus, Send, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface WhatsAppFloatingButtonProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onConfirmPreOrder: (orderDetails: { name: string; phone: string; pickupTime: string; totalAmount: number; items: CartItem[] }) => void;
}

export default function WhatsAppFloatingButton({
  cart,
  onUpdateQuantity,
  onClearCart,
  onConfirmPreOrder
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('20 minutes');
  const [customNotes, setCustomNotes] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.menuItem.price * curr.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST on Restaurant food
  const packingCharge = subtotal > 0 ? 25 : 0;
  const grandTotal = subtotal + tax + packingCharge;

  const handleCreateWhatsAppLink = (isWhatsAppMethod: boolean) => {
    if (!name || !phone) return;

    // Structuring order details
    let orderText = `*New Spice Garden Pre-order Request*%0A`;
    orderText += `-------------------------------%0A`;
    orderText += `*Name:* ${name}%0A`;
    orderText += `*Phone:* ${phone}%0A`;
    orderText += `*Pickup Time:* ${pickupTime}%0A`;
    if (customNotes) orderText += `*Instructions:* ${customNotes}%0A`;
    orderText += `-------------------------------%0A`;
    orderText += `*Order Items:*%0A`;

    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.menuItem.name} x ${item.quantity} - (₹${item.menuItem.price * item.quantity})%0A`;
    });

    orderText += `-------------------------------%0A`;
    orderText += `*Subtotal:* ₹${subtotal}%0A`;
    orderText += `*GST (5%):* ₹${tax}%0A`;
    orderText += `*Packing Charges:* ₹${packingCharge}%0A`;
    orderText += `*Grand Total:* *₹${grandTotal}*%0A%0A`;
    orderText += `Please confirm availability and prepare for pickup. Thank you!`;

    // Local DB save
    onConfirmPreOrder({
      name,
      phone,
      pickupTime,
      totalAmount: grandTotal,
      items: [...cart]
    });

    if (isWhatsAppMethod) {
      // Direct Link Spice Garden number (Using hypothetical Spice Garden Hyderabad phone)
      const whatsappNumber = '919876543210';
      const url = `https://wa.me/${whatsappNumber}?text=${orderText}`;
      window.open(url, '_blank', 'noreferrer');
    }

    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      setIsOpen(false);
      onClearCart();
      setName('');
      setPhone('');
      setCustomNotes('');
    }, 3000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div id="whatsapp-fab-container" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-orange-500 text-white rounded-full px-4 py-2 border-2 border-white shadow-xl text-xs font-semibold flex items-center gap-2 pointer-events-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            {totalItems} Item{totalItems > 1 ? 's' : ''} in Bag
          </motion.div>
        )}

        <button
          id="whatsapp-floating-trigger"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition hover:rotate-12 hover:scale-105 relative cursor-pointer group"
          title="Open WhatsApp Cart and Pre-Order"
        >
          {totalItems > 0 ? (
            <ShoppingBag size={24} className="group-hover:animate-bounce" />
          ) : (
            <MessageSquare size={24} className="group-hover:animate-pulse" />
          )}
          {totalItems > 0 && (
            <span id="whatsapp-cart-badge" className="absolute -top-1 -right-1 bg-orange-500 border border-white text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Cart Slider Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-gray-100"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">Pre-Order Food Cart</h3>
                    <p className="text-xs text-gray-400">Spice Garden Hyderabad Pickup</p>
                  </div>
                </div>
                <button
                  id="cart-drawer-close"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isOrdered ? (
                  <div id="pre-order-success" className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-emerald-500 mb-4"
                    >
                      <CheckCircle size={64} className="mx-auto" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h4>
                    <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                      We have logged your pre-order of ₹{grandTotal} in our database and triggered your WhatsApp booking!
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                      Preparing freshly cooked meals...
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div id="cart-drawer-empty" className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
                    <img
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200"
                      alt="Empty cart tray"
                      className="w-28 h-28 object-cover rounded-full filter grayscale opacity-40 mb-4"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="font-bold text-gray-800 text-base mb-1">Your Food Bag is Empty</h4>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
                      Add delicacies like Nizami Biryani or Ghee Podi Dosa from our menu categories below to place your WhatsApp Order & Pre-Order pickup!
                    </p>
                    <button
                      id="cart-empty-back-btn"
                      onClick={() => setIsOpen(false)}
                      className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg tracking-wide transition shadow-sm cursor-pointer"
                    >
                      Explore Spice Garden Menu
                    </button>
                  </div>
                ) : (
                  <div id="cart-items-wrapper" className="space-y-4">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Added Delicacies</span>
                    {cart.map((item) => (
                      <div key={item.menuItem.id} id={`cart-item-${item.menuItem.id}`} className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className={`inline-block w-2.5 h-2.5 border rounded-xs flex-shrink-0 ${item.menuItem.isVegetarian ? 'border-emerald-600 bg-emerald-100' : 'border-red-600 bg-red-100'} p-0.5`} />
                              <h5 className="font-semibold text-sm text-gray-800 truncate">{item.menuItem.name}</h5>
                            </div>
                            <span className="text-xs font-bold text-orange-500">₹{item.menuItem.price} each</span>
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2.5 border border-gray-200 p-1 rounded-lg bg-gray-50/50">
                          <button
                            onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                            className="w-5 h-5 rounded-md hover:bg-white text-gray-500 hover:text-orange-500 flex items-center justify-center transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-gray-700 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                            className="w-5 h-5 rounded-md hover:bg-white text-gray-500 hover:text-orange-500 flex items-center justify-center transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Pre-Order form */}
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-3.5 mt-6">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Pre-Order Details</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="cart-cust-name" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Your Name</label>
                          <input
                            id="cart-cust-name"
                            type="text"
                            required
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="cart-cust-phone" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone (WhatsApp)</label>
                          <input
                            id="cart-cust-phone"
                            type="tel"
                            required
                            placeholder="10-digit number"
                            pattern="[0-9]{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="cart-pickup" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Pickup In</label>
                          <select
                            id="cart-pickup"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                          >
                            <option value="15 minutes">15 minutes</option>
                            <option value="30 minutes">30 minutes</option>
                            <option value="45 minutes">45 minutes</option>
                            <option value="1 hour">1 hour</option>
                            <option value="Later tonight">Later tonight</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="cart-notes" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Custom Cooking Notes</label>
                          <input
                            id="cart-notes"
                            type="text"
                            placeholder="e.g. Less spicy, extra onions"
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Totals & CTA */}
              {!isOrdered && cart.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-white space-y-4">
                  <div className="space-y-1.5 text-sm p-1">
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>GST (5% SGST + CGST)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>Premium Safe-box Packaging</span>
                      <span>₹{packingCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-dashed border-gray-200 pt-2 text-base">
                      <span>Grand Total</span>
                      <span className="text-orange-500">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Dual CTA buttons */}
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <button
                      id="cart-btn-db-order"
                      disabled={!name || !phone}
                      onClick={() => handleCreateWhatsAppLink(false)}
                      className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-1 rounded-xl transition text-xs shadow-sm cursor-pointer text-center"
                      title="Only logs order into the administrator dashboard"
                    >
                      Pre-Order Only
                    </button>

                    <button
                      id="cart-btn-wa-order"
                      disabled={!name || !phone}
                      onClick={() => handleCreateWhatsAppLink(true)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-1 rounded-xl transition text-xs flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      title="Logs order and triggers WhatsApp checkout"
                    >
                      <Send size={12} />
                      WhatsApp Checkout
                    </button>
                  </div>
                  {!name || !phone ? (
                    <span className="block text-[10px] text-orange-500/80 text-center font-medium animate-pulse">
                      * Please fill Customer Name and WhatsApp Phone number above
                    </span>
                  ) : (
                    <span className="block text-[10px] text-gray-400 text-center">
                      Confirming logs details to the Spice Garden Hyderabad live kitchen queue.
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
