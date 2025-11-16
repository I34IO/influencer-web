// Placeholder image utilities

/**
 * Generate a placeholder avatar image URL
 * Uses ui-avatars.com API to generate colorful avatar with initials
 */
export function getPlaceholderAvatar(name: string, size: number = 200): string {
  const encodedName = encodeURIComponent(name || 'User');
  
  // Generate a consistent color based on the name
  const colors = [
    '4F46E5', // Indigo
    '7C3AED', // Violet
    'EC4899', // Pink
    'EF4444', // Red
    'F59E0B', // Amber
    '10B981', // Emerald
    '3B82F6', // Blue
    '8B5CF6', // Purple
    '06B6D4', // Cyan
    'F97316', // Orange
  ];
  
  // Simple hash function to pick a color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${backgroundColor}&color=fff&bold=true&format=png`;
}

/**
 * Get image URL with fallback to placeholder
 */
export function getImageWithFallback(imageUrl: string | null | undefined, name: string, size: number = 200): string {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return getPlaceholderAvatar(name, size);
}

/**
 * Generate a placeholder image for content (not avatars)
 * Uses placeholder.com for generic placeholder images
 */
export function getPlaceholderImage(width: number = 400, height: number = 300, text?: string): string {
  const displayText = text ? encodeURIComponent(text) : 'No Image';
  return `https://via.placeholder.com/${width}x${height}/4F46E5/FFFFFF?text=${displayText}`;
}
