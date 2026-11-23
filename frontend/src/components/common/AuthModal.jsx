import React from 'react';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    googleClientId,
    loginWithGoogleCredential,
    login,
    signup,
    authError,
    setAuthError
  } = useAuth();

  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleBtnRef = useRef(null);

  // Render Google's official sign-in button (only when the server has a GOOGLE_CLIENT_ID).
  useEffect(() => {
    if (!isAuthModalOpen || !googleClientId) return undefined;
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (resp) => loginWithGoogleCredential(resp.credential),
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 320, text: 'continue_with',
      });
    };
    if (window.google?.accounts?.id) {
      init();
      return () => { cancelled = true; };
    }
    let script = document.getElementById('gsi-client');
    if (!script) {
      script = document.createElement('script');
      script.id = 'gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', init);
    return () => { cancelled = true; script.removeEventListener('load', init); };
  }, [isAuthModalOpen, googleClientId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (authModalTab === 'signin') {
      await login(usernameOrEmail, password);
    } else {
      await signup(name, usernameOrEmail, password);
    }
    setIsSubmitting(false);
  };

  const inputClass = "w-full bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#303030] rounded-lg pl-10 pr-3.5 py-2 text-xs text-[#111111] dark:text-[#F5F5F5] placeholder-[#AAAAAA] dark:placeholder-[#555555] focus:outline-none focus:border-[#111111] dark:focus:border-[#F5F5F5] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#303030] rounded-xl p-6 sm:p-8 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5] hover:bg-[#F0F0F0] dark:hover:bg-[#222222] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-11 h-11 rounded-lg border border-[#E5E5E5] dark:border-[#303030] flex items-center justify-center text-[#111111] dark:text-[#F5F5F5] mx-auto">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            {authModalTab === "signin"
              ? t("authSignInTitle", "Sign In to SentiScope")
              : t("authSignUpTitle", "Create Your Account")}
          </h3>
          <p className="text-xs text-[#777777] dark:text-[#888888]">
            {t(
              "authModalSub",
              "Sign in to analyze YouTube video comments and track audience sentiment.",
            )}
          </p>
        </div>

        {/* Google sign-in (shown only when the server is configured with a Google client ID) */}
        {googleClientId && (
          <div className="space-y-3 mb-5">
            <div
              ref={googleBtnRef}
              className="flex justify-center min-h-[44px]"
            />
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-[#E5E5E5] dark:bg-[#303030]" />
              <span className="text-[10px] text-[#777777] dark:text-[#888888] uppercase tracking-wider">
                {t("authOrDivider", "or sign in with credentials")}
              </span>
              <div className="h-[1px] flex-1 bg-[#E5E5E5] dark:bg-[#303030]" />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authModalTab === "signup" && (
            <div>
              <label className="block text-[11px] font-medium text-[#111111] dark:text-[#F5F5F5] mb-1">
                {t("authNameLabel", "Your Name")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#777777] dark:text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-[#111111] dark:text-[#F5F5F5] mb-1">
              {t("authEmailLabel", "Email")}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777777] dark:text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                autoComplete="email"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  setAuthError("");
                }}
                placeholder={t("authEmailPlaceholder", "you@example.com")}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#111111] dark:text-[#F5F5F5] mb-1">
              {t("authPasswordLabel", "Password")}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777777] dark:text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={
                  authModalTab === "signin"
                    ? "current-password"
                    : "new-password"
                }
                minLength={authModalTab === "signup" ? 8 : undefined}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError("");
                }}
                placeholder={t(
                  "authPasswordPlaceholder",
                  "Enter your password",
                )}
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#888888] hover:text-[#111111] dark:hover:text-[#F5F5F5]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#111111] dark:bg-[#F5F5F5] hover:bg-black dark:hover:bg-white text-white dark:text-[#111111] font-semibold text-xs rounded-lg transition-colors mt-2 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#111111] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {authModalTab === "signin"
                    ? t("authSignInSubmit", "Sign In to SentiScope")
                    : t("authSignUpSubmit", "Create Account")}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-4 text-center text-xs text-[#777777] dark:text-[#888888]">
          {authModalTab === "signin" ? (
            <p>
              {t("authNeedAccount", "Need a new account?")}{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("signup");
                  setAuthError("");
                }}
                className="text-[#111111] dark:text-[#F5F5F5] font-semibold underline hover:no-underline"
              >
                {t("authSignUpLink", "Sign up")}
              </button>
            </p>
          ) : (
            <p>
              {t("authHaveAccount", "Already have an account?")}{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("signin");
                  setAuthError("");
                }}
                className="text-[#111111] dark:text-[#F5F5F5] font-semibold underline hover:no-underline"
              >
                {t("authSignInLink", "Sign in")}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
