import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gw-cursor';

const CursorContext = createContext({
  enabled: false,
  setEnabled: () => {},
  toggle: () => {},
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }) {
  const [enabled, setEnabledState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'on') return true;
        if (stored === 'off') return false;
      }
    } catch {
      // LocalStorage unavailable (e.g. security sandbox or incognito)
    }
    return false; // Default off (uses standard default system cursor)
  });

  const setEnabled = useCallback((value) => {
    setEnabledState((prev) => {
      const next = typeof value === 'function' ? value(prev) : Boolean(value);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
        }
      } catch {
        // Ignore write errors
      }
      return next;
    });
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, [setEnabled]);

  return (
    <CursorContext.Provider value={{ enabled, setEnabled, toggle }}>
      {children}
    </CursorContext.Provider>
  );
}
