'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface RatingDisplayProps {
  rating: number; // 0-5
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function RatingDisplay({
  rating,
  totalRatings,
  size = 'md',
  showNumber = true,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon
            key={i}
            className={`${sizeClasses[size]} text-yellow-400`}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIconOutline
              className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon
                className={`${sizeClasses[size]} text-yellow-400`}
              />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIconOutline
            key={i}
            className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">{renderStars()}</div>
      {showNumber && (
        <span className={`${textSizeClasses[size]} font-medium text-gray-900 dark:text-white`}>
          {rating.toFixed(1)}
        </span>
      )}
      {totalRatings !== undefined && totalRatings > 0 && (
        <span className={`${textSizeClasses[size]} text-gray-500 dark:text-gray-400`}>
          ({totalRatings.toLocaleString()})
        </span>
      )}
    </div>
  );
}
