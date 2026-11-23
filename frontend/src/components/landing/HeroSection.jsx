import React from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, FileText } from 'lucide-react';
import { AutoTypeText } from '../common/AutoTypeText';
import { InlineError } from '../common/InlineError';

export const HeroSection = () => {
  const { 
    searchUrl, 
    setSearchUrl, 
    analyzeVideo, 
    isLoading,
    errorState,
    clearError,
    viewSampleReport
  } = useSentiment();

  const { isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('signin');
      return;
    }
    if (searchUrl.trim()) {
      analyzeVideo(searchUrl);
    }
  };

  return (
    <section id="hero-section" className="relative pt-14 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left scroll-mt-20">

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#111111] dark:text-[#F5F5F5] text-xs font-medium mb-8">
        <AutoTypeText text={t('heroBadge')} speed={20} />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-[1.08] mb-6">
        <AutoTypeText text={t('heroTitlePrefix')} speed={22} />{' '}
        <br />
        <span className="text-[#111111] dark:text-[#F5F5F5]">
          <AutoTypeText text={t('heroTitleHighlight')} delay={250} speed={22} />
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-[#777777] dark:text-[#888888] max-w-3xl leading-relaxed mb-10">
        <AutoTypeText text={t('heroSubtitle')} delay={500} speed={10} />
      </p>

      {/* Search Input Bar */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[#F7F7F7] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-lg p-2 flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#111111] dark:focus-within:border-[#F5F5F5] transition-colors mb-8"
      >
        <div className="flex items-center w-full px-3 py-1.5 flex-1">
          <Search className="w-4 h-4 text-[#777777] dark:text-[#888888] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchUrl}
            onChange={(e) => { setSearchUrl(e.target.value); if (errorState) clearError(); }}
            placeholder={isAuthenticated ? t('heroInputPlaceholderAuth') : t('heroInputPlaceholderGuest')}
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
          <span>{isLoading ? t('analyzingBtn') : t('heroAnalyzeBtn')}</span>
        </button>
      </form>
      <InlineError className="-mt-5 mb-6 w-full max-w-3xl" />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={viewSampleReport}
          className="px-6 py-2.5 rounded-md bg-[#111111] dark:bg-[#F5F5F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#111111] font-semibold text-xs transition-colors active:scale-95 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>{t('heroSampleReportBtn', 'View Sample Report')}</span>
        </button>

        {!isAuthenticated && (
          <button
            onClick={() => openAuthModal('signin')}
            className="px-6 py-2.5 rounded-md bg-white dark:bg-[#1A1A1A] hover:bg-[#F0F0F0] dark:hover:bg-[#222222] text-[#111111] dark:text-[#F5F5F5] font-semibold text-xs border border-[#E5E5E5] dark:border-[#303030] transition-colors active:scale-95 flex items-center gap-2"
          >
            <span>{t('signInUpBtn')}</span>
          </button>
        )}
      </div>

    </section>
  );
};
