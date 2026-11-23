import React, { useState } from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { InlineError } from '../common/InlineError';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, History, Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AutoTypeText } from '../common/AutoTypeText';

export const LoggedInHome = () => {
  const { 
    searchUrl, 
    setSearchUrl, 
    analyzeVideo, 
    isLoading, 
    errorState,
    clearError,
    historyList, 
    openReport, 
    removeFromHistory, 
    clearHistory 
  } = useSentiment();

  const { user } = useAuth();
  const { t } = useLanguage();
  const [showAllHistory, setShowAllHistory] = useState(false);

  // 2 rows limit in a 3-column grid = 6 cards
  const INITIAL_LIMIT = 6;
  const displayedHistory = showAllHistory ? historyList : historyList.slice(0, INITIAL_LIMIT);
  const hasMoreThanTwoRows = historyList.length > INITIAL_LIMIT;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchUrl.trim()) {
      analyzeVideo(searchUrl);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in text-left">
      
      {/* 1. Header & Search */}
      <section className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#111111] dark:text-[#F5F5F5] text-xs font-medium">
            <AutoTypeText text={t('wsActiveBadge', 'Creator Workspace Active')} speed={20} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            <AutoTypeText text={t('wsWelcome', 'Welcome back,')} speed={22} />{' '}
            <AutoTypeText text={user?.name || 'Creator'} delay={150} speed={22} />
          </h1>

          <p className="text-sm text-[#777777] dark:text-[#888888] max-w-2xl leading-relaxed">
            <AutoTypeText text={t('wsSubtitle', 'Paste any YouTube video link below to parse comments, evaluate sentiment scores, and extract actionable feedback.')} delay={300} speed={10} />
          </p>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-[#F7F7F7] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-lg p-2 flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#111111] dark:focus-within:border-[#F5F5F5] transition-colors"
        >
          <div className="flex items-center w-full px-3 py-1.5 flex-1">
            <Search className="w-4 h-4 text-[#777777] dark:text-[#888888] mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchUrl}
              onChange={(e) => { setSearchUrl(e.target.value); if (errorState) clearError(); }}
              placeholder={t('wsInputPlaceholder', 'Paste YouTube video URL (e.g. https://www.youtube.com/watch?v=...)')}
              className="w-full bg-transparent text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-[#AAAAAA] dark:placeholder-[#555555] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-2.5 bg-[#111111] dark:bg-[#F5F5F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#111111] font-semibold text-xs rounded-md transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#111111] border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{isLoading ? t('analyzingBtn', 'Analyzing...') : t('analyzeBtn', 'Analyze Video')}</span>
          </button>
        </form>
        <InlineError className="mt-3 w-full max-w-3xl" />
      </section>

      {/* 2. Previously Analyzed Videos */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-[#777777] dark:text-[#888888]" />
              <AutoTypeText text={t('wsHistoryTitle', 'Previously Analyzed Videos')} speed={20} />
            </h2>
            <p className="text-xs text-[#777777] dark:text-[#888888] mt-0.5">
              <AutoTypeText text={t('wsHistorySubtitle', 'Click any card to reopen its full sentiment dashboard and breakdown.')} delay={200} speed={12} />
            </p>
          </div>

          {historyList.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1.5 rounded-md bg-[#F7F7F7] dark:bg-[#1A1A1A] hover:bg-red-50 dark:hover:bg-red-900/10 text-[#777777] dark:text-[#888888] hover:text-red-600 dark:hover:text-red-400 text-xs font-medium transition-colors border border-[#E5E5E5] dark:border-[#303030] flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('wsClearHistoryBtn', 'Clear History')}</span>
            </button>
          )}
        </div>

        {/* History Grid */}
        {historyList.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedHistory.map((video) => (
                <div
                  key={video.id}
                  className="p-5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] flex flex-col justify-between space-y-4 hover:border-[#111111] dark:hover:border-[#888888] transition-colors group"
                >
                  <div className="space-y-3">
                    {/* Thumbnail & Score badge */}
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-[#F0F0F0] dark:bg-[#252525]">
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/70 text-white text-xs font-semibold">
                        {video.overallScore}% {t('wsScoreLabel', 'Score')}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white/80">
                        {video.totalCommentsAnalyzed} {t('wsCommentsCount', 'comments')}
                      </div>
                    </div>

                    {/* Title & Details */}
                    <div>
                      <h3 className="font-semibold text-sm text-[#111111] dark:text-[#F5F5F5] line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[#777777] dark:text-[#888888] mt-1">
                        <span>{video.channel}</span>
                        <span className="font-mono text-[11px]">{video.analyzedAt || video.publishedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#303030] flex items-center justify-between gap-2">
                    <button
                      onClick={() => openReport(video)}
                      className="flex-1 py-1.5 px-3 rounded-md bg-[#111111] dark:bg-[#F5F5F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#111111] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('wsOpenDashboardBtn', 'Open Dashboard')}</span>
                    </button>

                    <button
                      onClick={() => removeFromHistory(video.id)}
                      title="Remove from history"
                      className="p-1.5 rounded-md bg-[#F7F7F7] dark:bg-[#1A1A1A] hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 text-[#777777] dark:text-[#888888] transition-colors border border-[#E5E5E5] dark:border-[#303030]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* See More / Show Less */}
            {hasMoreThanTwoRows && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="px-6 py-2 rounded-md bg-white dark:bg-[#1A1A1A] hover:bg-[#F0F0F0] dark:hover:bg-[#222222] text-[#111111] dark:text-[#F5F5F5] border border-[#E5E5E5] dark:border-[#303030] text-xs font-medium transition-colors inline-flex items-center gap-2 active:scale-95"
                >
                  <span>{showAllHistory ? t('wsShowLessBtn', 'Show Less') : t('wsSeeMoreBtn', 'See More')}</span>
                  {showAllHistory ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030]">
            <History className="w-10 h-10 text-[#AAAAAA] dark:text-[#444444] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5]">
              {t('wsNoHistoryTitle', 'No previous analyses')}
            </h3>
            <p className="text-xs text-[#777777] dark:text-[#888888] mt-1 max-w-sm mx-auto">
              {t('wsNoHistorySub', 'Paste any YouTube video link in the box above to generate your first analysis report.')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
