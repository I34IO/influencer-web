// API Configuration
// This file manages API endpoints and configuration

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.80.222.41:3000/api/public',
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
  const url = new URL(endpoint, API_CONFIG.baseURL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
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
