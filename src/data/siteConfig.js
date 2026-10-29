import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { SERVICE_OPTIONS } from './serviceOptions.js';

/**
 * Grace Way Accounting FZC LLC - Central Site Configuration
 * 
 * Edit this file to update business details, contact information,
 * copy text, service offerings, or process steps.
 */

const showTestimonials = true;

export const siteConfig = {
  showTestimonials, // set to false to hide the whole section
  business: {
    name: "Grace Way Accounting FZC LLC",
    legalName: "Grace Way Accounting FZC LLC",
    shortName: "Grace Way Accounting",
    country: "United Arab Emirates",
    jurisdiction: "UAE Free Zone & Mainland",
    phones: [
      { label: "Primary", display: "+971 56 914 8255", tel: "+971569148255" },
      { label: "Secondary", display: "+971 50 595 7886", tel: "+971505957886" },
    ],
    phone: "+971569148255",
    phoneDisplay: "+971 56 914 8255",
    phoneTel: "tel:+971569148255",
    phoneSecondary: "+971505957886",
    phoneSecondaryDisplay: "+971 50 595 7886",
    phoneSecondaryTel: "tel:+971505957886",
    whatsapp: "https://wa.me/971569148255",
    whatsappUrl: "https://wa.me/971569148255",
    email: "info@gracewayaccounting.com", // PLACEHOLDER: client to provide
    emailMailto: "mailto:info@gracewayaccounting.com?subject=Service%20Enquiry%20-%20Grace%20Way%20Accounting",
    address: "BC-894183, 26th Floor, Amber Gem Tower, Ajman, United Arab Emirates",
    footerAddress: "BC-894183, 26th Floor, Amber Gem Tower, Ajman, United Arab Emirates",
    workingHours: "Monday – Friday, 09:00 AM – 06:00 PM (GST)", // PLACEHOLDER: client to provide
    statusNote: "Accounting, Auditing, Tax & Advisory Services (UAE)",
  },

  navigation: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Grace Way", href: "#why" },
    { label: "Process", href: "#process" },
    ...(showTestimonials ? [{ label: "Reviews", href: "#testimonials" }] : []),
  ],

  hero: {
    badge: "Trusted Accounting & Tax Advisors",
    headlineLine1: "Smart Accounting.",
    headlineLine2: "Stress-Free Compliance.",
    description: "Grace Way Accounting delivers accounting, auditing, taxation, compliance and financial advisory services for UAE businesses.",
    primaryCta: {
      text: "Get a Free Enquiry",
      href: "#contact",
    },
    secondaryCta: {
      text: "Chat on WhatsApp",
      href: "https://wa.me/971569148255",
    },
    trustRow: [
      { id: "accounting", label: "Accounting", desc: "Books and software" },
      { id: "tax-filing", label: "Tax and VAT", desc: "Corporate Tax, VAT" },
      { id: "compliance", label: "Audit and AML", desc: "Audit, compliance" },
      { id: "advisory", label: "Advisory", desc: "Financial support" },
    ],
  },

  about: {
    sectionBadge: "Who We Are",
    title: "Your Trusted Accounting & Business Advisory Partner in the UAE",
    lead: "With over 25 years of UAE market experience, Grace Way Accounting helps businesses stay compliant, financially efficient, and growth-focused.",
    story: "Headquartered in the UAE, our consultancy brings over 25 years of market experience delivering comprehensive accounting, auditing, taxation, compliance, and financial advisory services. Our team of experienced professionals combines industry expertise with innovative solutions to ensure your organization remains compliant, financially efficient, and growth-focused.",
    mission: {
      title: "Our Mission",
      description: "To empower UAE businesses through accurate, transparent accounting, proactive tax compliance, and strategic financial advisory.",
    },
    vision: {
      title: "Our Vision",
      description: "To be recognized as a dependable and client-centric accounting consultancy firm in the region, known for precision, ethical integrity, and value creation.",
    },
    values: [
      {
        title: "Integrity & Discretion",
        description: "Unwavering commitment to client confidentiality and fiduciary responsibility across all financial records.",
      },
      {
        title: "Regulatory Precision",
        description: "Rigorous adherence to UAE Corporate Tax, VAT regulations, and statutory compliance requirements.",
      },
      {
        title: "Proactive Partnership",
        description: "We don't just balance ledgers; we anticipate filing deadlines and optimize financial workflows.",
      },
      {
        title: "Transparent Collaboration",
        description: "Direct access to experienced professionals with zero hidden costs and clearly defined deliverables.",
      },
    ],
    stats: [
      {
        value: 25,
        suffix: "+",
        label: "Years of Experience",
        subtext: "In the UAE market",
      },
      {
        value: 9,
        suffix: "",
        label: "Core Services",
        subtext: "Comprehensive solutions",
      },
      {
        value: 100,
        suffix: "%",
        label: "Data Confidentiality",
        subtext: "Secure handling of client ledgers",
      },
      {
        value: 24,
        suffix: "h",
        label: "Enquiry Response Time",
        subtext: "Prompt consultation scheduling",
      },
    ],
  },

  services: {
    sectionBadge: "Our Core Services",
    title: "Comprehensive Accounting & Financial Solutions",
    subtitle: "Accounting, auditing, tax, compliance and advisory support for UAE businesses.",
    ctaBanner: {
      title: "Need custom financial assistance for your enterprise?",
      subtitle: "Speak directly with our consultancy team to structure a tailored plan.",
      buttonText: "Request Service Consultation",
      href: "#contact",
    },
    list: [
      {
        id: "accounting-bookkeeping",
        anchorId: "accounting-bookkeeping-detail",
        title: "Accounting & Bookkeeping",
        shortDesc: "Accounting, bookkeeping, software and e-invoicing.",
        icon: "BookOpenCheck",
        features: [
          "Accounting and bookkeeping",
          "Accounting software solutions",
          "E-invoicing",
        ],
        details: {
          tagline: "Structured, audit-ready financial tracking for business clarity",
          overview: "Accurate books are the foundation of smart business decisions. We handle your day-to-day accounts with precision, maintaining complete financial records and supporting cloud accounting systems.",
          deliverables: [
            {
              heading: "Accounting and Bookkeeping",
              text: "Systematic recording of daily invoices, bills, expenses, and ledger reconciliations.",
            },
            {
              heading: "Accounting Software Solutions",
              text: "Setup, integration, and structured workflows for modern accounting software.",
            },
            {
              heading: "E-Invoicing",
              text: "Compliant digital invoicing structured to meet evolving UAE commercial standards.",
            },
          ],
          idealFor: "SMEs, free zone entities, mainland trading companies, and professional service firms seeking reliable books.",
        },
      },
      {
        id: "taxation-compliance",
        anchorId: "taxation-compliance-detail",
        title: "Taxation & Compliance",
        shortDesc: "Corporate Tax, VAT and AML compliance.",
        icon: "ShieldCheck",
        features: [
          "Corporate Tax",
          "VAT",
          "AML compliance",
        ],
        details: {
          tagline: "Total peace of mind with UAE tax legislation",
          overview: "Stay compliant with UAE tax and regulatory requirements while avoiding penalties and missed deadlines. We provide structured support for Corporate Tax, VAT, and anti-money laundering compliance.",
          deliverables: [
            {
              heading: "Corporate Tax",
              text: "Advisory, registration, threshold reviews, and structured tax return filing support.",
            },
            {
              heading: "VAT Services",
              text: "Periodic VAT registration, return preparation, and ongoing compliance assistance.",
            },
            {
              heading: "AML Compliance",
              text: "Anti-Money Laundering regulatory alignment, KYC verification workflows, and compliance checks.",
            },
          ],
          idealFor: "Businesses navigating UAE Corporate Tax obligations, taxable businesses requiring VAT filings, and corporate entities.",
        },
      },
      {
        id: "audit-advisory",
        anchorId: "audit-advisory-detail",
        title: "Audit & Advisory",
        shortDesc: "Auditing, financial support and advisory.",
        icon: "TrendingUp",
        features: [
          "Auditing",
          "Financial support",
          "Business advisory",
        ],
        details: {
          tagline: "Independent audit and strategic guidance for business clarity",
          overview: "Independent audit and clear financial guidance to help your business grow with confidence. Our team works alongside leadership to interpret financial metrics, forecast liquidity, and optimize profitability.",
          deliverables: [
            {
              heading: "Auditing",
              text: "Independent financial statement reviews, internal audit diligence, and statutory audit readiness.",
            },
            {
              heading: "Financial Support",
              text: "Day-to-day controller support, financial analysis, and cash flow oversight.",
            },
            {
              heading: "Business Advisory",
              text: "Strategic planning, profitability analysis, and structured financial consulting.",
            },
          ],
          idealFor: "Growing enterprises, startups establishing UAE operations, and executives seeking data-driven financial clarity.",
        },
      },
    ],
  },

  whyChooseUs: {
    sectionBadge: "Why Grace Way",
    title: "Built on Reliability, Precision, and Local Insight",
    subtitle: "We stand as a dependable extension of your organization, ensuring financial diligence at every step.",
    pillars: [
      {
        title: "Over 25 Years UAE Experience",
        description: "Deep UAE market expertise helping businesses stay compliant, financially efficient, and growth-focused.",
        icon: "FileCheck",
      },
      {
        title: "Transparent & Cost-Effective",
        description: "Zero ambiguous billing. Clear engagement scopes tailored to the exact size and transaction volume of your business.",
        icon: "BadgeDollarSign",
      },
      {
        title: "Prompt & Personalized Attention",
        description: "Direct communication with experienced professionals who understand your business model.",
        icon: "Clock",
      },
      {
        title: "Enterprise Data Confidentiality",
        description: "Strict fiduciary care and digital safeguards protecting your financial records and corporate strategies.",
        icon: "Lock",
      },
    ],
  },

  process: {
    sectionBadge: "How We Work",
    title: "Our Streamlined 4-Step Engagement Process",
    subtitle: "Getting started with Grace Way Accounting is smooth, clear, and focused on immediate value.",
    steps: [
      {
        step: "01",
        title: "Enquiry",
        subtitle: "Initial Contact",
        description: "Submit our short online enquiry form or connect via WhatsApp with your company profile and immediate service requirements.",
        icon: "MessageSquare",
      },
      {
        step: "02",
        title: "Consultation",
        subtitle: "Needs Discovery",
        description: "We conduct a confidential exploratory discussion to examine your transaction volumes, accounting status, and requirements.",
        icon: "PhoneCall",
      },
      {
        step: "03",
        title: "Proposal",
        subtitle: "Clear Scope & Quotation",
        description: "You receive a transparent, itemized engagement proposal defining deliverables, schedule, and fees.",
        icon: "FileText",
      },
      {
        step: "04",
        title: "Onboarding",
        subtitle: "Active Stewardship",
        description: "Secure document onboarding, ledger setup, and assigning your designated accounting team to manage your accounts seamlessly.",
        icon: "CheckCircle2",
      },
    ],
  },

  contact: {
    sectionBadge: "Get In Touch",
    heading: "Turning Challenges into Opportunities",
    subtitle: "Have a question about UAE Corporate Tax, VAT, or bookkeeping? Send us an enquiry and our team will respond promptly.",
    cardTitle: "Let's Talk – Free Consultation",
    cardIntro: "Book your free session with our team and discover solutions crafted for your business.",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Amber+Gem+Tower,+Ajman,+United+Arab+Emirates&t=&z=15&ie=UTF8&iwloc=&output=embed",
    formServices: SERVICE_OPTIONS,
  },

  // Social profiles (LinkedIn, Instagram, X/Twitter, WhatsApp)
  socials: [
    { id: "whatsapp",  label: "WhatsApp",  url: "https://wa.me/971569148255", icon: faWhatsapp },
    { id: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com", icon: faLinkedinIn },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com", icon: faInstagram },
    { id: "x",         label: "Twitter (X)", url: "https://x.com", icon: faXTwitter },
    { id: "facebook",  label: "Facebook",  url: "", icon: faFacebookF },
    { id: "youtube",   label: "YouTube",   url: "", icon: faYoutube },
  ],
};
