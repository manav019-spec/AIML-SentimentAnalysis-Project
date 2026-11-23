// Small monochrome chart building blocks shared by every report card.
import React from 'react';
import { AutoTypeText } from '../common/AutoTypeText';

export const SENTIMENTS = ['positive', 'neutral', 'negative'];
export const SHORT = { positive: 'pos', neutral: 'neu', negative: 'neg' };

export const sentimentLabel = (t, s) => ({
  positive: t('dashPositive', 'Positive'),
  neutral: t('dashNeutral', 'Neutral'),
  negative: t('dashNegative', 'Negative'),
}[s]);

const pct = (n, total) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

// ─── Card shell (same look as every homepage card) ───────────────────────────
export const ChartCard = ({ icon: Icon, title, badge, right, children, className = '' }) => (
  <div className={`p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] space-y-5 transition-colors ${className}`}>
    <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E5E5E5] dark:border-[#303030]">
      <h3 className="text-xs font-medium tracking-wider text-[#777777] dark:text-[#888888] uppercase flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span className="truncate"><AutoTypeText text={title} speed={20} /></span>
      </h3>
      <div className="flex items-center gap-2 flex-shrink-0">
        {right}
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0F0] dark:bg-[#252525] text-[#777777] dark:text-[#888888] border border-[#E5E5E5] dark:border-[#303030]">
            {badge}
          </span>
        )}
      </div>
    </div>
    {children}
  </div>
);

export const EmptyNote = ({ children }) => (
  <p className="text-xs text-[#777777] dark:text-[#888888] py-3">{children}</p>
);

