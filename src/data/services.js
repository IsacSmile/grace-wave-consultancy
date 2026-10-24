// PLACEHOLDER: replace images with real photos before launch.
import accountingImg from '../assets/services/accounting.webp';
import taxationImg from '../assets/services/taxation.webp';
import auditAdvisoryImg from '../assets/services/audit-advisory.webp';

export const servicesData = [
  {
    id: 'accounting-bookkeeping',
    index: '01',
    title: 'Accounting & Bookkeeping',
    short: 'Accounting, bookkeeping, software and e-invoicing.',
    description: 'Accurate books are the foundation of smart business decisions. We handle your day-to-day accounts with precision.',
    bullets: [
      'Accounting and bookkeeping',
      'Accounting software solutions',
      'E-invoicing',
    ],
    icon: 'BookOpenCheck',
    image: accountingImg,
    imageAlt: 'Accounting professional reviewing bookkeeping records, software solutions, and e-invoicing',
    serviceValue: 'Accounting & Bookkeeping',
  },
  {
    id: 'taxation-compliance',
    index: '02',
    title: 'Taxation & Compliance',
    short: 'Corporate Tax, VAT and AML compliance.',
    description: 'Stay compliant with UAE tax and regulatory requirements while avoiding penalties and missed deadlines.',
    bullets: [
      'Corporate Tax',
      'VAT',
      'AML compliance',
    ],
    icon: 'ShieldCheck',
    image: taxationImg,
    imageAlt: 'Tax advisor managing UAE Corporate Tax, VAT returns, and AML compliance',
    serviceValue: 'Taxation & Compliance',
  },
  {
    id: 'audit-advisory',
    index: '03',
    title: 'Audit & Advisory',
    short: 'Auditing, financial support and advisory.',
    description: 'Independent audit and clear financial guidance to help your business grow with confidence.',
    bullets: [
      'Auditing',
      'Financial support',
      'Business advisory',
    ],
    icon: 'TrendingUp',
    image: auditAdvisoryImg,
    imageAlt: 'Financial advisor and auditor reviewing corporate auditing and advisory reports',
    serviceValue: 'Audit & Advisory',
  },
];
