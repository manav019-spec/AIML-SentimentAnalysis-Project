import React from 'react';
import { Activity } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, Columns, HBar, Legend, StackedColumns, sentimentLabel } from '../charts/primitives';

const Tile = ({ value, label }) => (
  <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030]">
    <div className="text-lg font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">{value}</div>
    <div className="text-[11px] text-[#777777] dark:text-[#888888]">{label}</div>
  </div>
);

const Panel = ({ title, hint, children }) => (
  <div className="p-4 rounded-lg border border-[#E5E5E5] dark:border-[#303030] space-y-4">
    <div>
      <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{title}</div>
      {hint && <div className="text-[11px] text-[#777777] dark:text-[#888888]">{hint}</div>}
    </div>
    {children}
  </div>
);

export const EngagementCharts = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  if (!currentVideo?.charts) return null;

  const { charts, engagement = {} } = currentVideo;
  const bySentiment = charts.engagementBySentiment || [];
  const maxAvg = Math.max(0.01, ...bySentiment.map((e) => e.averageLikes));

  return (
    <ChartCard icon={Activity} title={t('dashEngagementTitle', 'Engagement Analysis')}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile value={(engagement.totalCommentLikes ?? 0).toLocaleString()} label={t('dashTotalLikes', 'Likes on comments')} />
        <Tile value={engagement.averageLikesPerComment ?? 0} label={t('dashAvgLikes', 'Avg likes per comment')} />
        <Tile value={(engagement.totalReplies ?? 0).toLocaleString()} label={t('dashTotalReplies', 'Replies')} />
        <Tile value={`${engagement.repliedCommentsPercentage ?? 0}%`} label={t('dashRepliedPct', 'Comments with replies')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title={t('dashLikesDist', 'Likes per comment')} hint={t('dashLikesDistHint', 'How many comments fall into each like range')}>
          <Columns data={charts.likesByBucket || []} height={120} />
        </Panel>

        <Panel title={t('dashLengthDist', 'Comment length by sentiment')} hint={t('dashLengthHint', 'Characters per comment')}>
          <Legend t={t} />
          <StackedColumns data={charts.lengthBySentiment || []} height={104} />
        </Panel>

        <Panel title={t('dashAvgLikesBySent', 'Average likes by sentiment')} hint={t('dashAvgLikesHint', 'Which kind of comment the audience rewards')}>
          <div className="space-y-4 pt-1">
            {bySentiment.map((e) => (
              <HBar
                key={e.sentiment}
                label={sentimentLabel(t, e.sentiment)}
                value={e.averageLikes}
                max={maxAvg}
                valueLabel={`${e.averageLikes} ${t('dashAvg', 'avg')}`}
                sub={`${e.comments} ${t('dashComments', 'comments')} · ${e.totalLikes} ${t('dashUsersLikes', 'likes')}`}
                tone={e.sentiment === 'positive' ? 'pos' : e.sentiment === 'neutral' ? 'neu' : 'neg'}
              />
            ))}
          </div>
        </Panel>
      </div>
    </ChartCard>
  );
};
