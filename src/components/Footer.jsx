import React from 'react';
import { ArrowUp, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { useLenis } from './SmoothScroll';

export function Footer() {
  const { scrollTo } = useLenis();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    scrollTo(href, 76);
  };

  const handleScrollTop = (e) => {
    e.preventDefault();
    scrollTo(0, 0);
  };

  return (
    <footer className="bg-navy-950 text-slate-400 text-xs sm:text-sm border-t border-navy-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-navy-800">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-gold-500/40 flex items-center justify-center">
                <span className="font-heading font-extrabold text-gold-400 text-lg">GW</span>
              </div>
              <div>
                <span className="font-heading font-bold text-white text-base sm:text-lg block leading-tight">
                  {siteConfig.business.name}
                </span>
                <span className="text-xs text-gold-400/90 font-medium">
                  {siteConfig.business.statusNote}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {siteConfig.footer.tagline}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Shield className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Full compliance with UAE Federal Decree-Law on Corporate Tax & VAT</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="hover:text-gold-400 transition-colors inline-block py-1 min-h-[36px]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider">
              UAE Office & Enquiries
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{siteConfig.business.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={siteConfig.business.phoneTel}
                  className="hover:text-gold-400 transition-colors"
                >
                  {siteConfig.business.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={siteConfig.business.emailMailto}
                  className="hover:text-gold-400 transition-colors break-all"
                >
                  {siteConfig.business.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollTop}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-xs text-slate-300 hover:text-white border border-navy-700 transition-colors min-h-[44px]"
                aria-label="Scroll back to top"
              >
                <ArrowUp className="w-3.5 h-3.5 text-gold-400" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer & Legal Notice */}
        <div className="pt-8 space-y-4">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-4xl">
            {siteConfig.footer.disclaimer}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-navy-900">
            <div>
              © {siteConfig.footer.copyrightYear} {siteConfig.business.name}. All rights reserved.
            </div>
            <div>
              UAE Commercial & Tax Advisory Services
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
