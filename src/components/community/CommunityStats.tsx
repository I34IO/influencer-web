'use client';

import { useEffect, useState } from 'react';
import { CommunityStats as CommunityStatsType } from '@/types/community';
import RatingDisplay from './RatingDisplay';
import { ChartBarIcon, ExclamationTriangleIcon, SparklesIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface CommunityStatsProps {
  influencerId: string;
}

export default function CommunityStats({ influencerId }: CommunityStatsProps) {
  const [stats, setStats] = useState<CommunityStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [influencerId]);

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/community/stats/${influencerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to load community stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Community Score
          </h3>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.communityScore.toFixed(1)}
          </div>
        </div>
        
        {stats.totalRatings > 0 && (
          <div className="flex items-center justify-center">
            <RatingDisplay
              rating={stats.averageRating}
              totalRatings={stats.totalRatings}
              size="lg"
            />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Ratings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Ratings
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalRatings}
          </div>
        </div>

        {/* Drama Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Drama
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalDramaReports}
          </div>
        </div>

        {/* Positive Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="h-5 w-5 text-green-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Positive
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalPositiveReports}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Comments
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalComments}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {stats.totalRatings > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Rating Distribution
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] || 0;
              const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                    {star}★
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
