import React from 'react';
import { ArrowUp } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Logo } from '../assets/logo/Logo';
import { siteConfig } from '../data/siteConfig';
import { servicesData } from '../data/services';
import { useLenis } from './SmoothScroll';
import { useHoverCapable } from '../hooks/useHoverCapable';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Reveal } from './Reveal';

export function Footer() {
  const { lenis, scrollTo } = useLenis();
  const isHoverCapable = useHoverCapable();
  const prefersReducedMotion = useReducedMotion();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    scrollTo(href, 76);
  };

  const handleServiceClick = (e, serviceValue) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('enquiry:select-service', { detail: serviceValue })
    );
    scrollTo('#contact', 76);
  };

  const handleScrollTop = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      scrollTo(0, 0);
    }
  };

  // Filter only items with non-empty URL (if none besides WhatsApp exist, only WhatsApp is rendered)
  const activeSocials = (siteConfig.socials || []).filter(
    (item) => Boolean(item.url && item.url.trim() && item.url !== '#')
  );

  const exploreLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Why Grace Way', href: '#why' },
    { label: 'How We Work', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      aria-label="Site footer"
      className="bg-[#F8FAFF] text-slate-600 border-t border-[#0B1B4D]/10 pt-14 md:pt-20 pb-[calc(env(safe-area-inset-bottom)+6rem)] sm:pb-8"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-left">
        {/* Main Grid: Mobile (1 col), md (full width brand + 3 cols below), lg (12 cols) */}
        <Reveal
          y={20}
          stagger={0.08}
          start="top 92%"
          once={true}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-8 xl:gap-12"
        >
          {/* 1. Brand Block: 5 cols on lg */}
          <div className="col-span-1 md:col-span-3 lg:col-span-5 flex flex-col items-start">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="inline-flex items-center text-[#0B1B4D] hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-0.5"
              aria-label="Grace Way Accounting FZC LLC - Home"
            >
              <Logo className="text-[#0B1B4D]" height={38} />
            </a>

            <p className="mt-3.5 text-sm text-slate-600 leading-relaxed max-w-sm font-medium">
              Accounting, auditing, tax, compliance and advisory support for UAE businesses.
            </p>

            {/* Social Row: 40-44px circles, 1px navy/15% border, transparent bg, navy icon (18px) */}
            {activeSocials.length > 0 && (
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                {activeSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Grace Way on ${soc.label}`}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#0B1B4D]/15 bg-transparent flex items-center justify-center text-[#0B1B4D] transition-all duration-250 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isHoverCapable && !prefersReducedMotion
                        ? 'hover:bg-[#0B1B4D] hover:text-white hover:-translate-y-0.5'
                        : isHoverCapable
                        ? 'hover:bg-[#0B1B4D] hover:text-white'
                        : ''
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={soc.icon}
                      className="w-[18px] h-[18px] shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 2 & 3. 2-Column Grid on Mobile for Explore | Services */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Explore Navigation */}
            <div className="col-span-1 lg:col-span-2">
              <nav aria-label="Footer: Explore">
                <h4 className="text-[11px] font-semibold text-[#8A6A1E] uppercase tracking-[0.16em] mb-2 sm:mb-3">
                  Explore
                </h4>
                <ul className="space-y-0.5">
                  {exploreLinks.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="group relative inline-flex items-center text-[15px] font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] py-2.5 min-h-[44px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xs select-none"
                      >
                        <span className="relative">
                          {item.label}
                          {isHoverCapable && !prefersReducedMotion && (
                            <span
                              className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C5A059] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Services Navigation */}
            <div className="col-span-1 lg:col-span-2">
              <nav aria-label="Footer: Services">
                <h4 className="text-[11px] font-semibold text-[#8A6A1E] uppercase tracking-[0.16em] mb-2 sm:mb-3">
                  Services
                </h4>
                <ul className="space-y-0.5">
                  {servicesData.map((service) => (
                    <li key={service.id}>
                      <a
                        href="#services"
                        onClick={(e) => handleServiceClick(e, service.serviceValue)}
                        className="group relative inline-flex items-center text-[15px] font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] py-2.5 min-h-[44px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xs select-none text-left break-words"
                      >
                        <span className="relative">
                          {service.title}
                          {isHoverCapable && !prefersReducedMotion && (
                            <span
                              className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C5A059] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* 4. Contact Details: 3 cols on lg */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <address className="not-italic">
              <h4 className="text-[11px] font-semibold text-[#8A6A1E] uppercase tracking-[0.16em] mb-2 sm:mb-3">
                Contact
              </h4>
              <ul className="space-y-0.5">
                {/* Phones */}
                {(siteConfig.business.phones || []).map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="group relative inline-flex items-center text-[15px] font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] py-2.5 min-h-[44px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xs select-none"
                    >
                      <span className="relative">
                        <span className="whitespace-nowrap">{p.display}</span>
                        {isHoverCapable && !prefersReducedMotion && (
                          <span
                            className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C5A059] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </a>
                  </li>
                ))}

                {/* WhatsApp */}
                <li>
                  <a
                    href={siteConfig.business.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center text-[15px] font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] py-2.5 min-h-[44px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xs select-none"
                  >
                    <span className="relative">
                      Chat on WhatsApp
                      {isHoverCapable && !prefersReducedMotion && (
                        <span
                          className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C5A059] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </a>
                </li>

                {/* Email (rendered ONLY if non-empty real value exists) */}
                {Boolean(siteConfig.business.footerEmail) && (
                  <li>
                    <a
                      href={`mailto:${siteConfig.business.footerEmail}`}
                      className="group relative inline-flex items-center text-[15px] font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] py-2.5 min-h-[44px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xs select-none"
                    >
                      <span className="relative">
                        <span className="break-all">{siteConfig.business.footerEmail}</span>
                        {isHoverCapable && !prefersReducedMotion && (
                          <span
                            className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C5A059] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </a>
                  </li>
                )}

                {/* Address (rendered ONLY if non-empty real value exists) */}
                {Boolean(siteConfig.business.footerAddress) && (
                  <li className="py-2.5 min-h-[44px] text-[15px] font-medium text-[#0B1B4D]/80 leading-snug">
                    {siteConfig.business.footerAddress}
                  </li>
                )}

                {/* Working hours (rendered ONLY if non-empty real value exists) */}
                {Boolean(siteConfig.business.footerWorkingHours) && (
                  <li className="py-2.5 min-h-[44px] text-[15px] font-medium text-[#0B1B4D]/80 leading-snug">
                    {siteConfig.business.footerWorkingHours}
                  </li>
                )}
              </ul>
            </address>
          </div>
        </Reveal>

        {/* Bottom Bar: Single hairline above, computed year, Back to top */}
        <div className="border-t border-[#0B1B4D]/10 pt-6 mt-12 md:mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs sm:text-sm text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Grace Way Accounting FZC LLC. All rights reserved.
          </div>

          <button
            type="button"
            onClick={handleScrollTop}
            className="group inline-flex items-center gap-2 py-2 text-xs sm:text-sm font-medium text-[#0B1B4D]/80 hover:text-[#0B1B4D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px] cursor-pointer self-start md:self-auto"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#8A6A1E] transition-transform duration-200 group-hover:-translate-y-0.5 shrink-0" />
          </button>
        </div>
      </div>
    </footer>
  );
}
