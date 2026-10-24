import React from 'react';
import { BookOpenCheck, ShieldCheck, TrendingUp, CheckCircle, ArrowDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { Reveal } from './Reveal';
import { useLenis } from './SmoothScroll';

const iconMap = {
  BookOpenCheck: BookOpenCheck,
  ShieldAlert: ShieldCheck,
  TrendingUp: TrendingUp,
};

export function Services() {
  const { scrollTo } = useLenis();

  const handleCardClick = (e, targetId) => {
    e.preventDefault();
    scrollTo(`#${targetId}`, 76);
  };

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-slate-50 text-slate-800 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <span className="inline-block px-3.5 py-1 rounded-full bg-navy-100 text-navy-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 border border-navy-200/60">
              {siteConfig.services.sectionBadge}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-navy-950 tracking-tight leading-tight mb-4">
              {siteConfig.services.title}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {siteConfig.services.subtitle}
            </p>
          </Reveal>
        </div>

        {/* 3 Overview Service Cards with Stagger Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {siteConfig.services.list.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || BookOpenCheck;

            return (
              <Reveal key={service.id} delay={idx * 0.1} y={35} className="h-full">
                <div className="h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-gold-400 hover:shadow-elevated transition-all duration-300 group">
                  <div>
                    {/* Icon & Index Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-navy-900 text-gold-400 flex items-center justify-center shadow-md group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="font-heading font-bold text-2xl text-slate-300 group-hover:text-gold-500 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl text-navy-950 mb-3 group-hover:text-gold-600 transition-colors">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-2.5 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Links: Learn details + Enquire */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`#${service.anchorId}`}
                      onClick={(e) => handleCardClick(e, service.anchorId)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-gold-600 transition-colors min-h-[44px] py-2"
                    >
                      <span>Explore Scope</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href="#contact"
                      onClick={handleEnquiryClick}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 hover:text-navy-900 transition-colors min-h-[44px] py-2"
                    >
                      <span>Enquire</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Section CTA Callout Banner */}
        <Reveal y={20}>
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-navy-800">
            <div className="text-center md:text-left">
              <h4 className="font-heading font-bold text-lg sm:text-xl text-white mb-1.5">
                {siteConfig.services.ctaBanner.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {siteConfig.services.ctaBanner.subtitle}
              </p>
            </div>
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-md hover:shadow-gold-glow transition-all"
            >
              <span>{siteConfig.services.ctaBanner.buttonText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
