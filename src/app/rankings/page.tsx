'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchInfluencers } from '@/lib/services/api';
import { Influencer } from '@/types';
import { formatNumber } from '@/lib/utils';
import { getImageWithFallback } from '@/lib/utils/placeholder';

export default function RankingsPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'followers' | 'engagement'>('score');
  const router = useRouter();

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      const data = await fetchInfluencers();
      setInfluencers(data);
    } catch (error) {
      console.error('Failed to load influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedInfluencers = [...influencers].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.overallScore - a.overallScore;
      case 'followers':
        return b.followers - a.followers;
      case 'engagement':
        return b.engagementRate - a.engagementRate;
      default:
        return 0;
    }
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' };
    if (rank === 2) return { emoji: '🥈', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' };
    if (rank === 3) return { emoji: '🥉', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' };
    return { emoji: '', color: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Influencer Rankings</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Top performers ranked by metrics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Sort Options */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort by:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSortBy('score')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                sortBy === 'score'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Trust Score
            </button>
            <button
              onClick={() => setSortBy('followers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                sortBy === 'followers'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setSortBy('engagement')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                sortBy === 'engagement'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Engagement Rate
            </button>
          </div>
        </div>

        {/* Rankings List */}
        <div className="space-y-3">
          {sortedInfluencers.map((influencer, index) => {
            const rank = index + 1;
            const badge = getRankBadge(rank);
            
            return (
              <Link
                key={influencer.id}
                href={`/influencers/${influencer.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${badge.color} flex items-center justify-center font-bold text-lg sm:text-xl`}>
                    {badge.emoji || `#${rank}`}
                  </div>

                  {/* Profile Image */}
                  <Image
                    src={getImageWithFallback(influencer.profileImage, influencer.fullName, 120)}
                    alt={influencer.fullName}
                    width={60}
                    height={60}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-primary-100 dark:ring-primary-800/50 object-cover flex-shrink-0"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getImageWithFallback(null, influencer.fullName, 120);
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                      {influencer.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{influencer.username}
                    </p>
                    {influencer.category && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                        {influencer.category}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    {sortBy === 'score' && (
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {influencer.overallScore}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                      </div>
                    )}
                    {sortBy === 'followers' && (
                      <div>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {formatNumber(influencer.followers)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                      </div>
                    )}
                    {sortBy === 'engagement' && (
                      <div>
                        <p className="text-base sm:text-lg font-bold text-secondary-600 dark:text-secondary-400">
                          {influencer.engagementRate.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {sortedInfluencers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">No rankings available</p>
          </div>
        )}
      </main>
    </div>
  );
}
