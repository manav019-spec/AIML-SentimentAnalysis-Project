import React, { useState } from 'react';
import { ChartLine } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, EmptyNote, Legend, Segmented, SENTIMENTS, SHORT, sentimentLabel } from '../charts/primitives';

const W = 800, H = 280, PL = 44, PR = 20, PT = 14, PB = 34;
const PLOT_W = W - PL - PR;
const PLOT_H = H - PT - PB;

// Line style per series: tone + dash, so lines are distinguishable without colour.
const LINE = {
  positive: { cls: 'viz-s-pos', width: 2.5, dash: undefined },
  neutral:  { cls: 'viz-s-neu', width: 2.5, dash: undefined },
  negative: { cls: 'viz-s-neg', width: 2.5, dash: '7 5' },
  toxic:    { cls: 'viz-s-ink', width: 2,   dash: '1.5 4' },
};

const smoothPath = (pts) => {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], mx = a.x + (b.x - a.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
};

export const TrendLineChart = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  const [mode, setMode] = useState('lines');   // lines | bars | share
  const [hover, setHover] = useState(null);

  if (!currentVideo) return null;
  const data = currentVideo.trendTimeline || [];
  const title = t('dashTimelineTitle', 'Sentiment Trend Over Time');

  if (data.length === 0) {
    return (
      <ChartCard icon={ChartLine} title={title}>
        <EmptyNote>{t('dashNoTrend', 'Not enough dated comments to draw a trend.')}</EmptyNote>
      </ChartCard>
    );
  }

  const n = data.length;
  const totalOf = (d) => d.positive + d.neutral + d.negative;
  const hasToxic = data.some((d) => d.toxic > 0);

  // y-axis scale adapts to the data (no fixed maximum)
  let peak;
  if (mode === 'share') peak = 100;
  else if (mode === 'bars') peak = Math.max(1, ...data.map(totalOf));
  else peak = Math.max(1, ...data.flatMap((d) => [d.positive, d.neutral, d.negative, hasToxic ? d.toxic : 0]));
  const step = mode === 'share' ? 25 : Math.max(1, Math.ceil(peak / 4));
  const maxVal = step * 4;
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);

  const slot = PLOT_W / n;
  const xAt = (i) => (mode === 'lines'
    ? (n === 1 ? PL + PLOT_W / 2 : PL + (i / (n - 1)) * PLOT_W)
    : PL + slot * (i + 0.5));
  const yAt = (v) => PT + PLOT_H - (Math.min(v, maxVal) / maxVal) * PLOT_H;
  const labelEvery = Math.max(1, Math.ceil(n / 8));
  const hitHalf = mode === 'lines' ? (n === 1 ? PLOT_W / 2 : PLOT_W / (n - 1) / 2) : slot / 2;
  const barW = Math.min(slot * 0.6, 64);

  const h = hover !== null ? data[hover] : null;
  const total = data.reduce((a, d) => a + totalOf(d), 0);
  const seriesKeys = hasToxic ? [...SENTIMENTS, 'toxic'] : SENTIMENTS;

  return (
    <ChartCard
      icon={ChartLine}
      title={title}
      right={
        <Segmented
          value={mode}
          onChange={(m) => { setMode(m); setHover(null); }}
          options={[
            { key: 'lines', label: t('dashModeLines', 'Lines') },
            { key: 'bars', label: t('dashModeBars', 'Stacked') },
            { key: 'share', label: t('dashModeShare', 'Share %') },
          ]}
        />
      }
    >
      {/* Legend + hover read-out */}
      <div className="flex flex-wrap items-center justify-between gap-3 min-h-[20px]">
        {mode === 'lines' ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#777777] dark:text-[#888888]">
            {seriesKeys.map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <svg width="22" height="8" aria-hidden="true">
                  <line x1="1" y1="4" x2="21" y2="4" strokeWidth="2.5" strokeDasharray={LINE[k].dash} className={LINE[k].cls} />
                </svg>
                {k === 'toxic' ? t('dashToxToxic', 'Toxic') : sentimentLabel(t, k)}
              </span>
            ))}
          </div>
        ) : (
          <Legend t={t} />
        )}
        <span className="text-xs font-mono text-[#777777] dark:text-[#888888]">
          {h
            ? `${h.date} · ${h.positive} / ${h.neutral} / ${h.negative}${hasToxic ? ` · ${h.toxic} ${t('dashToxToxic', 'toxic').toLowerCase()}` : ''}`
            : `${total} ${t('dashComments', 'comments')} · ${n} ${n === 1 ? t('dashPeriod', 'period') : t('dashPeriods', 'periods')}`}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[520px] h-auto" role="img" aria-label={title}>
          {/* grid + y labels */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PL} x2={W - PR} y1={yAt(tick)} y2={yAt(tick)} strokeWidth="1" strokeDasharray={tick === 0 ? undefined : '3 4'} className="viz-s-grid" />
              <text x={PL - 8} y={yAt(tick) + 3} textAnchor="end" fontSize="10" className="viz-t-muted">
                {tick}{mode === 'share' ? '%' : ''}
              </text>
            </g>
          ))}

          {/* x labels */}
          {data.map((d, i) => (i % labelEvery === 0) && (
            <text key={d.isoDate || d.date} x={xAt(i)} y={H - 10} textAnchor="middle" fontSize="10" className="viz-t-muted">{d.date}</text>
          ))}

          {/* hover guide */}
          {hover !== null && (
            <line x1={xAt(hover)} x2={xAt(hover)} y1={PT} y2={PT + PLOT_H} strokeWidth="1" strokeDasharray="3 3" className="viz-s-ink" opacity="0.5" />
          )}

          {/* series */}
          {mode === 'lines' && seriesKeys.map((k) => {
            const pts = data.map((d, i) => ({ x: xAt(i), y: yAt(d[k] || 0), v: d[k] || 0 }));
            return (
              <g key={k}>
                {n > 1 && (
                  <path d={smoothPath(pts)} fill="none" strokeLinecap="round" strokeWidth={LINE[k].width}
                        strokeDasharray={LINE[k].dash} className={`${LINE[k].cls} chart-path`} />
                )}
                {k !== 'toxic' && pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 5 : 3.2} className={`viz-f-${SHORT[k]}`} />
                ))}
              </g>
            );
          })}

          {mode !== 'lines' && data.map((d, i) => {
            const tot = Math.max(totalOf(d), 1);
            const scale = (v) => (mode === 'share' ? (v / tot) * 100 : v);
            let acc = 0;
            return (
              <g key={d.isoDate || d.date} opacity={hover !== null && hover !== i ? 0.45 : 1}>
                {SENTIMENTS.map((s) => {
                  const v = scale(d[s]);
                  const y0 = yAt(acc + v), y1 = yAt(acc);
                  acc += v;
                  return v > 0 ? (
                    <rect key={s} x={xAt(i) - barW / 2} y={y0} width={barW} height={Math.max(y1 - y0, 0)} className={`viz-f-${SHORT[s]}`} />
                  ) : null;
                })}
              </g>
            );
          })}

          {/* hit areas */}
          {data.map((d, i) => (
            <rect key={`hit-${i}`} x={xAt(i) - hitHalf} y={PT} width={hitHalf * 2} height={PLOT_H} fill="transparent"
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          ))}
        </svg>
      </div>

      {n === 1 && (
        <p className="text-[11px] text-[#777777] dark:text-[#888888]">
          {t('dashSinglePeriod', 'All analyzed comments were posted in the same period, so there is no trend to draw yet.')}
        </p>
      )}
    </ChartCard>
  );
};
