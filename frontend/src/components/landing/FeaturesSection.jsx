import React from 'react';
import { Brain, ShieldCheck, Zap, BarChart3, MessageSquare, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { AutoTypeText } from '../common/AutoTypeText';
import { useLanguage } from '../../context/LanguageContext';

export const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t('feat1Title', 'Instant NLP Scoring'),
      desc: t('feat1Desc', 'Evaluates sarcasm, technical slang, and emoji nuances to score every comment with granular confidence from 0.0 to 1.0.'),
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: t('feat2Title', 'Sentiment vs. Time Tracking'),
      desc: t('feat2Desc', 'Interactive multi-line spline charts plot positive, neutral, and critical shifts across days following your upload.'),
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: t('feat3Title', 'Spam & Bot Filtering'),
      desc: t('feat3Desc', 'Automatically isolates promotional crypto bots, repetitive copy-pastes, and irrelevant noise for clean analytical integrity.'),
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: t('feat4Title', 'Trending Topic Tags'),
      desc: t('feat4Desc', 'Aggregates dominant topic tags and recurring keyword questions directly from viewer discussions.'),
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t('feat5Title', 'Quality Issue Detection'),
      desc: t('feat5Desc', 'Instantly surfaces top constructive criticism (audio glitches, blurry slides, pacing) so you can pin fixes quickly.'),
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: t('feat6Title', 'Emoji Mood Analysis'),
      desc: t('feat6Desc', 'Measures visual reaction sentiment percentages, classifying overall audience mood into excited, grateful, or skeptical.'),
    }
  ];

  return (
    <section id="features-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#111111] dark:text-[#F5F5F5] text-xs font-medium">
            <AutoTypeText text={t('featuresBadge', 'Core Capabilities & Architecture')} speed={20} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            <AutoTypeText text={t('featuresTitle', 'Everything You Need to Understand')} speed={22} />{' '}
            <br className="hidden sm:inline" />
            <AutoTypeText text={t('featuresTitleHighlight', 'Audience Sentiment in Real-Time')} delay={200} speed={22} />
          </h2>
          <p className="text-sm text-[#777777] dark:text-[#888888] leading-relaxed">
            <AutoTypeText text={t('featuresSubtitle', 'Powered by state-of-the-art Natural Language Processing, SentiScope extracts deep emotional context, topic clusters, and actionable creator feedback in seconds.')} delay={400} speed={10} />
          </p>
        </div>
      </ScrollReveal>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, idx) => (
          <ScrollReveal key={idx} direction="up" delay={idx * 80}>
            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] hover:border-[#111111] dark:hover:border-[#888888] transition-colors space-y-3 h-full flex flex-col">
              <div className="w-9 h-9 rounded-lg bg-[#F0F0F0] dark:bg-[#252525] flex items-center justify-center text-[#111111] dark:text-[#F5F5F5]">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5]">{feature.title}</h3>
              <p className="text-xs text-[#777777] dark:text-[#888888] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
