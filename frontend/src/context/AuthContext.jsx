import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);   // false until the saved session has been checked
  const [googleClientId, setGoogleClientId] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' or 'signup'
  const [authError, setAuthError] = useState('');

  const openAuthModal = useCallback((tab = 'signin', message = '') => {
    setAuthModalTab(tab);
    setAuthError(message);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  // A refresh token that no longer works → drop to the signed-out state and ask to sign in again.
  useEffect(() => {
    api.setSessionExpiredHandler(() => {
      api.tokens.clear();
      setUser(null);
      openAuthModal('signin', 'Your session expired. Please sign in again.');
    });
  }, [openAuthModal]);

  // On first load: ask the server what it supports, and restore the saved session (if any).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const config = await api.getConfig();
        if (!cancelled) setGoogleClientId(config.googleClientId || null);
      } catch { /* server offline: Google button stays hidden */ }

      if (api.auth.hasTokens()) {
        try {
          const me = await api.auth.me();
          if (!cancelled) setUser(me);
        } catch (err) {
          if (err.type !== 'SERVER_UNREACHABLE') api.tokens.clear();   // bad/expired session
        }
      }
      if (!cancelled) setAuthReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const finishAuth = (me) => {
    setUser(me);
    setAuthError('');
    setIsAuthModalOpen(false);
    return true;
  };

  const login = async (email, password) => {
    setAuthError('');
    try { return finishAuth(await api.auth.login(email, password)); }
    catch (err) { setAuthError(err.message); return false; }
  };

  const signup = async (name, email, password) => {
    setAuthError('');
    try { return finishAuth(await api.auth.register(name, email, password)); }
    catch (err) { setAuthError(err.message); return false; }
  };

  const loginWithGoogleCredential = async (credential) => {
    setAuthError('');
    try { return finishAuth(await api.auth.google(credential)); }
    catch (err) { setAuthError(err.message); return false; }
  };

  const logout = () => {
    api.tokens.clear();
    setUser(null);
  };

  // Re-read the profile (e.g. to update the "analyses" counter after a new analysis).
  const refreshUser = useCallback(async () => {
    try { setUser(await api.auth.me()); } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authReady,
        googleClientId,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authError,
        setAuthError,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithGoogleCredential,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
