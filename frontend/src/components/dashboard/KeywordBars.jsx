import React from 'react';
import { Hash } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, EmptyNote, Legend, StackedBar } from '../charts/primitives';

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export const KeywordBars = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  if (!currentVideo) return null;

  const items = (currentVideo.topKeywords || []).slice(0, 10);
  const max = Math.max(1, ...items.map((k) => k.count));

  return (
    <ChartCard icon={Hash} title={t('dashKeywordsTitle', 'Most Discussed Topics')} badge={items.length ? `${items.length} ${t('dashTerms', 'terms')}` : undefined}>
      {items.length === 0 ? (
        <EmptyNote>{t('dashNoKeywords', 'No topic was mentioned by more than one comment.')}</EmptyNote>
      ) : (
        <>
          <Legend t={t} />
          <div className="space-y-3">
            {items.map((k) => (
              <div key={k.word} className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="text-[#111111] dark:text-[#F5F5F5] font-medium truncate">{titleCase(k.word)}</span>
                  <span className="font-mono text-[#777777] dark:text-[#888888]">
                    {k.count} {k.count === 1 ? t('dashComment', 'comment') : t('dashComments', 'comments')}
                  </span>
                </div>
                <div style={{ width: `${Math.max((k.count / max) * 100, 10)}%` }}>
                  <StackedBar
                    height="h-2"
                    parts={[
                      { s: 'positive', value: k.positive },
                      { s: 'neutral', value: k.neutral },
                      { s: 'negative', value: k.negative },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ChartCard>
  );
};
