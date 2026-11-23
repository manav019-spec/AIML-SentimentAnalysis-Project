import React from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, LineChart, TrendingUp, MessageSquare, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const { activeTab, setActiveTab, goToHome, viewSampleReport } = useSentiment();
  const { openAuthModal, isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setActiveTab('home');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const Logo = () => (
    <div onClick={goToHome} className="flex items-center gap-2 cursor-pointer group">
      <div className="w-7 h-7 rounded-md border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center text-[#111111] dark:text-[#F5F5F5] group-hover:bg-[#F7F7F7] dark:group-hover:bg-[#1A1A1A] transition-colors">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-tight text-[#111111] dark:text-[#F5F5F5]">SentiScope</span>
    </div>
  );

  const linkClass = "hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors";
  const headingClass = "text-[11px] font-semibold uppercase tracking-wider text-[#111111] dark:text-[#F5F5F5]";

  return (
    <footer className="w-full border-t border-[#E5E5E5] dark:border-[#303030] bg-[#F7F7F7] dark:bg-[#0E0E0E] text-[#777777] dark:text-[#888888] text-xs py-14 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STATE 3: Dashboard */}
        {isAuthenticated && activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
            <div className="sm:col-span-2 space-y-4">
              <Logo />
              <p className="text-[#777777] dark:text-[#888888] max-w-sm leading-relaxed text-xs">
                {t('footerActiveReportDesc', 'Active analytical report generated for your YouTube video. Jump directly to any insight section or return to your creator workspace.')}
              </p>
              <button
                onClick={goToHome}
                className="px-4 py-1.5 rounded-md bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] text-xs font-semibold transition-colors hover:bg-black dark:hover:bg-white flex items-center gap-1.5 active:scale-95"
              >
                <span>{t('footerAnalyzeAnotherBtn', 'Analyze Another Video')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerReportSections', 'Report Sections')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleScrollToSection('dashboard-section')} className={`${linkClass} flex items-center gap-1.5`}><LayoutDashboard className="w-3 h-3" /><span>{t('footerTopOverview', 'Top Overview')}</span></button></li>
                <li><button onClick={() => handleScrollToSection('timeline-section')} className={`${linkClass} flex items-center gap-1.5`}><LineChart className="w-3 h-3" /><span>{t('footerSentimentVsTime', 'Sentiment vs Time')}</span></button></li>
                <li><button onClick={() => handleScrollToSection('tags-section')} className={`${linkClass} flex items-center gap-1.5`}><TrendingUp className="w-3 h-3" /><span>{t('footerTagsAndEmojis', 'Tags & Emojis')}</span></button></li>
                <li><button onClick={() => handleScrollToSection('comments-section')} className={`${linkClass} flex items-center gap-1.5`}><MessageSquare className="w-3 h-3" /><span>{t('footerCommentsHighlights', 'Comments Highlights')}</span></button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerWorkspace', 'Workspace')}</h4>
              <ul className="space-y-2">
                <li><button onClick={goToHome} className={linkClass}>{t('footerCreatorHome', 'Creator Home')}</button></li>
                <li><button onClick={() => handleScrollToSection('about-section')} className={linkClass}>{t('footerAboutSentiscope', 'About SentiScope')}</button></li>
                <li><button onClick={() => handleScrollToSection('contact-section')} className={linkClass}>{t('footerContactSupport', 'Contact Support')}</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerLegalDocs', 'Legal & Docs')}</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={linkClass}>{t('footerPrivacy', 'Privacy Policy')}</a></li>
                <li><a href="#terms" className={linkClass}>{t('footerTerms', 'Terms of Service')}</a></li>
                <li><a href="#api" className={linkClass}>{t('footerApi', 'Developer API')}</a></li>
              </ul>
            </div>
          </div>
        )}

        {/* STATE 2: Authenticated Home */}
        {isAuthenticated && activeTab === 'home' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
            <div className="sm:col-span-2 space-y-4">
              <Logo />
              <p className="text-[#777777] dark:text-[#888888] max-w-sm leading-relaxed text-xs">
                {t('footerCreatorWelcome', 'Welcome to your Creator Workspace,')} <strong className="text-[#111111] dark:text-[#F5F5F5]">{user?.name}</strong>. {t('footerCreatorWelcomeSub', 'Paste any YouTube URL above to begin real-time comment analysis.')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerWorkspace', 'Workspace')}</h4>
              <ul className="space-y-2">
                <li><button onClick={goToHome} className={linkClass}>{t('footerHomeSearch', 'Home & Search')}</button></li>
                <li><button onClick={viewSampleReport} className={linkClass}>{t('footerViewDemoReport', 'View Demo Report')}</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerCompanyConnect', 'Company & Connect')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleScrollToSection('about-section')} className={linkClass}>{t('navAbout', 'About Us')}</button></li>
                <li><button onClick={() => handleScrollToSection('contact-section')} className={linkClass}>{t('navContact', 'Contact Us')}</button></li>
                <li><button onClick={logout} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">{t('signOutBtn', 'Sign Out')}</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerLegalDocs', 'Legal & Docs')}</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={linkClass}>{t('footerPrivacy', 'Privacy Policy')}</a></li>
                <li><a href="#terms" className={linkClass}>{t('footerTerms', 'Terms of Service')}</a></li>
                <li><a href="#api" className={linkClass}>{t('footerApi', 'Developer API')}</a></li>
              </ul>
            </div>
          </div>
        )}

        {/* STATE 1: Unauthenticated */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
            <div className="sm:col-span-2 space-y-4">
              <Logo />
              <p className="text-[#777777] dark:text-[#888888] max-w-sm leading-relaxed text-xs">
                {t('footerBrandDesc', 'AI-driven YouTube comment sentiment analysis tool. Understand audience affinity, track engagement trends, and surface critical feedback in seconds.')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerNavigation', 'Navigation')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleScrollToSection('hero-section')} className={linkClass}>{t('navHome', 'Home')}</button></li>
                <li><button onClick={() => handleScrollToSection('features-section')} className={linkClass}>{t('navFeatures', 'Features')}</button></li>
                <li><button onClick={viewSampleReport} className={linkClass}>{t('footerViewDemoReport', 'View Demo Report')}</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerCompany', 'Company')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleScrollToSection('about-section')} className={linkClass}>{t('navAbout', 'About Us')}</button></li>
                <li><button onClick={() => handleScrollToSection('contact-section')} className={linkClass}>{t('navContact', 'Contact Us')}</button></li>
                <li><button onClick={() => openAuthModal('signup')} className={linkClass}>{t('footerCreateFreeAccount', 'Create Free Account')}</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className={headingClass}>{t('footerLegalDocs', 'Legal & Docs')}</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={linkClass}>{t('footerPrivacy', 'Privacy Policy')}</a></li>
                <li><a href="#terms" className={linkClass}>{t('footerTerms', 'Terms of Service')}</a></li>
                <li><a href="#api" className={linkClass}>{t('footerApi', 'Developer API')}</a></li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Copyright + Socials */}
        <div className="mt-12 pt-6 border-t border-[#E5E5E5] dark:border-[#303030] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#777777] dark:text-[#888888]">
          <div>{t('footerCopyright', '© 2026 SentiScope. All rights reserved. Powered by Advanced NLP Sentiment Intelligence.')}</div>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors" aria-label="Twitter / X">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
