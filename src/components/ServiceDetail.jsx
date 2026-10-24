import React from 'react';
import { BookOpenCheck, ShieldCheck, TrendingUp, Check, ArrowRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { Reveal } from './Reveal';
import { useLenis } from './SmoothScroll';

const iconMap = {
  BookOpenCheck: BookOpenCheck,
  ShieldAlert: ShieldCheck,
  TrendingUp: TrendingUp,
};

export function ServiceDetail() {
  const { scrollTo } = useLenis();

  const handleEnquireService = (e, serviceName) => {
    e.preventDefault();
    // Dispatch a custom event to notify EnquiryForm to pre-select this service
    window.dispatchEvent(new CustomEvent('select-service', { detail: serviceName }));
    scrollTo('#contact', 76);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {siteConfig.services.list.map((service, index) => {
          const IconComponent = iconMap[service.icon] || BookOpenCheck;
          const isEven = index % 2 === 1;

          return (
            <article
              key={service.id}
              id={service.anchorId}
              className="scroll-mt-24 pt-6"
            >
              <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-slate-50 border border-slate-200/90 shadow-sm relative overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900" />

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Left / Main Summary Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <Reveal>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100/80 text-navy-900 text-xs font-bold tracking-wider uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                        <span>Core Pillar 0{index + 1}</span>
                      </div>
                    </Reveal>

                    <Reveal delay={0.05}>
                      <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy-950 leading-tight">
                        {service.title}
                      </h3>
                    </Reveal>

                    <Reveal delay={0.1}>
                      <p className="text-sm font-semibold text-gold-700">
                        {service.details.tagline}
                      </p>
                    </Reveal>

                    <Reveal delay={0.15}>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {service.details.overview}
                      </p>
                    </Reveal>

                    {/* Ideal for tag */}
                    <Reveal delay={0.2}>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-normal">
                        <strong className="text-navy-900 font-semibold block mb-1">Recommended For:</strong>
                        {service.details.idealFor}
                      </div>
                    </Reveal>

                    {/* Specific Service CTA */}
                    <Reveal delay={0.25}>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => handleEnquireService(e, service.title)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 border border-navy-700 shadow-md hover:border-gold-500 transition-all min-h-[44px]"
                        >
                          <span>Enquire for {service.title}</span>
                          <ArrowRight className="w-4 h-4 text-gold-400" />
                        </button>
                      </div>
                    </Reveal>
                  </div>

                  {/* Right Column: 3 Deliverable breakdown cards */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-1 gap-4">
                    {service.details.deliverables.map((item, dIdx) => (
                      <Reveal key={item.heading} delay={dIdx * 0.08}>
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-navy-300 hover:shadow-soft transition-all">
                          <div className="flex items-start gap-3.5">
                            <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-base text-navy-950 mb-1">
                                {item.heading}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                </div>
              </div>
            </article>
          );
        })}

      </div>
    </section>
  );
}
