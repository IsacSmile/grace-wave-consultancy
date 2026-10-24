import { useState, useEffect } from 'react';

/**
 * Hook to detect whether the device supports precise pointer hover
 * (e.g., desktop mouse or trackpad).
 * Returns true for desktop hover environments, and false for touch/mobile devices.
 */
export function useHoverCapable() {
  const [isHoverCapable, setIsHoverCapable] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverCapable(mediaQuery.matches);

    const listener = (event) => {
      setIsHoverCapable(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  return isHoverCapable;
}
