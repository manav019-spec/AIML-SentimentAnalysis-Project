import React from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, MessageSquare, ExternalLink, Eye, Users } from 'lucide-react';
import { AutoTypeText } from '../common/AutoTypeText';

export const VideoHeader = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();

  if (!currentVideo) return null;

  return (
    <div className="p-6 sm:p-7 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left: Video Details */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#F0F0F0] dark:bg-[#252525] text-[#777777] dark:text-[#888888] text-[10px] font-mono uppercase tracking-wider border border-[#E5E5E5] dark:border-[#303030]">
              <AutoTypeText text={t('dashAnalysisActive', 'Analysis Active')} speed={20} />
            </span>
            <span className="text-xs text-[#777777] dark:text-[#888888]">
              {t('dashChannel', 'Channel')}: <strong className="text-[#111111] dark:text-[#F5F5F5]">{currentVideo.channel}</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-tight truncate">
            <AutoTypeText text={currentVideo.title} speed={18} />
          </h2>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#777777] dark:text-[#888888]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('dashPublished', 'Published')} {currentVideo.publishedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{currentVideo.totalCommentsAnalyzed} {t('dashCommentsAnalyzed', 'comments analyzed')}</span>
            </div>
            {currentVideo.channelStats?.subscribersFormatted && (
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <Users className="w-3.5 h-3.5" />
                <span>{currentVideo.channelStats.subscribersFormatted} {t('dashSubscribers', 'subscribers')}</span>
              </div>
            )}
            {currentVideo.totalViews && (
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <Eye className="w-3.5 h-3.5" />
                <span>{currentVideo.totalViews} {t('dashViews', 'views')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: YouTube Link (not for the built-in sample) */}
        {currentVideo.url && !currentVideo.isSample && (
        <a
            href={currentVideo.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] hover:bg-[#F0F0F0] dark:hover:bg-[#1A1A1A] text-[#111111] dark:text-[#F5F5F5] border border-[#E5E5E5] dark:border-[#303030] hover:border-[#111111] dark:hover:border-[#888888] text-xs font-medium flex items-center gap-2 transition-colors flex-shrink-0"
          >
            <span>{t('dashWatchOnYT', 'Watch on YouTube')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#777777] dark:text-[#888888]" />
          </a>
        )}
      </div>
    </div>
  );
};
