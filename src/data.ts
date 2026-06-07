/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Breakfast (South Indian Classics)
  {
    id: 'brk-1',
    name: 'Ghee Podi Masala Dosa',
    description: 'Crispy rice crêpe smeared with aromatic spiced gunpowder (podi), creamy potato masla, and pure ghee. Served with coconut chutney and piping hot sambar.',
    price: 130,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isPopular: true,
    spicyLevel: 1
  },
  {
    id: 'brk-2',
    name: 'Neyyappam Steamed Idli (3 Pcs)',
    description: 'Pillowy soft steamed fermented rice and lentil cakes, floating in our signature rich and flavorful lentil sambar, topped with coriander.',
    price: 90,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 0
  },
  {
    id: 'brk-3',
    name: 'Crispy Medu Vada (2 Pcs)',
    description: 'Golden, crispy-on-the-outside and fluffy-on-the-inside black lentil fritters spiced with peppercorns and curry leaves. Best paired with ginger chutney.',
    price: 95,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 1
  },
  {
    id: 'brk-4',
    name: 'Hyderabadi Puri Sabzi (3 Pcs)',
    description: 'Fluffy whole-wheat puffed breads served with spicy home-style potato masala curry and tangy onion relish.',
    price: 110,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 1
  },

  // Lunch / Main Dishes (North Indian & South Indian Biryanis)
  {
    id: 'lun-1',
    name: 'Nizami Hyderabadi Chicken Biryani',
    description: 'World-famous long-grain basmati rice layered with juicy marinated chicken, hand-ground Nizami spices, and saffron. Slow-cooked on dum. Served with Mirchi Ka Salan and Raita.',
    price: 360,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600',
    isVegetarian: false,
    isPopular: true,
    spicyLevel: 2
  },
  {
    id: 'lun-2',
    name: 'Signature Paneer Butter Masala',
    description: 'Soft cubes of fresh malai paneer simmered in a rich, buttery, sweet-and-creamy tomato and cashew nut gravy flavored with dry fenugreek leaves.',
    price: 290,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isPopular: true,
    spicyLevel: 1
  },
  {
    id: 'lun-3',
    name: 'Tandoori Murgh (Full)',
    description: 'Tender chicken marinated overnight in Greek yogurt, Kashmiri red chilies, and a proprietary blend of home-ground tandoori tikkas, char-grilled to perfection.',
    price: 490,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600',
    isVegetarian: false,
    spicyLevel: 2
  },
  {
    id: 'lun-4',
    name: 'Royal Spice Garden Veg Thali',
    description: 'A luxurious mini-banquet: Dal Makhani, Paneer Sabzi, Dry Veg Of The Day, Jeera Rice, Baby Butter Naan (1 Pc), Raita, Chutney, and hot Gulab Jamun.',
    price: 280,
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 1
  },

  // Dinner / Special Mains and Chinese
  {
    id: 'din-1',
    name: 'Old-Style Butter Chicken (Murgh Makhani)',
    description: 'Classic tandoori chicken cooked in a silky satin-smooth tomato gravy with rich butter, fresh cream, and a gentle touch of aromatic spices.',
    price: 340,
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
    isVegetarian: false,
    isPopular: true,
    spicyLevel: 1
  },
  {
    id: 'din-2',
    name: 'Szechuan Chilli Chicken',
    description: 'Crispy batter-fried chicken bites tossed with fresh bell peppers, string onions, garlic, and hot home-crafted dark Szechuan chilli sauce.',
    price: 280,
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600',
    isVegetarian: false,
    spicyLevel: 3
  },
  {
    id: 'din-3',
    name: 'Trio Hakka Noodles (Veg/Chicken/Egg)',
    description: 'Stir-fried high-heat wok noodles packed with julienned colorful bell peppers, carrots, spring onions, and tossed in balanced premium soy sauce.',
    price: 220,
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 1
  },
  {
    id: 'din-4',
    name: 'Slow Cooked Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with fresh tomatoes, pure butter, garlic, and fresh cream. Best coupled with crispy garlic naan.',
    price: 240,
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 0
  },

  // Beverages
  {
    id: 'bev-1',
    name: 'Namma Hyderabad Filter Coffee',
    description: 'Brewed from fresh chicory-blend coffee decoction and organic frothy milk. Served traditionally in a brass davarah and tumbler.',
    price: 60,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 0
  },
  {
    id: 'bev-2',
    name: 'Kesari Mango Lassi',
    description: 'Thick, creamy sweet yogurt beverage blended with premium Alphonso mango pulp, saffron strands, and crushed pistachios.',
    price: 110,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isPopular: true,
    spicyLevel: 0
  },
  {
    id: 'bev-3',
    name: 'Fresh Mint Lime Cooler',
    description: 'Thirst-quenching iced sparkling crusher made with handpicked organic garden mint, lime, sea salt, and fresh sugar cane broth syrup.',
    price: 80,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 0
  },

  // Desserts
  {
    id: 'des-1',
    name: 'Hyderabad Double Ka Meetha',
    description: 'Famous Nizam-era bread pudding soaked in saffron-infused thickened milk, cardamom, and ghee, topped generously with fried silver cashews.',
    price: 140,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    isPopular: true,
    spicyLevel: 0
  },
  {
    id: 'des-2',
    name: 'Gulab Jamun with Vanilla Bean Gelato',
    description: 'Two hot, fried milk dumplings steeped in rosewater and saffron sugar syrup, countered with authentic cold vanilla bean gelato scoop.',
    price: 120,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isVegetarian: true,
    spicyLevel: 0
  }
];

