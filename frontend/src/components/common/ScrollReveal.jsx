import React, { useEffect, useRef, useState } from 'react';

export const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  threshold = 0.15 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getTransformClass = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    
    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-10 scale-[0.98]';
      case 'down':
        return 'opacity-0 -translate-y-10 scale-[0.98]';
      case 'left':
        return 'opacity-0 translate-x-10 scale-[0.98]';
      case 'right':
        return 'opacity-0 -translate-x-10 scale-[0.98]';
      default:
        return 'opacity-0 scale-[0.98]';
    }
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
};
