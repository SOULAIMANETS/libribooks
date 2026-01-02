export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  image?: string;
  slug?: string; // Made slug optional to resolve type mismatch
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  category_id?: number;
  category?: Category;
  featured?: boolean;
  reviews?: any[];
  quotes?: any[];
  purchase_urls?: {
    paperback?: string;
    ebook?: string;
    audiobook?: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  slug: string;
  authors?: Author[];
  authorIds?: number[];
  tags?: string[];
}

export interface Article {
  id: number;
  title: string;
  content?: string;
  coverImage?: string; // Renamed from 'image' to match usage in actions.ts
  date?: string; // Renamed from 'published_date' to match usage in other files
  author_id?: number;
  author?: Author;
  slug: string;
  excerpt?: string; // Added to resolve sitemap.xml error
}

export interface Page {
  slug: string;
  title: string;
  content?: string;
  structured_content?: any;
}

export interface Tag {
  id: number;
  name: string;
  category_id?: number;
}

export interface PopupAd {
  id: number;
  name: string;
  content?: string;
  display_delay?: number;
  display_duration?: number;
  is_active?: boolean;
  created_at?: string;
}

// Settings Types
export interface GeneralSettings {
  id?: number;
  site_name: string;
  tagline?: string;
  support_email?: string;
  logo_url?: string;
  favicon_url?: string;
}

export interface SeoSettings {
  id?: number;
  default_title?: string;
  meta_description?: string;
  global_keywords?: string;
  enable_schema?: boolean;
}

export interface AppearanceSettings {
  id?: number;
  enable_dark_mode: boolean;
  headline_font: string;
  body_font: string;
  color_primary: string;
  color_background: string;
  color_accent: string;
  quick_links: Link[];
  legal_links: Link[];
}

export interface RoutingSettings {
  id?: number;
  base_url: string;
  permalink_structure: 'book' | 'review';
  enable_canonical: boolean;
}

export interface IntegrationsSettings {
  id?: number;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  custom_api_key?: string;
}

export interface Link {
  label: string;
  href: string;
}

// Form Types
export type GeneralSettingsFormValues = {
  siteName: string;
  tagline?: string;
  supportEmail?: string;
  logoUrl?: string;
  faviconUrl?: string;
};
export type SeoSettingsFormValues = Omit<SeoSettings, 'id'>;
export type AppearanceSettingsFormValues = {
  enableDarkMode: boolean;
  headlineFont: string;
  bodyFont: string;
  colorPrimary: string;
  colorBackground: string;
  colorAccent: string;
  quickLinks: string;
  legalLinks: string;
};
export type RoutingSettingsFormValues = {
  baseUrl: string;
  permalinkStructure: 'book' | 'review';
  enableCanonical: boolean;
};
export type IntegrationsSettingsFormValues = {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customApiKey?: string;
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Settings API Base Configuration

// Webhook URLs for integrations
export const WEBHOOK_URLS = {
  newReview: '/api/webhooks/new-review',
} as const;

// Export Review type for BookForm
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  book_id: number;
  user_id: number;
  created_at?: string;
}
