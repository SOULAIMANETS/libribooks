import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Link } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to parse links from textarea input
export function parseLinks(text: string): Link[] {
  if (!text.trim()) return [];

  return text.split('\n').map(line => {
    const [label = '', href = ''] = line.split(',').map(s => s.trim());
    return { label, href };
  }).filter(link => link.label && link.href);
}

// Utility function to format links for textarea display
export function formatLinks(links: Link[]): string {
  return links.map(link => `${link.label},${link.href}`).join('\n');
}

// Utility function to validate HSL color format
export function isValidHslColor(color: string): boolean {
  // Basic HSL validation: "201 41% 55%"
  const hslRegex = /^\d{1,3}\s\d{1,3}%\s\d{1,3}%$/;
  return hslRegex.test(color);
}

// Utility function to ensure email is properly formatted
export function normalizeEmail(email?: string): string | undefined {
  return email?.trim() || undefined;
}

// Loading delay utility for consistent UX
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