// ─── Small controls ──────────────────────────────────────────────────────────
export const Segmented = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-md border border-[#E5E5E5] dark:border-[#303030] overflow-hidden">
    {options.map((o) => (
      <button
        key={o.key}
        type="button"
        onClick={() => onChange(o.key)}
        className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
          value === o.key
            ? 'bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111]'
            : 'bg-white dark:bg-[#1A1A1A] text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const Swatch = ({ s, className = '' }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0 viz-${SHORT[s]} ${className}`} />
);

export const Legend = ({ t, items = SENTIMENTS, className = '' }) => (
  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#777777] dark:text-[#888888] ${className}`}>
    {items.map((s) => (
      <span key={s} className="flex items-center gap-1.5"><Swatch s={s} />{sentimentLabel(t, s)}</span>
    ))}
  </div>
);

// ─── Stacked horizontal bar (shares of a whole) ──────────────────────────────
// parts: [{ s: 'positive'|'neutral'|'negative', value }]
export const StackedBar = ({ parts, height = 'h-2.5', className = '' }) => {
  const total = parts.reduce((a, p) => a + p.value, 0);
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden flex viz-track ${className}`}>
      {total > 0 && parts.filter((p) => p.value > 0).map((p) => (
        <div
          key={p.s}
          className={`h-full viz-${SHORT[p.s]}`}
          style={{ width: `${(p.value / total) * 100}%` }}
          title={`${p.s}: ${p.value}`}
        />
      ))}
    </div>
  );
};

// ─── Single-series horizontal bar row ────────────────────────────────────────
export const HBar = ({ label, value, max, valueLabel, sub, tone = 'accent' }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs gap-3">
      <span className="text-[#111111] dark:text-[#F5F5F5] truncate">{label}</span>
      <span className="font-mono text-[#777777] dark:text-[#888888] flex-shrink-0">{valueLabel ?? value}</span>
    </div>
    <div className="w-full h-1.5 rounded-full viz-track overflow-hidden">
      <div className={`h-full rounded-full viz-${tone}`} style={{ width: `${max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0}%` }} />
    </div>
    {sub && <div className="text-[10px] text-[#777777] dark:text-[#888888]">{sub}</div>}
  </div>
);

// ─── Column chart (histogram) ────────────────────────────────────────────────
// `tones` (optional) colours each bar individually, e.g. green → red across toxicity ranges.
export const Columns = ({ data, height = 140, tone = 'accent', tones }) => {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: height + 34 }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full gap-1" title={`${d.label}: ${d.count}`}>
          <span className="text-[10px] font-mono text-[#777777] dark:text-[#888888]">{d.count}</span>
          <div className="w-full flex items-end" style={{ height }}>
            <div
              className={`w-full rounded-t viz-${tones?.[i] || tone}`}
              style={{ height: `${d.count > 0 ? Math.max((d.count / max) * 100, 2) : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-[#777777] dark:text-[#888888] truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Stacked column chart (per-bucket sentiment split) ───────────────────────
export const StackedColumns = ({ data, height = 140 }) => {
  const max = Math.max(1, ...data.map((d) => d.total));
  return (
    <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: height + 34 }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full gap-1"
             title={`${d.label}: ${d.positive} positive · ${d.neutral} neutral · ${d.negative} negative`}>
          <span className="text-[10px] font-mono text-[#777777] dark:text-[#888888]">{d.total}</span>
          <div className="w-full flex items-end" style={{ height }}>
            <div className="w-full flex flex-col-reverse rounded-t overflow-hidden" style={{ height: `${(d.total / max) * 100}%` }}>
              {SENTIMENTS.map((s) => d[s] > 0 && (
                <div key={s} className={`w-full viz-${SHORT[s]}`} style={{ height: `${(d[s] / d.total) * 100}%` }} />
              ))}
            </div>
          </div>
          <span className="text-[10px] text-[#777777] dark:text-[#888888] truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Donut ───────────────────────────────────────────────────────────────────
// parts: [{ key, s, value }]   hovered/onHover optional for the legend link
export const Donut = ({ parts, size = 176, thickness = 20, hovered, onHover, children }) => {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const visible = parts.filter((p) => p.value > 0);
  const gap = visible.length > 1 ? 3 : 0;
  let acc = 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Sentiment breakdown">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="viz-s-track" />
        {total > 0 && visible.map((p) => {
          const len = (p.value / total) * c;
          const el = (
            <circle
              key={p.key}
              cx={size / 2} cy={size / 2} r={r} fill="none"
              strokeWidth={hovered === p.key ? thickness + 4 : thickness}
              strokeDasharray={`${Math.max(len - gap, 0)} ${c - Math.max(len - gap, 0)}`}
              strokeDashoffset={-acc}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className={`viz-s-${SHORT[p.s]} chart-path cursor-pointer`}
              style={{ opacity: hovered && hovered !== p.key ? 0.35 : 1 }}
              onMouseEnter={() => onHover?.(p.key)}
              onMouseLeave={() => onHover?.(null)}
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">{children}</div>
    </div>
  );
};

// ─── Semicircle gauge (0-100) ────────────────────────────────────────────────
// `tone`: pos | neu | neg — colour of the filled arc.
export const Gauge = ({ value, width = 260, tone = 'pos', children }) => {
  const stroke = 16;
  const r = (width - stroke) / 2;
  const cx = width / 2;
  const cy = r + stroke / 2;
  const arc = Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const tick = (pctVal) => {
    const a = Math.PI * (1 - pctVal / 100);
    return { x1: cx + (r - stroke / 2 - 3) * Math.cos(a), y1: cy - (r - stroke / 2 - 3) * Math.sin(a),
             x2: cx + (r - stroke / 2 - 9) * Math.cos(a), y2: cy - (r - stroke / 2 - 9) * Math.sin(a) };
  };
  return (
    <div className="relative mx-auto" style={{ width, height: cy + 24 }}>
      <svg width={width} height={cy + 24} viewBox={`0 0 ${width} ${cy + 24}`} role="img" aria-label={`Score ${v} out of 100`}>
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" className="viz-s-track" />
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" className={`viz-s-${tone} chart-path`}
              strokeDasharray={`${(v / 100) * arc} ${arc}`} />
        {[25, 50, 75].map((p) => { const k = tick(p); return <line key={p} {...k} strokeWidth="1" className="viz-s-grid" />; })}
        <text x={cx - r} y={cy + 20} textAnchor="middle" fontSize="10" className="viz-t-muted">0</text>
        <text x={cx + r} y={cy + 20} textAnchor="middle" fontSize="10" className="viz-t-muted">100</text>
      </svg>
      <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: cy - 62 }}>{children}</div>
    </div>
  );
};

export { pct };
