import React, { useEffect } from 'react';
import {
  Home,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Calculator,
  FileText,
  TrendingUp,
  Phone,
  Mail,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { GWEmblem } from '../assets/logo/GWEmblem';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export default function NotFound() {
  // Set descriptive title on mount
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '404 - Page Not Found | Grace Way Accounting FZC LLC';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const coreServices = [
    {
      title: 'Accounting & Bookkeeping',
      desc: 'IFRS-compliant ledgers, monthly reports, and cloud software setup.',
      icon: Calculator,
      href: '/#services',
    },
    {
      title: 'UAE Corporate Tax & VAT',
      desc: 'FTA registration, tax return filings, and strategic tax planning.',
      icon: FileText,
      href: '/#services',
    },
    {
      title: 'Audit & Assurance',
      desc: 'Independent statutory audits, compliance reviews, and financial assurance.',
      icon: ShieldCheck,
      href: '/#services',
    },
    {
      title: 'AML & Compliance',
      desc: 'goAML reporting, statutory filings, ESR, and AML risk assessments.',
      icon: TrendingUp,
      href: '/#services',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans flex flex-col antialiased selection:bg-gold-500 selection:text-navy-950 relative overflow-hidden">
      {/* Ambient background glow elements */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden z-0"
      >
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl opacity-70" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            aria-label="Grace Way - Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B1B4D] border border-blue-400/25 flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <GWEmblem className="w-full h-full" />
            </div>
            <span className="font-heading font-extrabold text-[#0B1B4D] text-lg leading-tight tracking-tight">
              Grace Way
            </span>
          </a>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={siteConfig.business.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/70 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Advisory</span>
            </a>

            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-[#0B1B4D] bg-slate-100/80 hover:bg-slate-200/70 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Homepage</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main 404 Hero Section */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-semibold tracking-wide shadow-2xs mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>HTTP 404 • Page Not Found</span>
        </div>

        {/* Sculptural 404 Number */}
        <div className="relative select-none my-1">
          <span className="font-heading font-black text-7xl sm:text-8xl md:text-9xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0B1B4D] via-[#1E3A8A] to-[#D4AF37]">
            404
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#0B1B4D] tracking-tight max-w-xl mt-2 mb-3">
          This Page Doesn't Balance Out
        </h1>

        {/* Reassuring copy */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mb-8">
          The requested address is unavailable, was relocated, or may have been typed incorrectly.
          Our UAE advisory team is ready to help guide you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md mb-12">
          {/* Primary: Return Home */}
          <a
            href="/"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-[#0B1B4D] hover:bg-blue-900 active:scale-[0.99] transition-all shadow-md shadow-blue-950/10 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </a>

          {/* Secondary: Book Consultation */}
          <a
            href="/#contact"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#0B1B4D] bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>

          {/* WhatsApp Direct */}
          <a
            href={siteConfig.business.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Quick Service Links Section */}
        <div className="w-full pt-8 border-t border-slate-200/70 text-left">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Explore Our Core UAE Practice Areas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {coreServices.map((svc) => {
              const IconComp = svc.icon;
              return (
                <a
                  key={svc.title}
                  href={svc.href}
                  className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B1B4D] group-hover:bg-[#0B1B4D] group-hover:text-white transition-colors flex items-center justify-center mb-3">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h2 className="font-heading font-bold text-sm text-[#0B1B4D] tracking-tight mb-1 group-hover:text-blue-700 transition-colors">
                      {svc.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                    <span>View Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Direct Help Strip */}
        <div className="w-full mt-8 p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <span>
              Need immediate assistance? Our certified UAE accountants are available Monday to Friday.
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${siteConfig.business.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0B1B4D] hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{siteConfig.business.phoneDisplay}</span>
            </a>
            <span className="text-slate-300">•</span>
            <a
              href={siteConfig.business.emailMailto}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0B1B4D] hover:underline"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200/70 bg-white/70 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {siteConfig.business.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-slate-700 transition-colors">
              Home
            </a>
            <a href="/#about" className="hover:text-slate-700 transition-colors">
              About
            </a>
            <a href="/#services" className="hover:text-slate-700 transition-colors">
              Services
            </a>
            <a href="/#contact" className="hover:text-slate-700 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
