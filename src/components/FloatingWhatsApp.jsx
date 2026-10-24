import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export function FloatingWhatsApp() {
  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={siteConfig.business.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label="Chat with Grace Way Accounting on WhatsApp"
      >
        {/* Subtle breathing radar ring */}
        <span
          className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping -z-10"
          aria-hidden="true"
        />

        <MessageCircle className="w-7 h-7" />

        {/* Hover / screen-reader tooltip */}
        <span className="hidden sm:block absolute right-full mr-3.5 px-3 py-1.5 rounded-lg bg-navy-950 text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-navy-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with an Accountant
        </span>
      </a>
    </aside>
  );
}
