import React from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { About } from './components/About';
import { Services } from './components/Services';
import { Marquee } from './components/Marquee';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-gold-500 selection:text-navy-950 overflow-x-hidden">
        {/* Sticky Accessible Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main id="main-content" className="flex-1">
          <Hero />
          <StatsStrip />
          <About />
          <Services />
          <Marquee />
          <WhyChooseUs />
          <Process />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Quick WhatsApp Action */}
        <FloatingWhatsApp />
      </div>
    </SmoothScroll>
  );
}
