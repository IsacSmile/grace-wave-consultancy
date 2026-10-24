import React from 'react';
import { ArrowUpRight, Check, Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { siteConfig } from '../data/siteConfig';
import { useLenis } from './SmoothScroll';

export function ProcessList({ steps }) {
  const { scrollTo } = useLenis();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

  const primaryPhone = siteConfig.business.phones[0]?.tel || '+971569148255';
  const whatsappUrl = siteConfig.business.whatsapp;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-16 md:py-24 bg-white text-slate-800 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Compact Section Heading */}
        <div className="mb-10 md:mb-14 text-left">
          <SectionHeading
            badge="HOW WE WORK"
            title="From enquiry to onboarding"
            className="text-left"
          />
        </div>

        {/* Vertical List of 4 Steps */}
        <ol className="divide-y divide-[#0A1F4D]/10 list-none p-0 m-0">
          {steps.map((step, idx) => (
            <li key={step.id} className="py-6 md:py-8 first:pt-0">
              <Reveal delay={idx * 0.08} y={20}>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                  {/* Step Number with slashed zero, tabular nums & wide tracking */}
                  <span className="font-heading font-extrabold text-5xl md:text-6xl text-[#0A1F4D] tracking-wider shrink-0 font-numeric-slashed">
                    {step.number}
                  </span>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg md:text-2xl text-[#0A1F4D] mb-1.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 leading-[1.6] max-w-2xl">
                      {step.text}
                    </p>

                    {/* What happens checklist */}
                    {step.points && step.points.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-[#0A1F4D]/10">
                        <ul className="space-y-2">
                          {step.points.map((pt, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-[#C5A059] stroke-[2.5]" />
                              </div>
                              <span className="text-xs sm:text-sm text-[#0A1F4D] font-medium">
                                {pt}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What we may need from you chips */}
                    {step.youProvide && step.youProvide.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-[#0A1F4D]/10">
                        <span className="block text-[11px] font-bold text-[#C5A059] uppercase tracking-[0.14em] mb-1.5">
                          What we may need from you
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {step.youProvide.map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs text-slate-700 bg-slate-50 border border-[#0A1F4D]/[0.12]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 1 Quick Contact Buttons */}
                    {idx === 0 && (
                      <div className="mt-4 flex items-center gap-3">
                        <a
                          href={`tel:${primaryPhone}`}
                          className="h-10 px-4 rounded-xl text-xs font-semibold text-[#0A1F4D] bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm transition-all inline-flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-gold-600" />
                          <span>Call</span>
                        </a>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 px-4 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-all inline-flex items-center justify-center gap-1.5"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Start your enquiry CTA button */}
        <Reveal delay={0.25} y={16}>
          <div className="mt-10 md:mt-14 pt-4">
            <a
              href="#contact"
              onClick={handleEnquiryClick}
              className="h-12 px-7 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>Start your enquiry</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
