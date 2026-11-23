import React, { useState } from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChartCard, EmptyNote, HBar, Swatch } from '../charts/primitives';

const fmt = (n) => (n === null || n === undefined ? '–' : Number(n).toLocaleString());

const Avatar = ({ user }) => {
  const [failed, setFailed] = useState(false);
  if (user.avatar && !failed) {
    return (
      <img src={user.avatar} alt="" onError={() => setFailed(true)}
           className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5E5E5] dark:ring-[#303030] flex-shrink-0" />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#F0F0F0] dark:bg-[#252525] ring-1 ring-[#E5E5E5] dark:ring-[#303030] flex items-center justify-center text-xs font-medium text-[#777777] dark:text-[#888888] flex-shrink-0">
      {(user.name || '?').replace('@', '').charAt(0).toUpperCase()}
    </div>
  );
};

export const AudienceInsights = () => {
  const { currentVideo } = useSentiment();
  const { t } = useLanguage();
  const [tab, setTab] = useState('mostActive');

  const users = currentVideo?.users;
  if (!users) return null;

  const summary = users.summary || {};
  const engagement = currentVideo.engagement || {};
  const buckets = currentVideo.charts?.commenterBuckets || [];
  const maxBucket = Math.max(1, ...buckets.map((b) => b.users));
  const channelSubs = currentVideo.channelStats?.subscribersFormatted;

  const tabs = [
    { key: 'mostActive', label: t('dashUsersMostActive', 'Most Comments'), empty: t('dashUsersNoRepeat', 'Nobody commented more than once in this set.') },
    { key: 'mostLiked', label: t('dashUsersMostLiked', 'Most Liked'), empty: t('dashUsersNoLikes', 'No liked comments yet.') },
    { key: 'topFans', label: t('dashUsersTopFans', 'Top Fans'), empty: t('dashUsersNoFans', 'No standout fans found.') },
    { key: 'topSubscribers', label: t('dashUsersTopSubs', 'Top Subscribers'), empty: t('dashUsersNoSubs', "No commenter subscriber counts. They are only collected when the server uses the official YouTube API (set YOUTUBE_API_KEY), and only for channels that make them public.") },
    { key: 'mostCritical', label: t('dashUsersCritical', 'Most Critical'), empty: t('dashUsersNoCritical', 'No critical commenters.') },
    { key: 'mostToxic', label: t('dashUsersToxic', 'Most Toxic'), empty: t('dashUsersNoToxic', 'No toxic commenters detected.') },
  ];
  const active = tabs.find((x) => x.key === tab) || tabs[0];
  const list = users[active.key] || [];

  const stats = [
    { label: t('dashUsersUnique', 'Unique commenters'), value: fmt(summary.uniqueCommenters) },
    { label: t('dashUsersRepeat', 'Repeat commenters'), value: fmt(summary.repeatCommenters) },
    { label: t('dashUsersAvg', 'Comments per user'), value: summary.averageCommentsPerUser ?? '–' },
    { label: t('dashUsersAvgLikes', 'Avg likes per comment'), value: engagement.averageLikesPerComment ?? '–' },
  ];
  if (channelSubs) stats.push({ label: t('dashChannelSubs', 'Channel subscribers'), value: channelSubs });

  return (
    <ChartCard icon={Users} title={t('dashUsersTitle', 'Audience and Top Commenters')} badge={t('dashUsersBadge', 'Leaderboards')}>
      {/* Stat strip */}
      <div className={`grid grid-cols-2 md:grid-cols-3 ${stats.length > 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3`}>
        {stats.map((s) => (
          <div key={s.label} className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030]">
            <div className="text-lg font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">{s.value}</div>
            <div className="text-[11px] text-[#777777] dark:text-[#888888]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loyalty chart */}
        <div className="lg:col-span-4 p-4 rounded-lg border border-[#E5E5E5] dark:border-[#303030] space-y-4 self-start">
          <div>
            <div className="text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">{t('dashLoyalty', 'Commenter loyalty')}</div>
            <div className="text-[11px] text-[#777777] dark:text-[#888888]">{t('dashLoyaltyHint', 'How many people commented once, twice, or more')}</div>
          </div>
          <div className="space-y-4">
            {buckets.map((b, i) => (
              <HBar
                key={b.label}
                label={b.label}
                value={b.users}
                max={maxBucket}
                valueLabel={`${b.users} ${b.users === 1 ? t('dashUser', 'person') : t('dashUsersPeople', 'people')}`}
                sub={`${b.comments} ${t('dashComments', 'comments')}`}
                tone="accent"
              />
            ))}
          </div>
        </div>

        {/* Leaderboards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((x) => (
              <button
                key={x.key}
                onClick={() => setTab(x.key)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  tab === x.key
                    ? 'bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] border-transparent font-semibold'
                    : 'bg-[#F7F7F7] dark:bg-[#111111] text-[#777777] dark:text-[#888888] border-[#E5E5E5] dark:border-[#303030] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <EmptyNote>{active.empty}</EmptyNote>
          ) : (
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#303030]">
              {list.map((u, idx) => (
                <div key={`${u.authorId || u.name}-${idx}`} className="flex items-center gap-3 py-3">
                  <span className="w-5 text-center text-[11px] font-mono text-[#777777] dark:text-[#888888]">{idx + 1}</span>
                  <Avatar user={u} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#111111] dark:text-[#F5F5F5]">
                      <span className="truncate">{u.name}</span>
                      {u.profileUrl && (
                        <a href={u.profileUrl} target="_blank" rel="noreferrer" aria-label="Open channel"
                           className="text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5]">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#777777] dark:text-[#888888] font-mono">
                      <span>{u.commentCount} {u.commentCount === 1 ? t('dashUsersComment', 'comment') : t('dashUsersComments', 'comments')}</span>
                      <span>{u.totalLikes} {t('dashUsersLikes', 'likes')}</span>
                      {u.subscribersFormatted && <span>{u.subscribersFormatted} {t('dashSubscribers', 'subscribers')}</span>}
                      {u.subscribersHidden && <span>{t('dashUsersHiddenSubs', 'subscribers hidden')}</span>}
                    </div>
                  </div>
                  {/* positive / neutral / negative counts */}
                  <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#777777] dark:text-[#888888] flex-shrink-0">
                    {[['positive', u.positive], ['neutral', u.neutral], ['negative', u.negative]].map(([s, v]) => (
                      <span key={s} className="flex items-center gap-1" title={s}><Swatch s={s} />{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#777777] dark:text-[#888888]">
        {t('dashUsersNote', 'Based on the comments analyzed. Subscriber counts come from YouTube and are only shown for channels that make them public.')}
      </p>
    </ChartCard>
  );
};
