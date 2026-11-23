import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, Columns, EmptyNote, HBar, SENTIMENTS, sentimentLabel } from '../charts/primitives';

const LEVEL_STYLES = { Low: 'badge-pos', Moderate: 'badge-neu', High: 'badge-neg' };

// one colour per toxicity-score bin: green (0-40%) → amber (40-70%) → red (70-100%)
const HISTOGRAM_TONES = ['pos', 'pos', 'pos', 'pos', 'neu', 'neu', 'neu', 'neg', 'neg', 'neg'];
const COL_TONE = { CLEAN: 'pos', BORDERLINE: 'neu', TOXIC: 'neg' };

const COLS = ['CLEAN', 'BORDERLINE', 'TOXIC'];

export const ToxicityCard = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();

  const tox = currentVideo?.toxicity;
  if (!tox || !tox.available) return null;

  const Icon = tox.level === 'Low' ? ShieldCheck : ShieldAlert;
  const categories = (tox.categories || []).filter((c) => c.count > 0);
  const maxCat = Math.max(1, ...categories.map((c) => c.count));
  const histogram = currentVideo.charts?.toxicityHistogram || [];
  const cross = currentVideo.charts?.toxicityBySentiment || {};
  const maxCell = Math.max(1, ...SENTIMENTS.flatMap((s) => COLS.map((c) => cross[s]?.[c] || 0)));

  // toxic = red · borderline = amber · clean = green
  const segments = [
    { key: 'toxic', label: t('dashToxToxic', 'Toxic'), count: tox.toxicCount, pct: tox.toxicPercentage, cls: 'viz-neg' },
    { key: 'borderline', label: t('dashToxBorderline', 'Borderline'), count: tox.borderlineCount, pct: tox.borderlinePercentage, cls: 'viz-neu' },
    { key: 'clean', label: t('dashToxClean', 'Clean'), count: tox.cleanCount, pct: tox.cleanPercentage, cls: 'viz-pos' },
  ];
  const colLabel = { CLEAN: t('dashToxClean', 'Clean'), BORDERLINE: t('dashToxBorderline', 'Borderline'), TOXIC: t('dashToxToxic', 'Toxic') };

  return (
    <ChartCard
      icon={Icon}
      title={t('dashToxTitle', 'Toxicity and Community Health')}
      right={
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${LEVEL_STYLES[tox.level] || LEVEL_STYLES.Low}`}>
          {tox.level} {t('dashToxRisk', 'toxicity')}
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health score + split */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-end gap-3">
            <div className="text-5xl font-semibold tracking-tight text-[#111111] dark:text-[#F5F5F5] leading-none">{tox.healthScore}</div>
            <div className="pb-1 text-xs text-[#777777] dark:text-[#888888]">/ 100 {t('dashToxHealth', 'community health')}</div>
          </div>

          <div className="space-y-2.5">
            <div className="w-full h-3 rounded-full overflow-hidden flex viz-track">
              {segments.filter((s) => s.pct > 0).map((s) => (
                <div key={s.key} className={`h-full ${s.cls}`} style={{ width: `${s.pct}%` }} title={`${s.label}: ${s.count}`} />
              ))}
            </div>
            <div className="space-y-1.5">
              {segments.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5]">
                    <span className={`inline-block w-2.5 h-2.5 rounded-sm ${s.cls}`} />{s.label}
                  </span>
                  <span className="font-mono text-[#777777] dark:text-[#888888]">{s.count} ({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#777777] dark:text-[#888888] font-mono">
            {t('dashToxAvg', 'Average toxicity score')}: {(tox.averageScore * 100).toFixed(1)}% · {tox.analyzed} {t('dashToxScanned', 'comments scanned')}
          </div>
        </div>

        {/* Score distribution */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{t('dashToxDist', 'Toxicity score distribution')}</div>
            <div className="text-[11px] text-[#777777] dark:text-[#888888]">{t('dashToxDistHint', 'Number of comments per toxicity-score range (right = more toxic)')}</div>
          </div>
          {histogram.length ? <Columns data={histogram} height={110} tones={HISTOGRAM_TONES} /> : <EmptyNote>–</EmptyNote>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-[#E5E5E5] dark:border-[#303030]">
        {/* Categories */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{t('dashToxCategories', 'Flagged language types')}</div>
          {categories.length === 0 ? (
            <EmptyNote>{t('dashToxNone', 'No harmful language categories were flagged in this comment set.')}</EmptyNote>
          ) : (
            <div className="space-y-3">
              {categories.map((c) => (
                <HBar key={c.key} label={c.name} value={c.count} max={maxCat} valueLabel={`${c.count} (${c.percentage}%)`} tone="neg" />
              ))}
            </div>
          )}
        </div>

        {/* Sentiment x toxicity heat-map */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{t('dashToxCross', 'Sentiment vs toxicity')}</div>
            <div className="text-[11px] text-[#777777] dark:text-[#888888]">{t('dashToxCrossHint', 'Do negative comments turn toxic? Darker cell = more comments')}</div>
          </div>
          <div className="grid grid-cols-[88px_repeat(3,1fr)] gap-1.5 text-xs">
            <div />
            {COLS.map((c) => (
              <div key={c} className="text-center text-[10px] uppercase tracking-wider text-[#777777] dark:text-[#888888] pb-0.5">{colLabel[c]}</div>
            ))}
            {SENTIMENTS.map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center text-[#111111] dark:text-[#F5F5F5]">{sentimentLabel(t, s)}</div>
                {COLS.map((c) => {
                  const v = cross[s]?.[c] || 0;
                  return (
                    <div key={c} className="relative h-11 rounded-md overflow-hidden border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center">
                      <div className={`absolute inset-0 viz-${COL_TONE[c]}`} style={{ opacity: v ? 0.12 + (v / maxCell) * 0.43 : 0 }} />
                      <span className="relative font-mono text-[#111111] dark:text-[#F5F5F5]">{v}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged comments */}
      <div className="space-y-3 pt-5 border-t border-[#E5E5E5] dark:border-[#303030]">
        <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{t('dashToxFlagged', 'Most toxic comments')}</div>
        {(tox.mostToxic || []).length === 0 ? (
          <EmptyNote>{t('dashToxNoFlagged', 'No comments crossed the toxicity threshold.')}</EmptyNote>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tox.mostToxic.map((c) => (
              <div key={c.id} className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#111111] dark:text-[#F5F5F5] truncate">{c.author}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${c.label === 'TOXIC' ? 'badge-neg' : 'badge-neu'}`}>
                    {Math.round(c.score * 100)}% {c.label.toLowerCase()}
                  </span>
                </div>
                <p className="text-xs text-[#777777] dark:text-[#888888] leading-relaxed line-clamp-3">{c.text}</p>
                {c.flags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.flags.map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#777777] dark:text-[#888888]">{f}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartCard>
  );
};
