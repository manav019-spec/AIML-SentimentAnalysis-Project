import React from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { Flame, Heart, AlertTriangle, ThumbsUp } from 'lucide-react';
import { AutoTypeText } from '../common/AutoTypeText';
import { EmptyNote } from '../charts/primitives';

export const HighlightCards = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();

  if (!currentVideo) return null;

  const lists = currentVideo.highlightLists || { mostLiked: [], topPositive: [], topCritical: [] };

  const CommentItem = ({ item, idx, rank, rankLabel }) => (
    <div className={idx > 0 ? "pt-3.5 space-y-1.5 border-t border-[#E5E5E5] dark:border-[#303030]" : "space-y-1.5"}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {item.avatar ? (
            <img src={item.avatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E5E5E5] dark:ring-[#303030]" />
          ) : (
            <span className="w-5 h-5 rounded-full bg-[#F0F0F0] dark:bg-[#252525] ring-1 ring-[#E5E5E5] dark:ring-[#303030] flex items-center justify-center text-[10px] text-[#777777] dark:text-[#888888]">
              {(item.author || '?').replace('@', '').charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-medium text-[#111111] dark:text-[#F5F5F5] truncate max-w-[130px]">
            {item.author}
          </span>
        </div>
        <span className="text-[#777777] dark:text-[#888888] flex items-center gap-1 font-mono text-[11px]">
          <ThumbsUp className="w-3 h-3" />
          {item.likes}
        </span>
      </div>
      <p className="text-xs text-[#777777] dark:text-[#888888] leading-relaxed italic line-clamp-3">
        "{item.text}"
      </p>
      <div className="text-[10px] text-[#AAAAAA] dark:text-[#555555] flex items-center justify-between pt-0.5">
        <span>{item.date}</span>
        <span className="text-[#777777] dark:text-[#888888] font-medium">{rankLabel}</span>
      </div>
    </div>
  );

  return (
    <div id="comments-section" className="scroll-mt-24 space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] uppercase tracking-wider">
          <AutoTypeText text={t('dashHighlightsTitle', 'Audience Feedback Highlights')} speed={20} />
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Most Liked */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] flex flex-col justify-between space-y-4 hover:border-[#AAAAAA] dark:hover:border-[#555555] transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] dark:border-[#303030]">
              <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] text-xs font-semibold tracking-wider uppercase">
                <Flame className="w-4 h-4" />
                <AutoTypeText text={t('dashMostLikedTitle', 'Most Liked Comments')} speed={20} />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0F0] dark:bg-[#252525] text-[#777777] dark:text-[#888888]">
                {lists.mostLiked.length} {t('dashFeatured', 'featured')}
              </span>
            </div>
            <div className="space-y-3.5">
              {lists.mostLiked.length === 0 && <EmptyNote>{t('dashNoneHere', 'No comments in this group.')}</EmptyNote>}
              {lists.mostLiked.map((item, idx) => (
                <CommentItem key={item.id || idx} item={item} idx={idx} rankLabel={`${t('dashRank', 'Rank')} #${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Top Positive */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] flex flex-col justify-between space-y-4 hover:border-[#AAAAAA] dark:hover:border-[#555555] transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] dark:border-[#303030]">
              <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] text-xs font-semibold tracking-wider uppercase">
                <Heart className="w-4 h-4" />
                <AutoTypeText text={t('dashTopPositiveTitle', 'Top Positive Feedback')} speed={20} />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0F0] dark:bg-[#252525] text-[#777777] dark:text-[#888888]">
                {lists.topPositive.length} {t('dashHighPraise', 'high praise')}
              </span>
            </div>
            <div className="space-y-3.5">
              {lists.topPositive.length === 0 && <EmptyNote>{t('dashNoneHere', 'No comments in this group.')}</EmptyNote>}
              {lists.topPositive.map((item, idx) => (
                <CommentItem key={item.id || idx} item={item} idx={idx} rankLabel={`${Math.round((item.confidence || 0) * 100)}% ${t('dashSentimentConf', 'model confidence')}`} />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Top Critical */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] flex flex-col justify-between space-y-4 hover:border-[#AAAAAA] dark:hover:border-[#555555] transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] dark:border-[#303030]">
              <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] text-xs font-semibold tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4" />
                <AutoTypeText text={t('dashTopCriticalTitle', 'Top Critical Feedback')} speed={20} />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0F0] dark:bg-[#252525] text-[#777777] dark:text-[#888888]">
                {lists.topCritical.length} {t('dashActionable', 'actionable')}
              </span>
            </div>
            <div className="space-y-3.5">
              {lists.topCritical.length === 0 && <EmptyNote>{t('dashNoneHere', 'No comments in this group.')}</EmptyNote>}
              {lists.topCritical.map((item, idx) => (
                <CommentItem key={item.id || idx} item={item} idx={idx} rankLabel={t('dashQualityFlag', 'Quality Flag')} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
