import React, { useState } from 'react';
import { ChartPie } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, Donut, Swatch, SENTIMENTS, sentimentLabel } from '../charts/primitives';

export const SentimentDonut = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(null);

  if (!currentVideo) return null;

  const breakdown = currentVideo.breakdown || {};
  const confidence = Object.fromEntries((currentVideo.charts?.engagementBySentiment || []).map((e) => [e.sentiment, e.averageConfidence]));
  const total = currentVideo.totalCommentsAnalyzed || 0;
  const parts = SENTIMENTS.map((s) => ({ key: s, s, value: breakdown[s]?.count || 0 }));

  return (
    <ChartCard icon={ChartPie} title={t('dashBreakdownTitle', 'Sentiment Breakdown')} badge={`${total} ${t('dashComments', 'comments')}`} className="h-full">
      <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
        <Donut parts={parts} size={188} thickness={22} hovered={hovered} onHover={setHovered}>
          <div className="text-3xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-none">
            {hovered ? `${breakdown[hovered]?.percentage ?? 0}%` : total}
          </div>
          <div className="text-[11px] text-[#777777] dark:text-[#888888] mt-1">
            {hovered ? sentimentLabel(t, hovered) : t('dashComments', 'comments')}
          </div>
        </Donut>

        <div className="flex-1 w-full space-y-1">
          {SENTIMENTS.map((s) => (
            <div
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg border transition-colors cursor-default ${
                hovered === s
                  ? 'bg-[#F7F7F7] dark:bg-[#111111] border-[#E5E5E5] dark:border-[#303030]'
                  : 'border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 text-sm text-[#111111] dark:text-[#F5F5F5]">
                <Swatch s={s} className="!w-3 !h-3" />
                {sentimentLabel(t, s)}
              </span>
              <span className="text-right">
                <span className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] font-mono">{breakdown[s]?.count ?? 0}</span>
                <span className="text-xs text-[#777777] dark:text-[#888888] font-mono ml-2">{breakdown[s]?.percentage ?? 0}%</span>
                {confidence[s] > 0 && (
                  <span className="block text-[10px] text-[#777777] dark:text-[#888888]">
                    {t('dashConfidence', 'avg. model confidence')} {Math.round(confidence[s] * 100)}%
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
