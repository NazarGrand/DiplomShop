export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
  isFeatured: boolean;
  specifications?: Array<{ name: string; value: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  isActive: boolean;
  userId: string;
}

export interface Category {
  href: string;
  name: string;
  imageUrl: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface Specification {
  name: string;
  value: string;
}

