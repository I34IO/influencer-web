'use client';

import { useEffect, useState } from 'react';
import { fetchAnalytics } from '@/lib/services/api';
import { Analytics } from '@/types';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { useTranslations } from '@/components/providers';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

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
          {/* Top Row - Logo and Controls */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">{t.app.title}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{t.app.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
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
            {analytics.topPerformers.map((influencer) => (
              <div
                key={influencer.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <img
                  src={influencer.profileImage}
                  alt={influencer.fullName}
                  className="w-12 h-12 rounded-full ring-2 ring-primary-100 dark:ring-primary-800/50"
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
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity - Mobile Optimized */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.recentActivity}</h2>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-400 mt-1.5 flex-shrink-0" />
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
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 md:hidden z-50 shadow-lg">
        <div className="flex items-center justify-around gap-2">
          <a 
            href="/influencers" 
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-1"
          >
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Influencers</span>
          </a>
          
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
