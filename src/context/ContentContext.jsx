import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { defaultSiteContent } from '../data/defaultContent';

const ContentContext = createContext(null);

const CACHE_KEY = 'gw_site_content_v1';
const BROADCAST_CHANNEL_NAME = 'gw_content_sync_channel';

/**
 * Deep merge helper to ensure user-customized sections blend safely with defaults.
 * If a key or nested field is absent in saved content, the default remains intact.
 */
function deepMerge(defaultObj, savedObj) {
  if (!savedObj || typeof savedObj !== 'object') return defaultObj;
  if (Array.isArray(savedObj)) return savedObj;

  const result = { ...defaultObj };
  for (const key of Object.keys(savedObj)) {
    const defaultVal = defaultObj ? defaultObj[key] : undefined;
    const savedVal = savedObj[key];

    if (
      savedVal &&
      typeof savedVal === 'object' &&
      !Array.isArray(savedVal) &&
      defaultVal &&
      typeof defaultVal === 'object' &&
      !Array.isArray(defaultVal)
    ) {
      result[key] = deepMerge(defaultVal, savedVal);
    } else if (savedVal !== undefined) {
      result[key] = savedVal;
    }
  }
  return result;
}

/**
 * Load cached content from localStorage if available for instantaneous first paint
 */
function getInitialContent() {
  if (typeof window === 'undefined') return defaultSiteContent;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return deepMerge(defaultSiteContent, parsed);
    }
  } catch (err) {
    console.warn('[ContentContext] Failed to parse localStorage cache:', err);
  }
  return defaultSiteContent;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(getInitialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Broadcast channel for multi-tab live sync
  const broadcastChannel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  // Fetch published content from Neon serverless database
  const refreshContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/content', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;

      const data = await res.json();
      if (data && data.ok && data.content) {
        const merged = deepMerge(defaultSiteContent, data.content);
        setContent(merged);
        setLastUpdated(Date.now());
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        } catch {
          // localStorage might be restricted or full
        }
      }
    } catch (err) {
      console.warn('[ContentContext] Network error while fetching live content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // Listen to broadcast messages from Admin tab for instant live sync
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event) => {
      if (event?.data?.type === 'CONTENT_UPDATED' && event?.data?.content) {
        const merged = deepMerge(defaultSiteContent, event.data.content);
        setContent(merged);
        setLastUpdated(Date.now());
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        } catch {
          // Ignore
        }
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel.removeEventListener('message', handleMessage);
    };
  }, [broadcastChannel]);

  // Also listen for storage event for cross-tab sync fallback
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setContent(deepMerge(defaultSiteContent, parsed));
          setLastUpdated(Date.now());
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Method to publish an update (called by AdminApp upon save)
  const broadcastUpdate = useCallback(
    (newContent) => {
      const merged = deepMerge(defaultSiteContent, newContent);
      setContent(merged);
      setLastUpdated(Date.now());
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore
      }
      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'CONTENT_UPDATED',
          content: merged,
        });
      }
    },
    [broadcastChannel]
  );

  const value = useMemo(
    () => ({
      content,
      hero: content.hero || defaultSiteContent.hero,
      stats: content.stats || defaultSiteContent.stats,
      serviceTabs: content.serviceTabs || defaultSiteContent.serviceTabs,
      process: content.process || defaultSiteContent.process,
      testimonials: content.testimonials || defaultSiteContent.testimonials,
      contact: content.contact || defaultSiteContent.contact,
      footer: content.footer || defaultSiteContent.footer,
      isLoading,
      lastUpdated,
      refreshContent,
      broadcastUpdate,
    }),
    [content, isLoading, lastUpdated, refreshContent, broadcastUpdate]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(ContentContext);
  if (!context) {
    // Graceful fallback if used outside of provider
    return {
      content: defaultSiteContent,
      hero: defaultSiteContent.hero,
      stats: defaultSiteContent.stats,
      serviceTabs: defaultSiteContent.serviceTabs,
      process: defaultSiteContent.process,
      testimonials: defaultSiteContent.testimonials,
      contact: defaultSiteContent.contact,
      footer: defaultSiteContent.footer,
      isLoading: false,
      lastUpdated: 0,
      refreshContent: () => {},
      broadcastUpdate: () => {},
    };
  }
  return context;
}

