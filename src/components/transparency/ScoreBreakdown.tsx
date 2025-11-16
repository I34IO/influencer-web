'use client';

import { useEffect, useState } from 'react';
import { ScoreBreakdown as ScoreBreakdownType } from '@/types/transparency';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ScoreBreakdownProps {
  influencerId: string;
}

export default function ScoreBreakdown({ influencerId }: ScoreBreakdownProps) {
  const [breakdown, setBreakdown] = useState<ScoreBreakdownType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['combined']));

  useEffect(() => {
    fetchBreakdown();
  }, [influencerId]);

  const fetchBreakdown = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/transparency/breakdown/${influencerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch score breakdown');
      }

      setBreakdown(data.breakdown);
    } catch (err: any) {
      setError(err.message || 'Failed to load score breakdown');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
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

  if (!breakdown) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Combined Score */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
        <button
          onClick={() => toggleSection('combined')}
          className="w-full flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
              Combined Trust Score
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
              {breakdown.combinedScore.calculation}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {breakdown.combinedScore.value.toFixed(1)}
            </div>
            {expandedSections.has('combined') ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('combined') && (
          <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  AI Score (60%)
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {breakdown.aiScore.value.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Community Score (40%)
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {breakdown.communityScore.value.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('ai')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-12 bg-blue-500 rounded-full" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                AI Score
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on mentions and sentiment analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {breakdown.aiScore.value.toFixed(1)}
            </div>
            {expandedSections.has('ai') ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('ai') && (
          <div className="px-4 pb-4 space-y-3">
            <ScoreComponent
              label="Base Score"
              value={breakdown.aiScore.components.baseScore}
              color="gray"
            />
            <ScoreComponent
              label="Drama Impact"
              value={breakdown.aiScore.components.dramaImpact}
              color={breakdown.aiScore.components.dramaImpact < 0 ? 'red' : 'gray'}
            />
            <ScoreComponent
              label="Positive Impact"
              value={breakdown.aiScore.components.positiveImpact}
              color={breakdown.aiScore.components.positiveImpact > 0 ? 'green' : 'gray'}
            />
            <ScoreComponent
              label="Sentiment Adjustment"
              value={breakdown.aiScore.components.sentimentAdjustment}
              color={
                breakdown.aiScore.components.sentimentAdjustment > 0
                  ? 'green'
                  : breakdown.aiScore.components.sentimentAdjustment < 0
                  ? 'red'
                  : 'gray'
              }
            />
          </div>
        )}
      </div>

      {/* Community Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('community')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-12 bg-green-500 rounded-full" />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Community Score
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on user ratings and reports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {breakdown.communityScore.value.toFixed(1)}
            </div>
            {expandedSections.has('community') ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('community') && (
          <div className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Average Rating:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                  {breakdown.communityScore.components.averageRating.toFixed(1)}★
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Ratings:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                  {breakdown.communityScore.components.totalRatings}
                </span>
              </div>
            </div>
            <ScoreComponent
              label="Rating Impact"
              value={breakdown.communityScore.components.ratingImpact}
              color={
                breakdown.communityScore.components.ratingImpact > 0
                  ? 'green'
                  : breakdown.communityScore.components.ratingImpact < 0
                  ? 'red'
                  : 'gray'
              }
            />
            <ScoreComponent
              label={`Drama Impact (${breakdown.communityScore.components.dramaReports} reports)`}
              value={breakdown.communityScore.components.dramaImpact}
              color="red"
            />
            <ScoreComponent
              label={`Positive Impact (${breakdown.communityScore.components.positiveReports} reports)`}
              value={breakdown.communityScore.components.positiveImpact}
              color="green"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreComponent({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'gray' | 'red' | 'green';
}) {
  const colorClasses = {
    gray: 'text-gray-600 dark:text-gray-400',
    red: 'text-red-600 dark:text-red-400',
    green: 'text-green-600 dark:text-green-400',
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <span className={`text-sm font-semibold ${colorClasses[color]}`}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}
      </span>
    </div>
  );
}
