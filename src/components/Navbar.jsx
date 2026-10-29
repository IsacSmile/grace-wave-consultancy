import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { GWEmblem } from '../assets/logo/GWEmblem';
import { siteConfig } from '../data/siteConfig';
import { testimonials } from '../data/testimonials';
import { useLenis } from './SmoothScroll';
import { CursorToggle } from './CursorToggle';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useLenis();

  // Handle scroll threshold for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href, 76);
  };

  const navItems = siteConfig.navigation.filter((item) => {
    if (item.href === '#testimonials') {
      return Boolean(siteConfig.showTestimonials && testimonials?.length > 0);
    }
    return true;
  });

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-[#F8FAFF]/80 backdrop-blur-xs py-4 sm:py-5 border-b border-slate-200/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            aria-label="Grace Way Chartered Accountant - Home"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0B1B4D] border border-blue-400/25 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform p-1.5 shrink-0">
              <GWEmblem className="w-full h-full" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-extrabold text-[#0B1B4D] text-base sm:text-lg leading-tight tracking-tight">
                Grace Way
              </span>
              <span className="text-[10px] sm:text-xs text-[#8A6A1E] font-bold tracking-[0.14em] uppercase">
                Chartered Accountant
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.business.phones[0].tel}`}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#0B1B4D] hover:text-blue-600 border border-slate-200/90 hover:border-slate-300 rounded-[7px] bg-white shadow-xs hover:shadow-sm active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title={`Call ${siteConfig.business.phones[0].display}`}
              aria-label={`Call Grace Way Accounting at ${siteConfig.business.phones[0].display}`}
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Call Now</span>
            </a>

            <CursorToggle />

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-[7px] shadow-sm hover:shadow-md active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Enquire Now</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-[#0B1B4D] hover:bg-slate-100 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1B4D]/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        id="mobile-nav-drawer"
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B4D] border border-blue-400/25 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                <GWEmblem className="w-full h-full" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-[#0B1B4D] text-sm leading-tight">Grace Way</div>
                <div className="text-[10px] text-[#8A6A1E] font-bold tracking-wider uppercase mt-0.5">Chartered Accountant</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100 min-h-[48px]"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col gap-3">
          <a
            href={`tel:${siteConfig.business.phones[0].tel}`}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[7px] text-sm font-bold text-[#0B1B4D] bg-white border border-slate-200/90 shadow-xs min-h-[48px]"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Call Now ({siteConfig.business.phones[0].display})</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-[7px] text-sm font-bold text-white bg-blue-600 shadow-sm min-h-[48px]"
          >
            <span>Get a Free Enquiry</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <p className="text-center text-[11px] text-slate-500 mt-1">
            Ajman, UAE • Accounting, Tax & Advisory
          </p>
        </div>
      </aside>
    </>
  );
}
