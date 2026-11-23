import React from 'react';
import { Gauge as GaugeIcon } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { AutoTypeText } from '../common/AutoTypeText';
import { ChartCard, Gauge, Legend, StackedBar, SENTIMENTS, sentimentLabel } from '../charts/primitives';

export const OverallScoreCard = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();

  if (!currentVideo) return null;

  const score = currentVideo.overallScore ?? 0;
  const raw = (currentVideo.sentimentLabel || '').toLowerCase();
  const base = raw.includes('neutral') ? 'neutral' : raw.includes('negat') ? 'negative' : 'positive';
  const label = `${raw.startsWith('very') ? `${t('dashVery', 'Very')} ` : ''}${sentimentLabel(t, base)}`;
  const subtitle = t('dashAudienceStatus', currentVideo.sentimentSubtitle || '');
  const breakdown = currentVideo.breakdown || {};

  return (
    <ChartCard icon={GaugeIcon} title={t('dashOverallTitle', 'Overall Sentiment Score')} className="h-full">
      <Gauge value={score} width={280} tone={score >= 60 ? 'pos' : score >= 40 ? 'neu' : 'neg'}>
        <div className="text-5xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-none">{score}</div>
        <div className="text-[11px] text-[#777777] dark:text-[#888888] mt-1">/ 100</div>
      </Gauge>

      <div className="text-center -mt-1">
        <div className="text-base font-semibold text-[#111111] dark:text-[#F5F5F5]">{label}</div>
        {subtitle && (
          <div className="text-xs text-[#777777] dark:text-[#888888] mt-0.5">
            <AutoTypeText text={subtitle} speed={20} delay={150} />
          </div>
        )}
      </div>

      <div className="space-y-2.5 pt-1">
        <StackedBar parts={SENTIMENTS.map((s) => ({ s, value: breakdown[s]?.count || 0 }))} />
        <div className="flex items-center justify-between">
          <Legend t={t} />
          <span className="text-[11px] font-mono text-[#777777] dark:text-[#888888]">
            {breakdown.positive?.percentage ?? 0}% / {breakdown.neutral?.percentage ?? 0}% / {breakdown.negative?.percentage ?? 0}%
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#777777] dark:text-[#888888]">
          {t('dashScoreFormula', 'Net sentiment: positive comments count fully, neutral half, negative none.')}
        </p>
      </div>
    </ChartCard>
  );
};
