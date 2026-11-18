// Default website content for all editable sections
// Grace Way Accounting FZC LLC

import { siteConfig } from './siteConfig';
import { statsData } from './stats';
import { servicesData } from './services';
import { serviceTabsData } from './serviceTabs';
import { processSteps } from './process';
import { testimonials } from './testimonials';

export const defaultSiteContent = {
  hero: {
    badge: siteConfig.hero.badge || "Trusted Accounting & Tax Advisors",
    headlineLine1: siteConfig.hero.headlineLine1 || "Smart Accounting.",
    headlineLine2: siteConfig.hero.headlineLine2 || "Stress-Free Compliance.",
    description: siteConfig.hero.description || "Grace Way Accounting delivers accounting, auditing, taxation, compliance and financial advisory services for UAE businesses.",
    primaryCtaText: siteConfig.hero.primaryCta?.text || "Get a Free Enquiry",
    primaryCtaHref: siteConfig.hero.primaryCta?.href || "#contact",
    secondaryCtaText: siteConfig.hero.secondaryCta?.text || "Chat on WhatsApp",
    secondaryCtaHref: siteConfig.hero.secondaryCta?.href || "https://wa.me/971569148255",
    trustRow: [
      { id: "accounting", label: "Accounting", desc: "Books and software" },
      { id: "tax-filing", label: "Tax and VAT", desc: "Corporate Tax, VAT" },
      { id: "compliance", label: "Audit and AML", desc: "Audit, compliance" },
      { id: "advisory", label: "Advisory", desc: "Financial support" },
    ],
    customImage: "", // Empty string means use default responsive advisor assets
  },

  stats: statsData.map((s) => ({
    id: s.id,
    value: s.value,
    suffix: s.suffix || "",
    label: s.label,
    icon: s.icon,
  })),

  coreServices: {
    badge: siteConfig.services?.sectionBadge || "Our Core Services",
    title: siteConfig.services?.title || "Comprehensive Accounting & Financial Solutions",
    subtitle: siteConfig.services?.subtitle || "Accounting, auditing, tax, compliance and advisory support for UAE businesses.",
    ctaBannerTitle: siteConfig.services?.ctaBanner?.title || "Need custom financial assistance for your enterprise?",
    ctaBannerSubtitle: siteConfig.services?.ctaBanner?.subtitle || "Speak directly with our consultancy team to structure a tailored plan.",
    ctaBannerButtonText: siteConfig.services?.ctaBanner?.buttonText || "Request Service Consultation",
    items: servicesData.map((svc) => ({
      id: svc.id,
      index: svc.index,
      title: svc.title,
      short: svc.short,
      description: svc.description,
      bullets: svc.bullets ? [...svc.bullets] : [],
      icon: svc.icon,
      customImage: "", // Empty string means use default image asset
    })),
  },

  serviceTabs: {
    badge: "WHAT WE DELIVER",
    title: "Accounting, tax and advisory support, in detail",
    subtitle: "Choose a service to see what is included.",
    tabs: serviceTabsData.map((tab) => ({
      id: tab.id,
      tabLabel: tab.tabLabel,
      serviceValue: tab.serviceValue,
      intro: tab.intro,
      items: tab.items ? tab.items.map((it) => ({ title: it.title, text: it.text })) : [],
      bullets: tab.bullets ? [...tab.bullets] : [],
      features: tab.features ? tab.features.map((f) => ({ title: f.title, text: f.text, icon: f.icon })) : [],
      buttonText: `Enquire about ${tab.tabLabel}`,
      customImage: "", // Empty string means use default service asset
      badgeText: "UAE EXPERIENCE",
      badgeValue: 25,
      badgeSuffix: "+",
      badgeSubtext: "Years of UAE market experience",
    })),
  },

  process: {
    badge: "HOW WE WORK",
    steps: processSteps.map((step) => ({
      id: step.id,
      number: step.number,
      title: step.title,
      text: step.text,
      points: step.points ? [...step.points] : [],
      youProvide: step.youProvide ? [...step.youProvide] : [],
    })),
  },

  testimonials: {
    badge: "CLIENT FEEDBACK",
    title: "What our clients say",
    items: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      quote: t.quote,
      rating: t.rating || 5,
      customImage: "", // Empty string means use default testimonial photo
    })),
  },

  contact: {
    badge: siteConfig.contact?.sectionBadge || "Get In Touch",
    heading: siteConfig.contact?.heading || "Turning Challenges into Opportunities",
    narrative: "Make the decision to move forward. Commit your vision to clarity, and let our senior accounting consultants bring structure and compliance to your business.",
    address: siteConfig.business?.address || "BC-894183, 26th Floor, Amber Gem Tower, Ajman, United Arab Emirates",
    phonePrimary: siteConfig.business?.phoneDisplay || "+971 56 914 8255",
    phonePrimaryTel: siteConfig.business?.phoneTel || "tel:+971569148255",
    phoneSecondary: siteConfig.business?.phoneSecondaryDisplay || "+971 50 595 7886",
    phoneSecondaryTel: siteConfig.business?.phoneSecondaryTel || "tel:+971505957886",
    email: siteConfig.business?.email || "info@gracewayaccounting.com",
    trustBadgeCount: "Trusted by 500+",
    trustBadgeText: "Businesses across the UAE",
    formBadge: "DIRECT ENQUIRY",
    formTitle: "Consult With Our Senior Advisors",
    formSubtitle: "Please provide your details below, and our team will get back to you promptly.",
    formButtonText: "Send Message",
  },

  footer: {
    customLogo: "", // Empty string means use default GWA logo
    tagline: "Accounting, auditing, tax, compliance and advisory support for UAE businesses.",
    whatsappUrl: siteConfig.business?.whatsapp || "https://wa.me/971569148255",
    linkedinUrl: "https://www.linkedin.com",
    instagramUrl: "https://www.instagram.com",
    xUrl: "https://x.com",
    copyright: "© 2026 Grace Way Accounting FZC LLC. All rights reserved.",
  },
};

