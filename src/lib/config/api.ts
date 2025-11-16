// API Configuration
// This file manages API endpoints and configuration

export const API_CONFIG = {
  // Use local Next.js API routes which proxy to the backend
  // This avoids CORS issues and allows the backend to be on a different network
  baseURL: '/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  debug: process.env.NEXT_PUBLIC_API_DEBUG === 'true',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Influencers
  influencers: '/influencers',
  influencerById: (id: string) => `/influencers/${id}`,
  
  // Search
  search: '/search',
  
  // Stats
  stats: '/stats',
  
  // Categories/Niches
  niches: '/niches',
  
  // Rankings (if available)
  rankings: '/rankings',
  
  // Events (if available)
  events: '/events',
  eventById: (id: string) => `/events/${id}`,
};

// Helper function to build full URL
export function buildURL(endpoint: string, params?: Record<string, any>): string {
  // Handle relative URLs (for Next.js API routes)
  let fullUrl: string;
  
  if (API_CONFIG.baseURL.startsWith('http')) {
    // Absolute URL - use URL constructor
    const url = new URL(endpoint, API_CONFIG.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    fullUrl = url.toString();
  } else {
    // Relative URL - build manually
    const path = `${API_CONFIG.baseURL}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      fullUrl = `${path}?${searchParams.toString()}`;
    } else {
      fullUrl = path;
    }
  }
  
  return fullUrl;
}

// Helper function for API logging
export function logAPI(method: string, url: string, data?: any) {
  if (API_CONFIG.debug) {
    console.log(`[API ${method}]`, url, data || '');
  }
}

// Helper function for error logging
export function logAPIError(method: string, url: string, error: any) {
  if (API_CONFIG.debug) {
    console.error(`[API ${method} ERROR]`, url, error);
  }
}
