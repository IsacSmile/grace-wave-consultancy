import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { EnquiryForm } from './EnquiryForm';
import { Reveal } from './Reveal';

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-50 text-slate-800 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <span className="inline-block px-3.5 py-1 rounded-full bg-navy-100 text-navy-800 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 border border-navy-200/60">
              {siteConfig.contact.sectionBadge}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-navy-950 tracking-tight leading-tight mb-4">
              {siteConfig.contact.title}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {siteConfig.contact.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact Info & Maps */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal y={20}>
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-heading font-bold text-lg text-navy-950 pb-3 border-b border-slate-100">
                  Direct Inquiries & Office Info
                </h3>

                {/* Phone Call */}
                <a
                  href={siteConfig.business.phoneTel}
                  className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group min-h-[44px]"
                  aria-label={`Call Grace Way Accounting at ${siteConfig.business.phoneDisplay}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Call Us Directly
                    </div>
                    <div className="text-sm sm:text-base font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                      {siteConfig.business.phoneDisplay}
                    </div>
                    <div className="text-[11px] text-slate-400">Toll-free / Direct Line (UAE)</div>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href={siteConfig.business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors group min-h-[44px]"
                  aria-label="Chat with Grace Way Accounting on WhatsApp"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:bg-emerald-700 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      WhatsApp Quick Chat
                    </div>
                    <div className="text-sm sm:text-base font-bold text-navy-900 group-hover:text-emerald-700 transition-colors">
                      {siteConfig.business.phoneDisplay}
                    </div>
                    <div className="text-[11px] text-slate-400">Fast response for urgent requests</div>
                  </div>
                </a>

                {/* Email Mailto */}
                <a
                  href={siteConfig.business.emailMailto}
                  className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group min-h-[44px]"
                  aria-label={`Email Grace Way Accounting at ${siteConfig.business.email}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Official Email
                    </div>
                    <div className="text-sm sm:text-base font-bold text-navy-900 group-hover:text-gold-600 transition-colors break-all">
                      {siteConfig.business.email}
                    </div>
                    <div className="text-[11px] text-slate-400">Formal RFPs & Documentation</div>
                  </div>
                </a>

                {/* Physical Address */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Consultancy Address
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-navy-900 leading-relaxed">
                      {siteConfig.business.address}
                    </div>
                    <div className="text-[11px] text-slate-400">United Arab Emirates</div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-navy-900">Working Hours</div>
                    <div className="text-xs text-slate-600">{siteConfig.business.workingHours}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Lazy-Loaded Google Maps Embed */}
            <Reveal delay={0.1} y={20}>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-100">
                  <iframe
                    src={siteConfig.contact.googleMapsEmbedUrl}
                    title="Grace Way Accounting Office Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <div className="pt-2 px-2 pb-1 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Serving businesses across Dubai, Sharjah, Abu Dhabi & all UAE Emirates</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15} y={20}>
              <EnquiryForm />
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
}
