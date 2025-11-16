'use client';

import { useEffect, useState } from 'react';
import { CommunitySignal, SignalType } from '@/types/community';
import { ChatBubbleLeftIcon, ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import RatingDisplay from './RatingDisplay';

interface CommunitySignalsProps {
  influencerId: string;
  filterType?: SignalType | 'ALL';
}

export default function CommunitySignals({
  influencerId,
  filterType = 'ALL',
}: CommunitySignalsProps) {
  const [signals, setSignals] = useState<CommunitySignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSignals();
  }, [influencerId, filterType]);

  const fetchSignals = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        influencerId,
        ...(filterType !== 'ALL' && { type: filterType }),
      });

      const response = await fetch(`/api/community/signals?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signals');
      }

      setSignals(data.signals || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load community signals');
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalIcon = (type: SignalType) => {
    switch (type) {
      case 'DRAMA_REPORT':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'POSITIVE_ACTION':
        return <SparklesIcon className="h-5 w-5 text-green-500" />;
      case 'COMMENT':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSignalLabel = (type: SignalType) => {
    switch (type) {
      case 'RATING':
        return 'Rating';
      case 'DRAMA_REPORT':
        return 'Drama Report';
      case 'POSITIVE_ACTION':
        return 'Positive Action';
      case 'COMMENT':
        return 'Comment';
    }
  };

  const getSignalBadgeColor = (type: SignalType) => {
    switch (type) {
      case 'DRAMA_REPORT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'POSITIVE_ACTION':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'RATING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'COMMENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-24"
          />
        ))}
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

  if (signals.length === 0) {
    return (
      <div className="text-center py-12">
        <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No community signals yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {signal.type === 'RATING' ? (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full">
                  <RatingDisplay rating={signal.rating || 0} showNumber={false} size="sm" />
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  {getSignalIcon(signal.type)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSignalBadgeColor(
                    signal.type
                  )}`}
                >
                  {getSignalLabel(signal.type)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
                </span>
              </div>

              {signal.type === 'RATING' && signal.rating && (
                <div className="mb-2">
                  <RatingDisplay rating={signal.rating} showNumber={true} size="sm" />
                </div>
              )}

              {signal.comment && (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {signal.comment}
                </p>
              )}

              {signal.tags && signal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {signal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
