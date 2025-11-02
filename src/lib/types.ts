export interface User {
  id: number;
  email: string;
  name: string;
  college: string;
  phone?: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  status: string;
  createdAt: string;
}

export const CATEGORIES = [
  "books",
  "electronics",
  "stationery",
  "furniture",
  "clothing",
] as const;

export type Category = (typeof CATEGORIES)[number];
