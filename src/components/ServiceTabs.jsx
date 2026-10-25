import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from './SectionHeading';
import { ServiceTabPanel } from './ServiceTabPanel';
import { serviceTabsData } from '../data/serviceTabs';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { aboutData } from '../data/about';

gsap.registerPlugin(ScrollTrigger);

export function ServiceTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const outerPanelRef = useRef(null);
  const tablistDesktopRef = useRef(null);
  const tablistMobileRef = useRef(null);
  const underlineRef = useRef(null);
  const panelsContainerRef = useRef(null);

  const tabButtonsRef = useRef([]);
  const mobilePillRefs = useRef([]);
  const panelRefs = useRef([]);
  const imageRefs = useRef([]);
  const itemsRefs = useRef([]);
  const counterRefs = useRef([]);

  const preloadedImages = useRef(new Set());
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const expStat = aboutData.floatingStats[0] || {
    value: 25,
    suffix: '+',
    label: 'Years of UAE experience',
  };

  // Preload tab images on hover / focus / touch
  const preloadTabImage = useCallback((idx) => {
    const tab = serviceTabsData[idx];
    if (tab && tab.image && !preloadedImages.current.has(tab.image)) {
      preloadedImages.current.add(tab.image);
      const img = new Image();
      img.src = tab.image;
    }
  }, []);

  // Update animated desktop underline position
  const updateUnderline = useCallback((instant = false) => {
    const activeBtn = tabButtonsRef.current[activeTab];
    if (!activeBtn || !underlineRef.current) return;

    const x = activeBtn.offsetLeft;
    const scaleX = activeBtn.offsetWidth;

    if (instant || prefersReducedMotion) {
      gsap.set(underlineRef.current, { x, scaleX });
    } else {
      gsap.to(underlineRef.current, {
        x,
        scaleX,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [activeTab, prefersReducedMotion]);

  // Center active mobile pill
  const centerMobilePill = useCallback(() => {
    const activePill = mobilePillRefs.current[activeTab];
    if (activePill) {
      activePill.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab, prefersReducedMotion]);

  // Handle tab switch with GSAP transitions
  const handleTabChange = useCallback((nextIndex) => {
    if (nextIndex === activeTab) return;
    const prevIndex = activeTab;
    setActiveTab(nextIndex);

    // Preload next image if not already
    preloadTabImage(nextIndex);

    if (prefersReducedMotion) {
      if (panelRefs.current[prevIndex]) {
        panelRefs.current[prevIndex].style.visibility = 'hidden';
        panelRefs.current[prevIndex].style.opacity = '0';
      }
      if (panelRefs.current[nextIndex]) {
        panelRefs.current[nextIndex].style.visibility = 'visible';
        panelRefs.current[nextIndex].style.opacity = '1';
      }
      ScrollTrigger.refresh();
      return;
    }

    const outgoing = panelRefs.current[prevIndex];
    const incoming = panelRefs.current[nextIndex];
    const incomingImg = imageRefs.current[nextIndex];
    const incomingItems = itemsRefs.current[nextIndex]?.querySelectorAll('.service-accordion-item, .service-panel-item');

    // Kill active tweens to prevent rapid-click stacking
    if (outgoing) gsap.killTweensOf(outgoing);
    if (incoming) gsap.killTweensOf(incoming);
    if (incomingImg) gsap.killTweensOf(incomingImg);
    if (incomingItems) gsap.killTweensOf(incomingItems);

    // Smooth container height transition on mobile
    if (panelsContainerRef.current && incoming && window.innerWidth < 1024) {
      const prevH = panelsContainerRef.current.offsetHeight;
      incoming.style.visibility = 'hidden';
      incoming.style.position = 'relative';
      const nextH = incoming.offsetHeight || incoming.scrollHeight;
      incoming.style.position = '';
      incoming.style.visibility = '';

      if (prevH && nextH && Math.abs(prevH - nextH) > 4) {
        gsap.fromTo(
          panelsContainerRef.current,
          { height: prevH },
          {
            height: nextH,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              if (panelsContainerRef.current) {
                panelsContainerRef.current.style.height = 'auto';
              }
              ScrollTrigger.refresh();
            },
          }
        );
      }
    }

    // Outgoing panel: fades and moves y 0 to -12 (0.2s power2.in)
    if (outgoing) {
      gsap.to(outgoing, {
        y: -12,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => {
          outgoing.style.visibility = 'hidden';
        },
      });
    }

    // Incoming panel: y 16 to 0 + opacity (0.4s power3.out)
    if (incoming) {
      incoming.style.visibility = 'visible';
      gsap.fromTo(
        incoming,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }

    // Items stagger in 0.08s
    if (incomingItems && incomingItems.length > 0) {
      gsap.fromTo(
        incomingItems,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
        }
      );
    }

    // Image crossfades with scale 1.06 to 1 (0.6s)
    if (incomingImg) {
      gsap.fromTo(
        incomingImg,
        { scale: 1.06, opacity: 0.7 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  }, [activeTab, prefersReducedMotion, preloadTabImage]);

  // Keyboard navigation (Roving tabindex pattern)
  const handleKeyDown = (e, currentIndex) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % serviceTabsData.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + serviceTabsData.length) % serviceTabsData.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = serviceTabsData.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      handleTabChange(nextIndex);
      const isMobile = window.innerWidth < 768;
      const targetBtn = isMobile
        ? mobilePillRefs.current[nextIndex]
        : tabButtonsRef.current[nextIndex];
      targetBtn?.focus();
    }
  };

  // Optional swipe on touch
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Threshold 50px, ignore mostly vertical gestures so page scroll is unaffected
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Swiped left -> next tab
          const nextIdx = (activeTab + 1) % serviceTabsData.length;
          handleTabChange(nextIdx);
        } else {
          // Swiped right -> prev tab
          const prevIdx = (activeTab - 1 + serviceTabsData.length) % serviceTabsData.length;
          handleTabChange(prevIdx);
        }
      }
    }
  };

  // On desktop only, ensure container min-height so tabs with similar height don't jitter
  useEffect(() => {
    const updateMinHeight = () => {
      if (!panelsContainerRef.current) return;
      if (window.innerWidth < 1024) {
        // Mobile must have natural auto height with zero empty gap
        panelsContainerRef.current.style.minHeight = 'auto';
        return;
      }
      const heights = panelRefs.current.map((el) => (el ? el.scrollHeight || el.offsetHeight : 0));
      const maxHeight = Math.max(...heights, 0);
      if (maxHeight > 0) {
        panelsContainerRef.current.style.minHeight = `${maxHeight}px`;
      }
    };

    updateMinHeight();
    window.addEventListener('resize', updateMinHeight);
    return () => {
      window.removeEventListener('resize', updateMinHeight);
    };
  }, []);

  // Update underline on activeTab change and window events
  useEffect(() => {
    updateUnderline();
    centerMobilePill();

    const handleResize = () => {
      updateUnderline(true);
    };

    window.addEventListener('resize', handleResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateUnderline(true));
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateUnderline, centerMobilePill]);

  // Scroll entry animation with GSAP ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion || !outerPanelRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerPanelRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // 1. Outer panel rises 40px + fades
      tl.fromTo(
        outerPanelRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // 2. Tabs stagger 0.08s
      const tabElements = outerPanelRef.current.querySelectorAll('[role="tab"]');
      if (tabElements.length > 0) {
        tl.fromTo(
          tabElements,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.4'
        );
      }

      // 3. First panel content
      const firstPanel = panelRefs.current[0];
      if (firstPanel) {
        tl.fromTo(
          firstPanel,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.2'
        );
      }

      // 4. Counter run once
      const counterEl = counterRefs.current[0];
      if (counterEl) {
        const counterObj = { val: 0 };
        tl.to(
          counterObj,
          {
            val: expStat.value,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              if (counterEl) {
                counterEl.textContent = Math.round(counterObj.val).toString();
              }
            },
            onComplete: () => {
              if (counterEl) {
                counterEl.textContent = expStat.value.toString();
              }
            },
          },
          '-=0.4'
        );
      }
    }, outerPanelRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, expStat.value]);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      aria-labelledby="solutions-heading"
      className="bg-white py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left-aligned global heading tokens */}
        <SectionHeading
          id="solutions-heading"
          badge="WHAT WE DELIVER"
          title="Accounting, tax and advisory support, in detail"
          subtitle="Choose a service to see what is included."
          tone="light"
        />

        {/* Outer Panel: rounded-3xl, bg off-white (#F8FAFF), border 1px navy/8%, p-4 sm:p-6 md:p-8 lg:p-12 */}
        <div
          ref={outerPanelRef}
          className="rounded-3xl bg-[#F8FAFF] border border-[#0B1B4D]/[0.08] p-4 sm:p-6 md:p-8 lg:p-12 relative"
        >
          {/* ================= DESKTOP TABS (md+) ================= */}
          <div className="hidden md:block relative mb-10">
            <div
              ref={tablistDesktopRef}
              role="tablist"
              aria-label="Service Solutions"
              className="flex items-center gap-8 lg:gap-10 border-b border-[#0B1B4D]/10 relative"
            >
              {serviceTabsData.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => (tabButtonsRef.current[idx] = el)}
                    role="tab"
                    id={`desktop-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleTabChange(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onMouseEnter={() => preloadTabImage(idx)}
                    onFocus={() => preloadTabImage(idx)}
                    onTouchStart={() => preloadTabImage(idx)}
                    className={`pb-4 text-base lg:text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-sm whitespace-nowrap ${
                      isActive
                        ? 'text-[#0B1B4D] font-semibold'
                        : 'text-slate-500 font-medium hover:text-[#0B1B4D]'
                    }`}
                  >
                    {tab.tabLabel}
                  </button>
                );
              })}

              {/* Single animated gold underline (2px) */}
              <div
                ref={underlineRef}
                className="absolute bottom-0 left-0 h-[2px] w-[1px] bg-[#C5A059] origin-left pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ================= MOBILE TABS (<md) ================= */}
          <div className="md:hidden relative mb-6">
            <div
              ref={tablistMobileRef}
              role="tablist"
              aria-label="Service Solutions"
              className="flex items-center gap-2.5 overflow-x-auto snap-x no-scrollbar py-1 px-0.5"
            >
              {serviceTabsData.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => (mobilePillRefs.current[idx] = el)}
                    role="tab"
                    id={`mobile-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleTabChange(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onTouchStart={() => preloadTabImage(idx)}
                    className={`snap-center h-11 px-4 whitespace-nowrap text-sm font-medium rounded-full shrink-0 flex items-center justify-center transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isActive
                        ? 'bg-[#0B1B4D] text-white shadow-sm'
                        : 'bg-white border border-[#0B1B4D]/10 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tab.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= PANELS CONTAINER ================= */}
          <div
            ref={panelsContainerRef}
            className="relative w-full grid grid-cols-1 grid-rows-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {serviceTabsData.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <div
                  key={tab.id}
                  ref={(el) => (panelRefs.current[idx] = el)}
                  role="tabpanel"
                  id={`tabpanel-${tab.id}`}
                  aria-labelledby={`desktop-tab-${tab.id}`}
                  className={`col-start-1 row-start-1 w-full transition-opacity ${
                    isActive ? 'relative z-10 pointer-events-auto' : 'absolute inset-0 pointer-events-none'
                  }`}
                  style={{
                    visibility: isActive ? 'visible' : 'hidden',
                    opacity: isActive ? 1 : 0,
                  }}
                  aria-hidden={!isActive}
                >
                  <ServiceTabPanel
                    tab={tab}
                    isActive={isActive}
                    imageRef={(el) => (imageRefs.current[idx] = el)}
                    itemsRef={(el) => (itemsRefs.current[idx] = el)}
                    counterRef={(el) => (counterRefs.current[idx] = el)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
