import React, { useState, useEffect, useRef } from 'react';

/**
 * AutoTypeText component
 * Types text character-by-character when scrolled into the viewport.
 * Reactively re-types when language or text content changes.
 */
export const AutoTypeText = ({
  text = '',
  as: Component = 'span',
  speed = 20,
  delay = 0,
  className = '',
  cursor = true,
  cursorClassName = 'text-[#111111] dark:text-[#F5F5F5] font-light',
  once = true,
  threshold = 0.1,
  onComplete,
  children
}) => {
  const targetText = text || (typeof children === 'string' ? children : '');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const domRef = useRef(null);
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  // Reset when text changes (e.g., language switch)
  useEffect(() => {
    setDisplayedText('');
    setHasStarted(false);
    setIsTyping(false);
    setShowCursor(true);
    indexRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [targetText]);

  // Scroll detection via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasStarted, once, threshold, targetText]);

  // Typewriter effect execution
  useEffect(() => {
    if (!hasStarted || !targetText) return;

    const timeoutId = setTimeout(() => {
      setIsTyping(true);
      indexRef.current = 0;
      setDisplayedText('');

      timerRef.current = setInterval(() => {
        indexRef.current += 1;
        setDisplayedText(targetText.slice(0, indexRef.current));

        if (indexRef.current >= targetText.length) {
          clearInterval(timerRef.current);
          setIsTyping(false);
          if (onComplete) onComplete();
          // Hide blinking cursor 1 second after completion
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, targetText, speed, delay, onComplete]);

  return (
    <Component ref={domRef} className={`inline-block ${className}`}>
      {hasStarted ? displayedText : ''}
      {cursor && showCursor && hasStarted && (
        <span
          className={`inline-block ml-0.5 animate-pulse select-none ${cursorClassName} ${
            !isTyping ? 'opacity-60' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          |
        </span>
      )}
    </Component>
  );
};
