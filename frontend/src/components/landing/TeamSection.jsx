import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';
import { AutoTypeText } from '../common/AutoTypeText';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Briefcase, Link as LinkIcon } from 'lucide-react';

export const TeamSection = () => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: "Lakshya Singla",
      role: "Backend Engineer",
      email: "lakshya4825.se24@chitkara.edu.in",
      linkedin: "https://linkedin.com/in/lakshya-singla-a794b931b"
    },
    {
      name: "Jasanpreet Kaur",
      role: "Data Scientist",
      email: "jasanpreet4809.se24@chitkara.edu.in",
      linkedin: "https://linkedin.com/in/jasanpreet-kaur-5905ba264"
    },
    {
      name: "Piyush Mehta",
      role: "Frontend & Data Viz",
      email: "piyush4855.se24@chitkara.edu.in",
      linkedin: "https://linkedin.com/in/piyush-mehta-6bb09132a"
    }
  ];

  return (
    <section id="team-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20 border-t border-[#E5E5E5] dark:border-[#303030]">
      
      {/* Header */}
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] text-[#111111] dark:text-[#F5F5F5] text-xs font-medium">
            <AutoTypeText text={t('teamBadge', 'The Minds Behind SentiScope')} speed={20} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            <AutoTypeText text={t('teamTitle', 'Meet the')} speed={22} />{' '}
            <AutoTypeText text={t('teamTitleHighlight', 'Engineering Team')} delay={200} speed={22} />
          </h2>
        </div>
      </ScrollReveal>

      <div className="space-y-8">
        
        {/* ─── 1. TEAM LEAD HERO CARD (Manav) ─────────────────────────────── */}
        <ScrollReveal direction="up" delay={100}>
          <div className="group relative rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] overflow-hidden hover:border-[#111111] dark:hover:border-[#F5F5F5] transition-all duration-500 shadow-sm hover:shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              
              {/* Image Container with smooth float/zoom effect */}
              <div className="w-full md:w-2/5 aspect-square md:aspect-auto md:h-[340px] overflow-hidden bg-[#F7F7F7] dark:bg-[#111111] relative">
                <img 
                  src="/manav.png" 
                  alt="Manav Jain"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=Manav+Jain&background=111111&color=fff&size=512`;
                  }}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 animate-[float_6s_ease-in-out_infinite]"
                />
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-bounce">
                  Team Lead
                </div>
              </div>

              {/* Details Container */}
              <div className="w-full md:w-3/5 p-8 md:p-12 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#111111] dark:text-[#F5F5F5] flex items-center gap-3">
                    Manav Jain
                  </h3>
                  <p className="text-sm font-semibold text-[#777777] dark:text-[#888888] mt-1 tracking-widest uppercase">
                    Full Stack & ML Engineer
                  </p>
                </div>
                
                <p className="text-sm text-[#777777] dark:text-[#888888] leading-relaxed">
                  Architected the core machine learning pipeline (HingRoBERTa) and built the entire backend infrastructure. Passionate about turning complex NLP models into seamless, production-ready APIs.
                </p>

                {/* Contact Links */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <a href="mailto:manav4830.se24@chitkara.edu.in" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] text-xs font-medium text-[#111111] dark:text-[#F5F5F5] hover:border-[#111111] dark:hover:border-[#F5F5F5] transition-colors">
                    <Mail className="w-4 h-4" /> Email Me
                  </a>
                  <a href="https://www.linkedin.com/in/manav-jain-7055b4315" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] text-xs font-medium hover:bg-black dark:hover:bg-white transition-colors">
                    <Briefcase className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 2. CORE TEAM GRID (Lakshya, Jasanpreet, Piyush) ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <ScrollReveal key={idx} direction="up" delay={200 + idx * 100}>
              <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] hover:border-[#111111] dark:hover:border-[#F5F5F5] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-[#111111] dark:text-[#F5F5F5]">
                      {member.name}
                    </h4>
                    <p className="text-xs font-medium text-[#777777] dark:text-[#888888] uppercase tracking-widest mt-1">
                      {member.role}
                    </p>
                  </div>
                  
                  <div className="h-[1px] w-full bg-[#E5E5E5] dark:bg-[#303030]"></div>
                  
                  {/* Contact Icons / Links */}
                  <div className="flex flex-col gap-3 pt-2">
                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-xs text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors group/link">
                      <div className="w-8 h-8 rounded-full bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center group-hover/link:border-[#111111] dark:group-hover/link:border-[#F5F5F5] transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{member.email}</span>
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors group/link">
                      <div className="w-8 h-8 rounded-full bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center group-hover/link:border-[#111111] dark:group-hover/link:border-[#F5F5F5] transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">LinkedIn Profile</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};