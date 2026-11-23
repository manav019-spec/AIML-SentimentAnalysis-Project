import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSentiment } from '../../context/SentimentContext';

// Short error message shown directly under an "Analyze" button
// (e.g. "Server not connected", "That doesn't look like a valid YouTube link").
// `floating` makes it a small box that drops below the navbar search bar instead of pushing content.
export const InlineError = ({ className = '', floating = false }) => {
  const { errorState } = useSentiment();
  if (!errorState?.message) return null;

  return (
    <p
      role="alert"
      className={`flex items-start gap-2 text-xs leading-relaxed text-[#111111] dark:text-[#F5F5F5] animate-fade-in ${
        floating
          ? 'px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-[#111111] dark:border-[#F5F5F5] shadow-lg'
          : ''
      } ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>{errorState.message}</span>
    </p>
  );
};
