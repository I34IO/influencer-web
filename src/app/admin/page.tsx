'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const tables = [
    {
      name: 'Influencers',
      href: '/admin/influencers',
      icon: '👥',
      description: 'Manage influencer profiles and trust scores',
      count: '438',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Mentions',
      href: '/admin/mentions',
      icon: '💬',
      description: 'Manage scraped mentions and sentiment analysis',
      count: '—',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      name: 'Community Signals',
      href: '/admin/community-signals',
      icon: '🎯',
      description: 'Manage user ratings, reports, and comments',
      count: '—',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: '👤',
      description: 'Manage user accounts and subscriptions',
      count: '—',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    },
    {
      name: 'Deep Search',
      href: '/admin/deep-search',
      icon: '🔍',
      description: 'Manage deep search analyses and orders',
      count: '—',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    },
    {
      name: 'Analysis History',
      href: '/admin/analysis-history',
      icon: '📈',
      description: 'View historical trust score data',
      count: '—',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage all database tables and records
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Influencers</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">438</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">—</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Mentions</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">—</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Link
            key={table.name}
            href={table.href}
            className="block bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${table.color} flex items-center justify-center text-xl sm:text-2xl`}>
                {table.icon}
              </div>
              {table.count !== '—' && (
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  {table.count}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {table.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {table.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/influencers?action=create"
            className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-medium text-sm sm:text-base"
          >
            + Add Influencer
          </Link>
          <Link
            href="/admin/mentions?action=create"
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium text-sm sm:text-base"
          >
            + Add Mention
          </Link>
          <Link
            href="/admin/users?action=create"
            className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium text-sm sm:text-base"
          >
            + Add User
          </Link>
          <Link
            href="/admin/community-signals?action=create"
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium text-sm sm:text-base"
          >
            + Add Signal
          </Link>
        </div>
      </div>
    </div>
  );
}
