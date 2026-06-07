/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'beverages' | 'desserts';
  image: string;
  spicyLevel?: 0 | 1 | 2 | 3;
  isVegetarian: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  tablePref: 'inside' | 'garden' | 'private' | 'any';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Lead {
  id: string;
  email: string;
  phone: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  name: string;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  comment: string;
  createdAt: string;
  isFeatured: boolean;
}

export interface SpecialItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discountPercentage?: number;
}

export interface FestivalOffer {
  id: string;
  title: string;
  description: string;
  code: string;
  isActive: boolean;
}
