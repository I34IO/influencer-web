'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAnalytics } from '@/lib/services/api';
import { Analytics } from '@/types';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { getImageWithFallback } from '@/lib/utils/placeholder';
import { useTranslations, useAuth } from '@/components/providers';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">{t.error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          {/* Top Row - Logo, Search, and Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">{t.app.title}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{t.app.subtitle}</p>
            </div>

            {/* Search Bar - Inline */}
            <div className="relative flex-1 max-w-xl hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <LanguageSwitcher />
              {user ? (
                <div className="flex items-center gap-2">
                  {process.env.NODE_ENV !== 'production' && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative md:hidden mt-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t.dashboard.totalInfluencers}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{analytics.totalInfluencers}</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">
              {analytics.activeInfluencers} {t.dashboard.active}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t.dashboard.totalFollowers}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatNumber(analytics.totalFollowers)}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">
              {t.dashboard.acrossPlatforms}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t.dashboard.avgEngagement}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatPercentage(analytics.averageEngagement)}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">
              {t.dashboard.networkAverage}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{t.dashboard.topPerformers}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.topPerformers.length}
            </p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 font-medium">
              {t.dashboard.platinumTier}
            </p>
          </div>
        </div>

        {/* Top Performers - Mobile Optimized */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.topPerformers}</h2>
          <div className="space-y-3">
            {analytics.topPerformers
              .filter((influencer) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  influencer.fullName.toLowerCase().includes(query) ||
                  influencer.username.toLowerCase().includes(query) ||
                  influencer.category?.toLowerCase().includes(query)
                );
              })
              .map((influencer) => (
              <Link
                key={influencer.id}
                href={`/influencers/${influencer.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500 transition-colors cursor-pointer"
              >
                <Image
                  src={getImageWithFallback(influencer.profileImage, influencer.fullName, 96)}
                  alt={influencer.fullName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full ring-2 ring-primary-100 dark:ring-primary-800/50 object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getImageWithFallback(null, influencer.fullName, 96);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {influencer.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {influencer.username}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatNumber(influencer.followers)} {t.dashboard.followers}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg px-3 py-1.5 border border-transparent dark:border-primary-800/50">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-300">
                      {influencer.overallScore}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.dashboard.score}</p>
                </div>
              </Link>
            ))}
            {searchQuery && analytics.topPerformers.filter((influencer) => {
              const query = searchQuery.toLowerCase();
              return (
                influencer.fullName.toLowerCase().includes(query) ||
                influencer.username.toLowerCase().includes(query) ||
                influencer.category?.toLowerCase().includes(query)
              );
            }).length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No influencers found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity - Mobile Optimized */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.recentActivity}</h2>
          <div className="space-y-3">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.slice(0, 5).map((activity) => {
                // Determine icon based on activity type
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'new_influencer':
                      return (
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      );
                    case 'rank_change':
                      return (
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      );
                    case 'post':
                      return (
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      );
                    case 'milestone':
                      return (
                        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      );
                    default:
                      return (
                        <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400" />
                      );
                  }
                };

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0"
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white leading-snug">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.influencerName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Activity from the last 7 days will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 md:hidden z-50 shadow-lg">
        <div className="flex items-center justify-around gap-2">
          <Link 
            href="/influencers" 
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1"
          >
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Influencers</span>
          </Link>
          
          <a 
            href="/rankings" 
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Rankings</span>
          </a>
          
          <a 
            href="/qr/scan" 
            className="flex flex-col items-center gap-1 px-4 py-2 bg-secondary-600 dark:bg-secondary-500 rounded-xl hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors shadow-lg flex-1"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-bold text-white">Scan QR</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
