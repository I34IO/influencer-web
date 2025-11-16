// API Configuration
// Direct Supabase connection - no proxy needed

export const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  debug: process.env.NEXT_PUBLIC_API_DEBUG === 'true',
};

// Helper function for API logging
export function logAPI(method: string, action: string, data?: any) {
  if (API_CONFIG.debug) {
    console.log(`[API ${method}]`, action, data || '');
  }
}

// Helper function for error logging
export function logAPIError(method: string, action: string, error: any) {
  if (API_CONFIG.debug) {
    console.error(`[API ${method} ERROR]`, action, error);
  }
}
