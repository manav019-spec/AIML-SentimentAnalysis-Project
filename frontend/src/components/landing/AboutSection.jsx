import React from 'react';
import { Heart } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { AutoTypeText } from '../common/AutoTypeText';
import { useLanguage } from '../../context/LanguageContext';

export const AboutSection = () => {
  const { t } = useLanguage();

  const stats = [
    { val: t('aboutFact1Val', '2'), title: t('aboutFact1Title', 'AI Models'), sub: t('aboutFact1Sub', 'Sentiment + toxicity') },
    { val: t('aboutFact2Val', '3'), title: t('aboutFact2Title', 'Sentiment Classes'), sub: t('aboutFact2Sub', 'Positive, neutral, negative') },
    { val: t('aboutFact3Val', '6'), title: t('aboutFact3Title', 'Toxicity Categories'), sub: t('aboutFact3Sub', 'Insult, threat, obscene and more') },
    { val: t('aboutFact4Val', '6'), title: t('aboutFact4Title', 'Commenter Leaderboards'), sub: t('aboutFact4Sub', 'Most active, top fans, critics…') },
  ];

  return (
    <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      
      {/* Header */}
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#111111] dark:text-[#F5F5F5] text-xs font-medium">
            <AutoTypeText text={t('aboutBadge', 'Our Mission & Vision')} speed={20} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            <AutoTypeText text={t('aboutTitle', 'Empowering Creators with')} speed={22} />{' '}
            <br className="hidden sm:inline" />
            <AutoTypeText text={t('aboutTitleHighlight', 'Deep Audience Understanding')} delay={200} speed={22} />
          </h2>
          <p className="text-sm text-[#777777] dark:text-[#888888] leading-relaxed">
            <AutoTypeText text={t('aboutSubtitle', 'SentiScope was created to solve a persistent bottleneck: YouTube creators produce incredible content but spend hours manually sifting through thousands of comments to find honest feedback and technical issues.')} delay={400} speed={10} />
          </p>
        </div>
      </ScrollReveal>

      {/* Two Column Story & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        
        {/* Left Column: Story */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="right" delay={150}>
            <div className="p-7 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] space-y-4">
              <h3 className="text-lg font-semibold text-[#111111] dark:text-[#F5F5F5]">
                <AutoTypeText text={t('aboutStoryHeading', 'Built by Engineers, Designed for Creators')} speed={20} />
              </h3>
              <p className="text-xs sm:text-sm text-[#777777] dark:text-[#888888] leading-relaxed">
                {t('aboutStoryP1', 'We leverage advanced multilingual sentiment transformers calibrated specifically on YouTube comment syntax. Our engine differentiates between playful sarcasm, genuine praise, recurring tutorial requests, and high-urgency audio/visual glitches.')}
              </p>
              <p className="text-xs sm:text-sm text-[#777777] dark:text-[#888888] leading-relaxed">
                {t('aboutStoryP2', 'Whether you are an educator making 10-minute engineering lectures, a tech reviewer benchmarking devices, or a gaming channel, SentiScope gives you crystal-clear executive summaries within seconds.')}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[#111111] dark:text-[#F5F5F5]">
                <Heart className="w-4 h-4 fill-current" />
                <span>{t('aboutStoryFooter', 'Proudly supporting creators, educators, and indie makers globally.')}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Stat Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} direction="up" delay={200 + idx * 100}>
              <div className="p-5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] hover:border-[#111111] dark:hover:border-[#888888] transition-colors text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-semibold text-[#111111] dark:text-[#F5F5F5]">
                  {stat.val}
                </div>
                <div className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5]">
                  {stat.title}
                </div>
                <p className="text-[11px] text-[#777777] dark:text-[#888888]">
                  {stat.sub}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

    </section>
  );
};
