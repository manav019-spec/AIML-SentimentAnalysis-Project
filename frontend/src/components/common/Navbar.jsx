import React, { useState, useEffect } from 'react';
import { useSentiment } from '../../context/SentimentContext';
import { InlineError } from './InlineError';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, 
  Sun, 
  Moon, 
  LogOut, 
  Globe,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  LineChart
} from 'lucide-react';

export const Navbar = () => {
  const { 
    searchUrl, setSearchUrl, analyzeVideo, isLoading,
    activeTab, setActiveTab, goToHome, theme, toggleTheme,
    errorState, clearError
  } = useSentiment();

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let targetSections = [];
    if (isAuthenticated) {
      if (activeTab === 'dashboard') {
        targetSections = [
          { id: 'dashboard-section', key: 'dashboard' },
          { id: 'timeline-section', key: 'timeline' },
          { id: 'tags-section', key: 'tags' },
          { id: 'comments-section', key: 'comments' },
          { id: 'about-section', key: 'about' },
          { id: 'team-section', key: 'team' },
          { id: 'contact-section', key: 'contact' }
        ];
      } else {
        targetSections = [
          { id: 'hero-section', key: 'home' },
          { id: 'about-section', key: 'about' },
          { id: 'team-section', key: 'team' },
          { id: 'contact-section', key: 'contact' }
        ];
      }
    } else {
      targetSections = [
        { id: 'hero-section', key: 'home' },
        { id: 'features-section', key: 'features' },
        { id: 'about-section', key: 'about' },
        { id: 'team-section', key: 'team' },
        { id: 'contact-section', key: 'contact' }
      ];
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = targetSections.find((s) => s.id === entry.target.id);
            if (match) setActiveSection(match.key);
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    targetSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab, isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { openAuthModal('signin'); return; }
    if (searchUrl.trim()) analyzeVideo(searchUrl);
  };

  const handleScrollToSection = (sectionId, sectionKey) => {
    setActiveSection(sectionKey);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (['dashboard','timeline','tags','comments'].includes(sectionKey)) {
        setActiveTab('dashboard');
      } else {
        setActiveTab('home');
      }
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleHomeClick = () => {
    setActiveSection('home');
    goToHome();
  };

  const handleSignOut = () => {
    logout();
    goToHome();
    setIsUserMenuOpen(false);
  };

  const navLinkClass = (key) =>
    `relative py-2 transition-colors whitespace-nowrap ${
      activeSection === key
        ? 'text-[#111111] dark:text-[#F5F5F5] font-semibold'
        : 'text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
    }`;

  const NavUnderline = () => (
    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111] dark:bg-[#F5F5F5] rounded-full" />
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] dark:border-[#303030] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div onClick={handleHomeClick} className="flex items-center gap-2 cursor-pointer select-none group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center text-[#111111] dark:text-[#F5F5F5] group-hover:bg-[#F7F7F7] dark:group-hover:bg-[#1A1A1A] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#111111] dark:text-[#F5F5F5]">
              SentiScope
            </span>
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full items-center bg-[#F7F7F7] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-lg px-3 py-1.5 focus-within:border-[#111111] dark:focus-within:border-[#F5F5F5] transition-colors">
              <Search className="w-4 h-4 text-[#777777] dark:text-[#888888] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={searchUrl}
                onChange={(e) => { setSearchUrl(e.target.value); if (errorState) clearError(); }}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent text-xs sm:text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-[#AAAAAA] dark:placeholder-[#555555] focus:outline-none"
              />
              <button type="submit" disabled={isLoading} className="ml-2 px-4 py-1.5 bg-[#111111] hover:bg-black dark:bg-[#F5F5F5] dark:hover:bg-white text-white dark:text-[#111111] font-semibold text-xs rounded-md transition-colors active:scale-95 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0">
                {isLoading ? (<div className="w-3.5 h-3.5 border-2 border-white dark:border-[#111111] border-t-transparent rounded-full animate-spin" />) : null}
                <span>{isLoading ? t('analyzingBtn') : t('analyzeBtn')}</span>
              </button>
            </form>
            {activeTab === 'dashboard' && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50">
                <InlineError floating />
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className="relative">
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="h-8 px-2.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-[#F7F7F7] dark:hover:bg-[#1A1A1A] transition-colors border border-[#E5E5E5] dark:border-[#303030]">
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-lg shadow-lg z-50 text-xs animate-fade-in">
                  <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#F7F7F7] dark:hover:bg-[#222222] ${language === 'en' ? 'text-[#111111] dark:text-[#F5F5F5] font-semibold' : 'text-[#777777] dark:text-[#888888]'}`}>
                    <span>English</span>
                  </button>
                  <button onClick={() => { setLanguage('hi'); setIsLangMenuOpen(false); }} className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#F7F7F7] dark:hover:bg-[#222222] ${language === 'hi' ? 'text-[#111111] dark:text-[#F5F5F5] font-semibold' : 'text-[#777777] dark:text-[#888888]'}`}>
                    <span>हिन्दी (Hindi)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="w-8 h-8 rounded-md flex items-center justify-center text-[#777777] dark:text-[#888888] hover:bg-[#F7F7F7] dark:hover:bg-[#1A1A1A] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors border border-[#E5E5E5] dark:border-[#303030]">
              {theme === 'dark' ? (<Sun className="w-4 h-4" />) : (<Moon className="w-4 h-4" />)}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-0.5 rounded-full ring-2 ring-[#E5E5E5] dark:ring-[#303030] hover:ring-[#111111] dark:hover:ring-[#F5F5F5] transition-all">
                  {user.avatar ? (<img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />) : (<span className="w-7 h-7 rounded-full bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] flex items-center justify-center text-xs font-semibold">{(user.name || '?').charAt(0).toUpperCase()}</span>)}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-lg shadow-lg z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-[#E5E5E5] dark:border-[#303030]">
                      <p className="font-semibold text-[#111111] dark:text-[#F5F5F5]">{user.name}</p>
                      <p className="text-[#777777] dark:text-[#888888] text-[11px] truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { handleHomeClick(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[#111111] dark:text-[#F5F5F5] hover:bg-[#F7F7F7] dark:hover:bg-[#222222]">
                      <span>{t('creatorWorkspaceBtn')}</span>
                    </button>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-[#F7F7F7] dark:hover:bg-[#222222] flex items-center gap-2 border-t border-[#E5E5E5] dark:border-[#303030] transition-colors">
                      <LogOut className="w-3.5 h-3.5" /> {t('signOutBtn')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => openAuthModal('signin')} className="px-4 py-1.5 rounded-md bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] text-xs font-semibold transition-colors hover:bg-black dark:hover:bg-white active:scale-95 flex-shrink-0">
                {t('signInUpBtn')}
              </button>
            )}
          </div>
        </div>

        {/* Taskbar Navigation */}
        <div className="flex items-center gap-6 sm:gap-8 border-t border-[#E5E5E5] dark:border-[#303030]/50 h-10 text-xs font-medium overflow-x-auto no-scrollbar">
          
          {/* SCENARIO 1: Unauthenticated */}
          {!isAuthenticated && (
            <>
              <button onClick={() => handleScrollToSection('hero-section', 'home')} className={navLinkClass('home')}>
                {t('navHome')}
                {activeSection === 'home' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('features-section', 'features')} className={`${navLinkClass('features')} flex items-center gap-1`}>
                <span>{t('navFeatures')}</span>
                {activeSection === 'features' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('about-section', 'about')} className={`${navLinkClass('about')} flex items-center gap-1`}>
                <span>{t('navAbout')}</span>
                {activeSection === 'about' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('team-section', 'team')} className={`${navLinkClass('team')} flex items-center gap-1`}>
                <span>Our Team</span>
                {activeSection === 'team' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('contact-section', 'contact')} className={`${navLinkClass('contact')} flex items-center gap-1`}>
                <span>{t('navContact')}</span>
                {activeSection === 'contact' && <NavUnderline />}
              </button>
            </>
          )}

          {/* SCENARIO 2: Authenticated + Home */}
          {isAuthenticated && activeTab === 'home' && (
            <>
              <button onClick={handleHomeClick} className="relative py-2 transition-colors whitespace-nowrap text-[#111111] dark:text-[#F5F5F5] font-semibold">
                {t('navHome')}
                <NavUnderline />
              </button>
              <button onClick={() => handleScrollToSection('about-section', 'about')} className={`${navLinkClass('about')} flex items-center gap-1`}>
                <span>{t('navAbout')}</span>
                {activeSection === 'about' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('team-section', 'team')} className={`${navLinkClass('team')} flex items-center gap-1`}>
                <span>Our Team</span>
                {activeSection === 'team' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('contact-section', 'contact')} className={`${navLinkClass('contact')} flex items-center gap-1`}>
                <span>{t('navContact')}</span>
                {activeSection === 'contact' && <NavUnderline />}
              </button>
            </>
          )}

          {/* SCENARIO 3: Authenticated + Dashboard */}
          {isAuthenticated && activeTab === 'dashboard' && (
            <>
              <button onClick={handleHomeClick} className="relative py-2 transition-colors whitespace-nowrap text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5]">
                {t('navHome')}
              </button>
              <button onClick={() => handleScrollToSection('dashboard-section', 'dashboard')} className={`${navLinkClass('dashboard')} flex items-center gap-1`}>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t('navDashboard')}</span>
                {activeSection === 'dashboard' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('timeline-section', 'timeline')} className={`${navLinkClass('timeline')} flex items-center gap-1`}>
                <LineChart className="w-3.5 h-3.5" />
                <span>{t('navTimeline')}</span>
                {activeSection === 'timeline' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('tags-section', 'tags')} className={`${navLinkClass('tags')} flex items-center gap-1`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('navTags')}</span>
                {activeSection === 'tags' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('comments-section', 'comments')} className={`${navLinkClass('comments')} flex items-center gap-1`}>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('navComments')}</span>
                {activeSection === 'comments' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('about-section', 'about')} className={`${navLinkClass('about')} flex items-center gap-1`}>
                <span>{t('navAbout')}</span>
                {activeSection === 'about' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('team-section', 'team')} className={`${navLinkClass('team')} flex items-center gap-1`}>
                <span>Our Team</span>
                {activeSection === 'team' && <NavUnderline />}
              </button>
              <button onClick={() => handleScrollToSection('contact-section', 'contact')} className={`${navLinkClass('contact')} flex items-center gap-1`}>
                <span>{t('navContact')}</span>
                {activeSection === 'contact' && <NavUnderline />}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};