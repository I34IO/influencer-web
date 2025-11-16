'use client';

import { useEffect, useState } from 'react';
import { EventTimelineEntry } from '@/types/transparency';
import {
  ClockIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface EventTimelineProps {
  influencerId: string;
  limit?: number;
}

export default function EventTimeline({ influencerId, limit = 20 }: EventTimelineProps) {
  const [events, setEvents] = useState<EventTimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchEvents(0);
  }, [influencerId]);

  const fetchEvents = async (currentOffset: number) => {
    if (currentOffset === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError('');

    try {
      const response = await fetch(
        `/api/transparency/timeline/${influencerId}?limit=${limit}&offset=${currentOffset}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch timeline');
      }

      if (currentOffset === 0) {
        setEvents(data.timeline);
      } else {
        setEvents((prev) => [...prev, ...data.timeline]);
      }

      setHasMore(data.hasMore);
      setOffset(currentOffset + data.timeline.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load timeline');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchEvents(offset);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'MENTION':
        return SparklesIcon;
      case 'COMMUNITY_SIGNAL':
        return UserGroupIcon;
      case 'MANUAL_ADJUSTMENT':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getImpactColor = (impactType: string) => {
    switch (impactType) {
      case 'POSITIVE':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'NEGATIVE':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'MENTION':
        return 'AI Mention';
      case 'COMMUNITY_SIGNAL':
        return 'Community Report';
      case 'MANUAL_ADJUSTMENT':
        return 'Manual Review';
      default:
        return eventType;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          No events yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Timeline events will appear here as they occur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = getEventIcon(event.eventType);
            const impactColor = getImpactColor(event.impactType);

            return (
              <div key={event.eventId} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${impactColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {getEventTypeLabel(event.eventType)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              event.impactType === 'POSITIVE'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : event.impactType === 'NEGATIVE'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {event.impactType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {event.description}
                        </p>
                      </div>

                      {/* Score change */}
                      <div className="text-right flex-shrink-0">
                        <div
                          className={`text-lg font-bold ${
                            event.scoreChange > 0
                              ? 'text-green-600 dark:text-green-400'
                              : event.scoreChange < 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {event.scoreChange > 0 ? '+' : ''}
                          {event.scoreChange.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Impact: {event.impactAmount.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    {event.details && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {event.details.sentiment && (
                            <div>
                              Sentiment: <span className="font-medium">{event.details.sentiment}</span>
                            </div>
                          )}
                          {event.details.category && (
                            <div>
                              Category: <span className="font-medium">{event.details.category}</span>
                            </div>
                          )}
                          {event.details.source && (
                            <div>
                              Source: <span className="font-medium">{event.details.source}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(event.eventDate), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4" />
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
