

export interface Book {
  id: number;
  slug: string;
  title: string;
  authorIds: number[];
  authors: string[];
  coverImage: string;
  review: string;
  purchaseUrls: {
    paperback?: string;
    audiobook?: string;
    ebook?: string;
  };
  category: string;
  tags: string[];
  quotes?: string[];
  featured?: boolean;
  faq?: { question: string; answer: string }[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
}

export interface Author {
  id: number;
  slug: string;
  name: string;
  image: string;
  bio: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor';
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  structuredContent?: { question: string; answer: string }[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PopupAd {
  id?: number;
  name: string;
  content: string;
  displayDelay: number; // in seconds
  displayDuration: number; // in seconds
  isActive: boolean;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
