import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as api from '../services/api';
import { sampleReport } from '../data/sampleReport';
import { useAuth } from './AuthContext';

const SentimentContext = createContext();

export const SentimentProvider = ({ children }) => {
  const { isAuthenticated, authReady, openAuthModal, refreshUser } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchUrl, setSearchUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'dashboard'
  const [hasActiveReport, setHasActiveReport] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(null); // { progress: 0-100, stage }
  const [popupData, setPopupData] = useState(null); // { title, message }
  // The loading skeleton replaces the page only once a job has really started, so a quick failure
  // (wrong URL, server down) leaves whatever is on screen untouched and just shows the inline message.
  const [jobStarted, setJobStarted] = useState(false);
  const analysisRun = useRef(0); // lets a newer analysis supersede an older one still polling

  // Fallback straight-line wipe state
  const [themeTransition, setThemeTransition] = useState(null);

  // Theme Management with localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('sentiscope_theme');
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });

  // History: the signed-in user's saved reports, kept on the server
  const [historyList, setHistoryList] = useState([]);

  // Sync theme with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('sentiscope_theme', theme);
  }, [theme]);

  const refreshHistory = async () => {
    try {
      setHistoryList(await api.getHistory());
    } catch {
      /* history is non-critical; the next successful call refreshes it */
    }
  };

  // Load the history when the user signs in; clear everything when they sign out.
  useEffect(() => {
    if (!authReady) return;
    if (isAuthenticated) {
      refreshHistory();
    } else {
      setHistoryList([]);
      setCurrentVideo(null);
      setHasActiveReport(false);
      setActiveTab('home');
      setErrorState(null);
    }
  }, [isAuthenticated, authReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Crisp straight-line theme toggle (exact match to sample):
  // Light to Dark: straight line moves top-to-bottom
  // Dark to Light: straight line moves bottom-to-top
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const directionClass = nextTheme === 'dark' ? 'transitioning-to-dark' : 'transitioning-to-light';
    const fallbackDirection = nextTheme === 'dark' ? 'to-dark' : 'to-light';

    if (document.startViewTransition) {
      document.documentElement.classList.add(directionClass);
      
      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove(directionClass);
      });
    } else {
      // Fallback for browsers without View Transitions
      setThemeTransition(fallbackDirection);
      setTimeout(() => {
        setTheme(nextTheme);
      }, 200);
      setTimeout(() => {
        setThemeTransition(null);
      }, 550);
    }
  };

  const goToHome = () => {
    setSearchUrl('');
    setErrorState(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Analysis: the backend fetches the comments, scores them, and we poll its progress ──
  const analyzeVideoLive = async (targetUrl) => {
    const runId = ++analysisRun.current;
    const isCurrent = () => runId === analysisRun.current;

    setIsLoading(true);
    setJobStarted(false);
    setSearchUrl(targetUrl);
    setAnalysisProgress({ progress: 0, stage: 'QUEUED' });

    try {
      const job = await api.startAnalysis(targetUrl);
      if (isCurrent()) setJobStarted(true);
      if (job.status !== 'COMPLETED') {
        await api.waitForJob(job.job_id, {
          onProgress: (st) => {
            if (isCurrent()) setAnalysisProgress({ progress: st.progress_percentage, stage: st.stage });
          },
        });
      }
      // Fetching the report also saves it to this user's history on the server.
      const report = await api.getReport(job.video_id);
      if (!isCurrent()) return;

      setCurrentVideo({ ...report, analyzedAt: 'Just Now' });
      setHasActiveReport(true);
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      refreshHistory();
      refreshUser();
    } catch (err) {
      if (isCurrent()) {
        const error = api.toErrorState(err);
        setErrorState(error);
        
        // NEW: Check if it's a live stream/no comments error and trigger popup
        if (
          error?.message?.toLowerCase().includes("live stream") ||
          error?.message?.toLowerCase().includes("no comments") ||
          error?.type === "NO_COMMENTS"
        ) {
          setPopupData({
            title: "Live Stream Notice",
            message: "YouTube doesn't provide standard comments for active live streams. Please try a regular video or a past live stream!"
          });
        }
      }
    } finally {
      if (isCurrent()) {
        setIsLoading(false);
        setJobStarted(false);
        setAnalysisProgress(null);
      }
    }
  };

  const analyzeVideo = (inputUrl = searchUrl) => {
    const targetUrl = (inputUrl || '').trim();
    setErrorState(null);

    if (!isAuthenticated) {          // you must be signed in to analyze
      openAuthModal('signin');
      return;
    }
    if (!targetUrl) {
      setErrorState(api.toErrorState({ type: 'INVALID_URL' }));
      return;
    }
    return analyzeVideoLive(targetUrl);   // URL validation happens on the server
  };

  // Reopen a report from history exactly as it was saved.
  const openReport = async (video) => {
    const runId = ++analysisRun.current;
    setErrorState(null);
    setIsLoading(true);
    setJobStarted(true);
    try {
      const report = await api.getSavedReport(video.id);
      if (runId !== analysisRun.current) return;
      setCurrentVideo(report);
      setHasActiveReport(true);
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (runId === analysisRun.current) setErrorState(api.toErrorState(err));
    } finally {
      if (runId === analysisRun.current) {
        setIsLoading(false);
        setJobStarted(false);
      }
    }
  };

  // Preview the dashboard with the built-in demo data (no sign-in, no backend, never saved).
  const viewSampleReport = () => {
    analysisRun.current += 1;          // cancel any analysis still running
    setErrorState(null);
    setIsLoading(false);
    setJobStarted(false);
    setCurrentVideo(sampleReport);
    setHasActiveReport(true);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFromHistory = async (id) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id));   // optimistic
    try { await api.deleteFromHistory(id); } catch { refreshHistory(); }
  };

  const clearHistory = async () => {
    setHistoryList([]);
    try { await api.clearHistory(); } catch { refreshHistory(); }
  };

  const clearError = () => {
    setErrorState(null);
  };

  return (
    <SentimentContext.Provider
      value={{
        currentVideo,
        searchUrl,
        setSearchUrl,
        isLoading,
        showSkeleton: isLoading && jobStarted,
        analysisProgress,
        activeTab,
        setActiveTab,
        hasActiveReport,
        goToHome,
        errorState,
        setErrorState,
        clearError,
        theme,
        toggleTheme,
        historyList,
        removeFromHistory,
        clearHistory,
        analyzeVideo,
        openReport,
        viewSampleReport,
        popupData,
        setPopupData
      }}
    >
      {/* Fallback straight-line visual line for non-view-transition browsers */}
      {themeTransition === 'to-dark' && <div className="theme-line-to-dark" />}
      {themeTransition === 'to-light' && <div className="theme-line-to-light" />}

      {children}
    </SentimentContext.Provider>
  );
};

export const useSentiment = () => useContext(SentimentContext);