export const INITIAL_TODAYS_SPECIALS = [
  {
    id: 'spe-1',
    name: 'Kaju Paneer Dum Biryani',
    description: 'Spiced baby paneer cubes and crunchy buttery cashews layered with premium long grain basmati rice, slow cooked in hand-crafted sealed clay handis.',
    price: 320,
    discountPercentage: 15,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'spe-2',
    name: 'Guntur Spicy Tandoori Prawns',
    description: 'Jumbo prawns cured with traditional red hot Guntur chilies, tandoori yogurt marinade, lime, cooked over charcoal with butter glaze.',
    price: 450,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rohan Sharma',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    ambianceRating: 5,
    comment: 'The Nizami Chicken Biryani here is absolutely outstanding! Reminds me of old city biryani but served in a very clean, spacious family environment. Extremely courteous staff.',
    createdAt: '2026-06-05T12:00:00Z',
    isFeatured: true
  },
  {
    id: 'rev-2',
    name: 'Sravya Reddy',
    rating: 5,
    foodRating: 5,
    serviceRating: 4,
    ambianceRating: 5,
    comment: 'The Ghee Podi Masala Dosa is incredible for breakfast. Clean, family-friendly, well lit, and the warm decor matches the high culinary standards. Will visit again!',
    createdAt: '2026-06-04T09:30:00Z',
    isFeatured: true
  },
  {
    id: 'rev-3',
    name: 'Anupama Sengupta',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    ambianceRating: 4,
    comment: 'Great value for IT professionals! We had our team lunch here. Order on WhatsApp feature is very handy, we placed the order ahead of time and it was ready. Butter Chicken is highly recommended!',
    createdAt: '2026-06-01T14:15:00Z',
    isFeatured: true
  }
];

export const FESTIVAL_OFFERS = [
  {
    id: 'fest-1',
    title: 'Hyderabad IT Employee Lunch Offer',
    description: 'Get Flat 10% Off on Dine-in by showing your corporate ID card on weekdays (Mon-Fri 12:00 PM to 4:00 PM).',
    code: 'SPICEIT10',
    isActive: true
  },
  {
    id: 'fest-2',
    title: 'Weekend Biryani Feast Special',
    description: 'Order any 2 Family Size Biryanis and get a complimentary portion of Hyderabad Double Ka Meetha and 2 Fresh Coolers!',
    code: 'BIRYANIWEEKEND',
    isActive: true
  }
];
