import React from 'react';
import { FileCheck, BadgeDollarSign, Clock, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { useLenis } from './SmoothScroll';

const iconMap = {
  FileCheck: FileCheck,
  BadgeDollarSign: BadgeDollarSign,
  Clock: Clock,
  Lock: Lock,
};

export function WhyChooseUs() {
  const { scrollTo } = useLenis();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  return (
    <section id="why-choose-us" className="py-20 md:py-28 lg:py-32 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-navy-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeading
          badge={siteConfig.whyChooseUs.sectionBadge}
          title={siteConfig.whyChooseUs.title}
          subtitle={siteConfig.whyChooseUs.subtitle}
          tone="dark"
        />

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {siteConfig.whyChooseUs.pillars.map((pillar, idx) => {
            const IconComponent = iconMap[pillar.icon] || ShieldCheck;

            return (
              <Reveal key={pillar.title} delay={idx * 0.08} y={30} className="h-full">
                <div className="h-full p-6 sm:p-7 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between group hover:shadow-gold-glow">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy-800 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-gold-400 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-navy-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-gold-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Guaranteed Diligence</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Section Bottom CTA */}
        <Reveal delay={0.2}>
          <div className="text-center">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-md hover:shadow-gold-glow transition-all"
            >
              <span>Speak with a UAE Accounting Consultant</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
