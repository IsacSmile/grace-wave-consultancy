import React from 'react';
import { CursorProvider } from './context/CursorContext';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { About } from './components/About';
import { Services } from './components/Services';
import { Marquee } from './components/Marquee';
import { ServiceTabs } from './components/ServiceTabs';
import { WhyGraceWay } from './components/WhyGraceWay';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  return (
    <CursorProvider>
      <SmoothScroll>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-gold-500 selection:text-navy-950 overflow-x-hidden">
          {/* Custom Animated Cursor (mounted once, outside all sections) */}
          <CustomCursor />

          {/* Sticky Accessible Navigation */}
          <Navbar />

          {/* Main Content Sections */}
          <main id="main-content" className="flex-1">
            <Hero />
            <StatsStrip />
            <About />
            <Services />
            <Marquee />
            <ServiceTabs />
            <WhyGraceWay />
            <Process />
            <Testimonials />
            <Contact />
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating Quick WhatsApp Action */}
          <FloatingWhatsApp />
        </div>
      </SmoothScroll>
    </CursorProvider>
  );
}
