/**
 * Grace Way Accounting FZC LLC - Central Site Configuration
 * 
 * Edit this file to update business details, contact information,
 * copy text, service offerings, or process steps.
 */

export const siteConfig = {
  // PLACEHOLDER: replace email, hours and address with real details before launch.
  business: {
    name: "Grace Way Accounting FZC LLC",
    legalName: "Grace Way Accounting FZC LLC",
    shortName: "Grace Way Accounting",
    country: "United Arab Emirates",
    jurisdiction: "UAE Free Zone & Mainland Compliance",
    phone: "+971569148255",
    phoneDisplay: "+971 56 914 8255",
    phoneTel: "tel:+971569148255",
    phoneSecondary: "+971505957886",
    phoneSecondaryDisplay: "+971 50 595 7886",
    phoneSecondaryTel: "tel:+971505957886",
    whatsappUrl: "https://wa.me/971569148255?text=Hello%20Grace%20Way%20Accounting,%20I%20would%20like%20to%20enquire%20about%20your%20services.",
    email: "info@gracewayaccounting.com", // Placeholder: client can edit
    emailMailto: "mailto:info@gracewayaccounting.com?subject=Service%20Enquiry%20-%20Grace%20Way%20Accounting",
    address: "Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates", // Placeholder: client can edit
    workingHours: "Mon–Friday, 09:00 AM – 06:00 PM (GST)",
    statusNote: "Licensed Accounting & Business Advisory Consultancy (UAE)",
  },

  navigation: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-choose-us" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    badge: "Trusted Accounting & Tax Advisors",
    headlineLine1: "Smart Accounting.",
    headlineLine2: "Stress-Free Compliance.",
    description: "Grace Way Accounting FZC LLC delivers dependable bookkeeping, UAE corporate tax advisory, and statutory compliance designed to keep your business agile and financially sound.",
    primaryCta: {
      text: "Get a Free Enquiry",
      href: "#contact",
    },
    secondaryCta: {
      text: "Chat on WhatsApp",
      href: "https://wa.me/971569148255?text=Hello%20Grace%20Way%20Accounting,%20I%20would%20like%20to%20enquire%20about%20your%20services.",
    },
    trustRow: [
      { id: "accounting", label: "Accounting", desc: "IFRS Bookkeeping" },
      { id: "tax-filing", label: "Tax Filing", desc: "Corporate Tax & VAT" },
      { id: "compliance", label: "Compliance", desc: "FTA Aligned" },
      { id: "advisory", label: "Advisory", desc: "Financial Planning" },
    ],
  },

  about: {
    sectionBadge: "Who We Are",
    title: "Your Trusted Accounting & Business Advisory Partner in the UAE",
    lead: "At Grace Way Accounting FZC LLC, we simplify financial complexities so entrepreneurs, SMEs, and corporate entities can focus on sustainable growth.",
    story: "Headquartered in the UAE, our consultancy brings deep understanding of the evolving Federal Tax Authority (FTA) regulatory landscape, including UAE Corporate Tax laws, VAT implementation, and international accounting standards (IFRS). We combine hands-on bookkeeping rigor with high-level financial strategy to safeguard your bottom line.",
    mission: {
      title: "Our Mission",
      description: "To empower UAE businesses through accurate, transparent accounting, proactive tax stewardship, and strategic consultancy that ensures absolute regulatory compliance.",
    },
    vision: {
      title: "Our Vision",
      description: "To be recognized as the most dependable and client-centric accounting consultancy firm in the region, known for precision, ethical integrity, and value creation.",
    },
    values: [
      {
        title: "Integrity & Discretion",
        description: "Unwavering commitment to client confidentiality and fiduciary responsibility across all financial records.",
      },
      {
        title: "Regulatory Precision",
        description: "Rigorous adherence to UAE Corporate Tax, VAT regulations, and Ministry of Economy statutory requirements.",
      },
      {
        title: "Proactive Partnership",
        description: "We don't just balance ledgers; we anticipate tax filing deadlines and optimize financial workflows.",
      },
      {
        title: "Transparent Collaboration",
        description: "Direct access to accounting professionals with zero hidden costs and clearly defined deliverables.",
      },
    ],
    stats: [
      {
        value: 100,
        suffix: "%",
        label: "FTA Compliance Focus",
        subtext: "Aligned with current UAE tax laws",
      },
      {
        value: 24,
        suffix: "h",
        label: "Enquiry Response Time",
        subtext: "Prompt consultation scheduling",
      },
      {
        value: 100,
        suffix: "%",
        label: "Data Confidentiality",
        subtext: "Secure handling of client ledgers",
      },
      {
        value: 360,
        suffix: "°",
        label: "Financial Oversight",
        subtext: "From source documents to tax filings",
      },
    ],
  },

  services: {
    sectionBadge: "Our Core Services",
    title: "Comprehensive Accounting & Financial Solutions",
    subtitle: "Tailored to meet the strict statutory demands and strategic growth requirements of UAE businesses.",
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
        shortDesc: "End-to-end management of financial records, ledger reconciliations, and structured account preparation in compliance with IFRS.",
        icon: "BookOpenCheck",
        features: [
          "Financial Record Management",
          "Account Preparation & Financial Statements",
          "Bookkeeping Support & Ledger Reconciliations",
        ],
        details: {
          tagline: "Structured, audit-ready financial tracking for business clarity",
          overview: "Maintaining accurate books is not just a statutory necessity under UAE Commercial Companies Law—it is the foundation of smart business decision-making. We take ownership of your day-to-day accounts, reconciling bank transactions, accounts payable, and accounts receivable with exact precision.",
          deliverables: [
            {
              heading: "Financial Record Management",
              text: "Systematic recording of daily invoices, bills, expenses, and asset registers using modern cloud accounting practices.",
            },
            {
              heading: "Account Preparation",
              text: "Preparation of complete Balance Sheets, Profit & Loss Statements, and Cash Flow summaries compliant with IFRS standards.",
            },
            {
              heading: "Bookkeeping Support & Clean-up",
              text: "Regular ledger reconciliations, historical accounts clean-up, and continuous monthly closing support.",
            },
          ],
          idealFor: "SMEs, free zone entities, mainland trading companies, and professional service firms seeking reliable books.",
        },
      },
      {
        id: "taxation-compliance",
        anchorId: "taxation-compliance-detail",
        title: "Taxation & Compliance",
        shortDesc: "Proactive UAE Corporate Tax advisory, statutory VAT return filing, and complete regulatory alignment with FTA guidelines.",
        icon: "ShieldAlert",
        features: [
          "UAE Corporate Tax Consultancy",
          "VAT Registration & Return Filing Assistance",
          "Statutory Compliance & Regulatory Support",
        ],
        details: {
          tagline: "Total peace of mind with evolving UAE tax legislation",
          overview: "With the introduction of UAE Corporate Tax (Federal Decree-Law No. 47) and VAT regulations, non-compliance carries severe administrative penalties. We provide clear, structured guidance to ensure your registrations, tax calculations, and periodic filings are executed accurately and on schedule.",
          deliverables: [
            {
              heading: "Tax Consultancy & Strategy",
              text: "Review of taxable income thresholds, qualifying free zone person (QFZP) status conditions, and expense deductibility.",
            },
            {
              heading: "Tax Filing Assistance",
              text: "Thorough preparation and submission of periodic VAT returns and annual Corporate Tax returns via the FTA EmaraTax portal.",
            },
            {
              heading: "Statutory Compliance",
              text: "Assistance with Corporate Tax registration, Economic Substance Regulations (ESR) awareness, and compliance audit trail preparation.",
            },
          ],
          idealFor: "Businesses navigating UAE Corporate Tax obligations, taxable businesses requiring VAT filings, and cross-border traders.",
        },
      },
      {
        id: "business-consultancy",
        anchorId: "business-consultancy-detail",
        title: "Business Consultancy",
        shortDesc: "Strategic financial planning, performance analysis, cash-flow projections, and management reporting for informed leadership decisions.",
        icon: "TrendingUp",
        features: [
          "Financial Planning & Forecasting",
          "Business Advisory & Working Capital Guidance",
          "Management Reporting & Financial Analysis",
        ],
        details: {
          tagline: "Strategic financial insight to fuel sustainable expansion",
          overview: "Sound accounting is most powerful when translated into actionable strategic direction. Our business advisory team works alongside leadership to interpret financial metrics, forecast liquidity, assess cost-saving opportunities, and support capital allocation.",
          deliverables: [
            {
              heading: "Financial Planning & Budgets",
              text: "Creation of annual operational budgets, variance analysis, scenario modeling, and working capital forecasting.",
            },
            {
              heading: "Business Advisory",
              text: "Diagnostic review of operating margins, overhead distribution, internal controls, and profitability optimization.",
            },
            {
              heading: "Financial Reporting Support",
              text: "Customized Executive Management Information Systems (MIS) dashboards and investor-ready reporting packs.",
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
        title: "UAE Regulatory Specialization",
        description: "In-depth comprehension of UAE FTA frameworks, commercial company mandates, and Free Zone regulations.",
        icon: "FileCheck",
      },
      {
        title: "Transparent & Cost-Effective",
        description: "Zero ambiguous billing. Clear engagement scopes tailored to the exact size and transaction volume of your business.",
        icon: "BadgeDollarSign",
      },
      {
        title: "Prompt & Personalized Attention",
        description: "Direct communication with seasoned accountants who understand your business model, not ticket dispatch queues.",
        icon: "Clock",
      },
      {
        title: "Enterprise Data Confidentiality",
        description: "Strict fiduciary care and digital safeguards protecting your financial records, payroll, and corporate strategies.",
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
        description: "We conduct a confidential exploratory discussion to examine your transaction volumes, accounting status, and tax deadlines.",
        icon: "PhoneCall",
      },
      {
        step: "03",
        title: "Proposal",
        subtitle: "Clear Scope & Quotation",
        description: "You receive a transparent, itemized engagement proposal defining our deliverables, schedule, and fixed monthly or project fee.",
        icon: "FileText",
      },
      {
        step: "04",
        title: "Onboarding",
        subtitle: "Active Stewardship",
        description: "Secure document ingestion, ledger setup, and assigning your designated accounting team to manage your accounts seamlessly.",
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
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115409.80392341499!2d55.351283628469935!3d25.321684347781077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f082e6d5e1b%3A0x6b7cf4b64e59f400!2sSharjah%20Publishing%20City%20Free%20Zone!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae",
    formServices: [
      { value: "Accounting & Bookkeeping", label: "Accounting & Bookkeeping" },
      { value: "Taxation & Compliance", label: "Taxation & Compliance (Corporate Tax / VAT)" },
      { value: "Business Consultancy", label: "Business Consultancy & Advisory" },
      { value: "Other", label: "Other / General Financial Enquiry" },
    ],
  },

  footer: {
    tagline: "Empowering UAE businesses with dependable accounting, proactive tax stewardship, and strategic consultancy.",
    disclaimer: "Grace Way Accounting FZC LLC is a registered corporate and financial advisory consultancy in the United Arab Emirates. Information provided on this website is for general enquiry purposes and does not constitute formal legal or tax counsel until an official client engagement agreement is executed.",
    copyrightYear: new Date().getFullYear(),
  },
};
