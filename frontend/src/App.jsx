import React from 'react';
import { useSentiment } from './context/SentimentContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { SkeletonLoader } from './components/common/SkeletonLoader';

// Landing Page Embedded Sections (Unauthenticated Homepage Flow)
import { HeroSection } from './components/landing/HeroSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { AboutSection } from './components/landing/AboutSection';
import { ContactSection } from './components/landing/ContactSection';
import { TeamSection } from './components/landing/TeamSection';

// Logged In Home Page Component (Authenticated - Shows Previous Analyses)
import { LoggedInHome } from './components/landing/LoggedInHome';

// Dashboard Report Components (After Video Analysis)
import { VideoHeader } from './components/dashboard/VideoHeader';
import { OverallScoreCard } from './components/dashboard/OverallScoreCard';
import { SentimentDonut } from './components/dashboard/SentimentDonut';
import { TrendLineChart } from './components/dashboard/TrendLineChart';
import { HighlightCards } from './components/dashboard/HighlightCards';
import { KeywordBars } from './components/dashboard/KeywordBars';
import { TopicTags, EmojiReactions } from './components/dashboard/TagsAndEmojis';
import { EngagementCharts } from './components/dashboard/EngagementCharts';
import { ToxicityCard } from './components/dashboard/ToxicityCard';
import { AudienceInsights } from './components/dashboard/AudienceInsights';

export function App() {
  const { activeTab, showSkeleton, currentVideo, goToHome } = useSentiment();
  const { isAuthenticated, authReady } = useAuth();

  // Wait until the saved session has been checked, so the page doesn't flash the signed-out home.
  if (!authReady) {
    return <div className="min-h-screen bg-white dark:bg-[#121212]" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-[#111111] dark:text-[#F5F5F5] transition-colors duration-200">
      
      {/* Top Sticky Header & Taskbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Cards (when YouTube URL is invalid or comments disabled) */}

        {/* Dynamic Content Switching */}
        {showSkeleton ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* 1. HOME VIEW */}
            {activeTab === 'home' && (
              <>
                {isAuthenticated ? (
                  // Logged-in Home: Search Bar + Previously Analyzed Section
                  <div className="space-y-16">
                    <LoggedInHome />
                    <AboutSection />
                    <TeamSection />
                    <ContactSection />
                  </div>
                ) : (
                  // Public Homepage Flow: Hero, Features, About Us, Contact Us
                  <div className="space-y-12">
                    <HeroSection />
                    <FeaturesSection />
                    <AboutSection />
                    <TeamSection />
                    <ContactSection />
                  </div>
                )}
              </>
            )}

            {/* 2. DASHBOARD VIEW (Clean Report with Section Anchors) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* 1. Main Video Header & Overall Score (#dashboard-section) */}
                <div id="dashboard-section" className="space-y-6 scroll-mt-24">
                  {currentVideo?.isSample && (
                    <div role="note" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-xl border border-dashed border-[#111111] dark:border-[#F5F5F5] bg-white dark:bg-[#1A1A1A]">
                      <p className="text-xs leading-relaxed text-[#111111] dark:text-[#F5F5F5]">
                        <strong className="font-semibold">Sample report.</strong>{' '}
                        This is demo data about a fictional video. Sign in and analyze a real YouTube link to see your own results.
                      </p>
                      <button
                        onClick={goToHome}
                        className="px-4 py-2 rounded-md bg-[#111111] dark:bg-[#F5F5F5] text-white dark:text-[#111111] font-semibold text-xs flex-shrink-0 active:scale-95 transition-transform"
                      >
                        Analyze a real video
                      </button>
                    </div>
                  )}
                  <VideoHeader />

                  {/* Overall Score & Sentiment Donut */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-5">
                      <OverallScoreCard />
                    </div>
                    <div className="lg:col-span-7">
                      <SentimentDonut />
                    </div>
                  </div>
                </div>

                {/* 2. Sentiment Trend Line Chart Over Time (#timeline-section) */}
                <div id="timeline-section" className="scroll-mt-24">
                  <TrendLineChart />
                </div>

                {/* 3. Topics, tags & emoji reactions (#tags-section) */}
                <div id="tags-section" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <KeywordBars />
                    <TopicTags />
                  </div>
                  <div className="lg:col-span-5 lg:self-stretch">
                    <EmojiReactions />
                  </div>
                </div>

                {/* 4. Engagement analysis (#engagement-section) */}
                <div id="engagement-section" className="scroll-mt-24">
                  <EngagementCharts />
                </div>

                {/* 5. Toxicity & community health (#toxicity-section) */}
                <div id="toxicity-section" className="scroll-mt-24">
                  <ToxicityCard />
                </div>

                {/* 6. Audience & top commenters (#audience-section) */}
                <div id="audience-section" className="scroll-mt-24">
                  <AudienceInsights />
                </div>

                {/* 7. Highlight comments (#comments-section) */}
                <HighlightCards />

              </div>
            )}
          </>
        )}

      </main>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Dynamic Footer */}
      <Footer />
    </div>
  );
}

export default App;
