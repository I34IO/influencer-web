import { type ClassValue, clsx } from 'clsx';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format percentage
export function formatPercentage(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0.0%';
  }
  return num.toFixed(1) + '%';
}

// Format date relative to now (e.g., "2 hours ago", "3 days ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// Format date to readable string
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get tier color
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    platinum: 'text-purple-600 bg-purple-50',
    gold: 'text-yellow-600 bg-yellow-50',
    silver: 'text-gray-600 bg-gray-50',
    bronze: 'text-orange-600 bg-orange-50',
  };
  return colors[tier] || 'text-gray-600 bg-gray-50';
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    pending: 'text-yellow-600 bg-yellow-50',
    suspended: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

// Get platform icon/color
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: 'text-pink-600 bg-pink-50',
    tiktok: 'text-black bg-gray-50',
    youtube: 'text-red-600 bg-red-50',
    twitter: 'text-blue-600 bg-blue-50',
  };
  return colors[platform] || 'text-gray-600 bg-gray-50';
}

// Calculate growth percentage
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate avatar URL
export function getAvatarUrl(id: string, size: number = 150): string {
  return `https://i.pravatar.cc/${size}?img=${id}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Generate random color
export function generateColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}
