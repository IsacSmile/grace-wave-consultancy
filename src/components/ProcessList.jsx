import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { useLenis } from './SmoothScroll';

export function ProcessList({ steps }) {
  const { scrollTo } = useLenis();

  const handleEnquiryClick = (e) => {
    e.preventDefault();
    scrollTo('#contact', 76);
  };

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
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8">
                  {/* Step Number with slashed zero & tabular nums */}
                  <span className="font-heading font-extrabold text-5xl md:text-6xl text-[#0A1F4D] tracking-tight shrink-0 font-numeric-slashed">
                    {step.number}
                  </span>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg md:text-2xl text-[#0A1F4D] mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 leading-[1.6] max-w-2xl">
                      {step.text}
                    </p>
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
