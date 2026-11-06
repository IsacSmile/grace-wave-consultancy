import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../data/siteConfig';

export function FloatingWhatsApp() {
  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={siteConfig.business.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
        aria-label="Chat with Grace Way Accounting on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />

        {/* Hover / screen-reader tooltip */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-md bg-[#0A1F4D] text-white text-xs font-medium whitespace-nowrap shadow-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with an Accountant
        </span>
      </a>
    </aside>
  );
}
