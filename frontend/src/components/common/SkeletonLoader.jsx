import React from 'react';
import { useSentiment } from '../../context/SentimentContext';

const STAGE_LABELS = {
  QUEUED: 'Queued…',
  FETCHING: 'Fetching comments from YouTube…',
  ANALYZING: 'Scoring sentiment and toxicity…',
  SAVING: 'Saving results…',
  ENRICHING: 'Looking up top commenters…',
  DONE: 'Finishing up…',
};

export const SkeletonLoader = () => {
  const skeletonCard = "bg-[#F0F0F0] dark:bg-[#252525] rounded";
  const { analysisProgress } = useSentiment();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live progress from the backend (only present for real analyses) */}
      {analysisProgress && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#777777] dark:text-[#888888]">
            <span>{STAGE_LABELS[analysisProgress.stage] || 'Analyzing…'}</span>
            <span className="font-mono">{analysisProgress.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F0F0F0] dark:bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#111111] dark:bg-[#F5F5F5] rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Video Header Card Skeleton */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] relative overflow-hidden">
        <div className="skeleton-shimmer absolute inset-0 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3 w-full max-w-2xl">
            <div className={`h-7 ${skeletonCard} w-3/4`} />
            <div className="flex items-center gap-4">
              <div className={`h-4 ${skeletonCard} w-32`} />
              <div className={`h-4 ${skeletonCard} w-36`} />
            </div>
          </div>
          <div className={`h-9 w-28 ${skeletonCard} rounded-md`} />
        </div>
      </div>

      {/* Top Row: Score + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Score Card */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="skeleton-shimmer absolute inset-0 pointer-events-none" />
          <div>
            <div className={`h-3.5 ${skeletonCard} w-44 mb-6`} />
            <div className="flex flex-col items-center justify-center my-6 space-y-2">
              <div className={`h-14 ${skeletonCard} w-36`} />
              <div className={`h-5 ${skeletonCard} w-24`} />
              <div className={`h-3.5 ${skeletonCard} w-40`} />
            </div>
          </div>
          <div className={`h-2 ${skeletonCard} rounded-full w-full mt-4`} />
        </div>

        {/* Right Donut Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] relative overflow-hidden min-h-[280px]">
          <div className="skeleton-shimmer absolute inset-0 pointer-events-none" />
          <div className={`h-3.5 ${skeletonCard} w-44 mb-6`} />
          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 my-4">
            <div className={`w-40 h-40 rounded-full border-8 border-[#E5E5E5] dark:border-[#303030]`} />
            <div className="space-y-4 w-48">
              <div className="flex items-center justify-between">
                <div className={`h-4 ${skeletonCard} w-20`} />
                <div className={`h-4 ${skeletonCard} w-16`} />
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-4 ${skeletonCard} w-20`} />
                <div className={`h-4 ${skeletonCard} w-16`} />
              </div>
              <div className="flex items-center justify-between">
                <div className={`h-4 ${skeletonCard} w-20`} />
                <div className={`h-4 ${skeletonCard} w-16`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Line Chart Skeleton */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] relative overflow-hidden min-h-[300px]">
        <div className="skeleton-shimmer absolute inset-0 pointer-events-none" />
        <div className="flex items-center justify-between mb-8">
          <div className={`h-3.5 ${skeletonCard} w-48`} />
          <div className="flex gap-4">
            <div className={`h-3 ${skeletonCard} w-14`} />
            <div className={`h-3 ${skeletonCard} w-14`} />
            <div className={`h-3 ${skeletonCard} w-14`} />
          </div>
        </div>
        <div className={`h-44 w-full ${skeletonCard} rounded-lg flex items-end justify-between p-4`}>
          <div className={`h-20 w-8 bg-[#E0E0E0] dark:bg-[#333333] rounded`} />
          <div className={`h-32 w-8 bg-[#E0E0E0] dark:bg-[#333333] rounded`} />
          <div className={`h-28 w-8 bg-[#E0E0E0] dark:bg-[#333333] rounded`} />
          <div className={`h-16 w-8 bg-[#E0E0E0] dark:bg-[#333333] rounded`} />
          <div className={`h-12 w-8 bg-[#E0E0E0] dark:bg-[#333333] rounded`} />
        </div>
      </div>

      {/* 3 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] relative overflow-hidden min-h-[160px]">
            <div className="skeleton-shimmer absolute inset-0 pointer-events-none" />
            <div className={`h-3 ${skeletonCard} w-36 mb-4`} />
            <div className={`h-4 ${skeletonCard} w-28 mb-3`} />
            <div className="space-y-2">
              <div className={`h-3 ${skeletonCard} w-full`} />
              <div className={`h-3 ${skeletonCard} w-4/5`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
