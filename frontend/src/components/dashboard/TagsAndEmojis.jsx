import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, EmptyNote, HBar, Swatch } from '../charts/primitives';

export const TopicTags = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  if (!currentVideo) return null;

  // The "Most Discussed Topics" chart already shows the top keywords, so this card only adds
  // what it doesn't: real #hashtags used in the comments and lower-ranked terms.
  const shown = new Set((currentVideo.topKeywords || []).slice(0, 10).map((k) => k.word.replace(/\s+/g, '').toLowerCase()));
  const tags = (currentVideo.tags || [])
    .filter((tag) => !shown.has(tag.name.replace(/^#/, '').toLowerCase()))
    .slice(0, 14);
  if (tags.length === 0) return null;

  return (
    <ChartCard icon={Tag} title={t('dashTagsTitle', 'Topic Tags')} badge={tags.length ? `${tags.length}` : undefined}>
      {tags.length === 0 ? (
        <EmptyNote>{t('dashNoTags', 'No repeated topics or hashtags were found in these comments.')}</EmptyNote>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] text-xs text-[#111111] dark:text-[#F5F5F5]"
              title={`${tag.count} · ${tag.sentiment}`}
            >
              <Swatch s={tag.sentiment || "neutral"} />
              <span className="font-medium">{tag.name}</span>
              <span className="font-mono text-[10px] text-[#777777] dark:text-[#888888]">{tag.count}</span>
            </span>
          ))}
        </div>
      )}
    </ChartCard>
  );
};

export const EmojiReactions = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  if (!currentVideo) return null;
  const emojis = currentVideo.emojis || [];
  const max = Math.max(1, ...emojis.map((e) => e.count));

  return (
    <ChartCard icon={Sparkles} title={t('dashEmojiTitle', 'Emoji Reactions')} className="h-full"
               badge={currentVideo.sentimentLabel || undefined}>
      {emojis.length === 0 ? (
        <EmptyNote>{t('dashNoEmojis', 'No emoji were used in these comments.')}</EmptyNote>
      ) : (
        <div className="space-y-4">
          {emojis.map((e) => (
            <div key={e.emoji} className="flex items-center gap-3">
              <span className="text-2xl w-9 text-center leading-none">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <HBar
                  label={<span>{e.name} <span className="text-[#777777] dark:text-[#888888]">· {e.mood}</span></span>}
                  value={e.count}
                  max={max}
                  valueLabel={`${e.count} (${e.percentage}%)`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
};
