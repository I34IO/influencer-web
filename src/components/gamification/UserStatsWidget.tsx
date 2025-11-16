'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserStats } from '@/types/gamification';
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  FlagIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolidIcon } from '@heroicons/react/24/solid';

export default function UserStatsWidget() {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    fetchStats();
  }, [user, session]);

  const fetchStats = async () => {
    if (!session?.access_token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gamification/stats', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  // Not authenticated
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center">
          <TrophyIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Sign in to track your progress and earn achievements
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-900 p-4">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchStats}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No stats yet
  if (!stats) {
    return null;
  }

  const getLevelBadgeColor = (level: number) => {
    if (level >= 20) return 'from-purple-500 to-pink-500';
    if (level >= 15) return 'from-yellow-400 to-orange-500';
    if (level >= 10) return 'from-blue-500 to-cyan-500';
    if (level >= 5) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Level Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${getLevelBadgeColor(
              stats.level
            )} flex items-center justify-center shadow-lg`}
          >
            <TrophySolidIcon className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full px-1.5 py-0.5 border-2 border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {stats.level}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Level {stats.level}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reputation: {stats.reputationScore}/100
            </p>
          </div>
        </div>

        {/* Streak */}
        {stats.streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {stats.streak}
            </span>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Experience
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {stats.experiencePoints} / {stats.xpForNextLevel} XP
          </span>
        </div>
        <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(stats.xpProgress)}% to Level {stats.level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Ratings */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2.5 text-center">
          <StarIcon className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.totalRatings}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ratings</p>
        </div>

        {/* Reports */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2.5 text-center">
          <FlagIcon className="w-5 h-5 mx-auto text-red-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.totalReports}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reports</p>
        </div>

        {/* Comments */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2.5 text-center">
          <ChatBubbleLeftIcon className="w-5 h-5 mx-auto text-blue-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.totalComments}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.unlockedAchievements} / {stats.totalAchievements}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Achievements Unlocked
              </p>
            </div>
          </div>
          <Link
            href="/achievements"
            className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Leaderboard Link */}
      <Link
        href="/leaderboard"
        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ChartBarIcon className="w-4 h-4" />
        View Leaderboard
      </Link>
    </div>
  );
}
