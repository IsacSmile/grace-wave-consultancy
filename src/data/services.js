// PLACEHOLDER: replace images with real photos before launch.
import accountingImg from '../assets/services/accounting.webp';
import taxationImg from '../assets/services/taxation.webp';
import consultancyImg from '../assets/services/consultancy.webp';

export const servicesData = [
  {
    id: 'accounting-bookkeeping',
    index: '01',
    title: 'Accounting & Bookkeeping',
    short: 'End-to-end management of financial records, ledger reconciliations, and structured account preparation in compliance with IFRS.',
    description: 'Accurate books are the foundation of smart business decisions. We handle your day-to-day accounts with precision.',
    bullets: [
      'Daily record keeping',
      'Financial statements (IFRS)',
      'Ledger reconciliation and monthly closing',
    ],
    icon: 'BookOpenCheck',
    image: accountingImg,
    imageAlt: 'Accounting professional reviewing financial ledger spreadsheets and IFRS financial statements',
    serviceValue: 'Accounting & Bookkeeping',
  },
  {
    id: 'taxation-compliance',
    index: '02',
    title: 'Taxation & Compliance',
    short: 'Proactive UAE Corporate Tax advisory, statutory VAT return filing, and complete regulatory alignment with FTA guidelines.',
    description: 'Stay compliant with UAE tax rules while avoiding penalties and missed deadlines.',
    bullets: [
      'Corporate Tax advisory',
      'VAT registration and filing',
      'Regulatory compliance support',
    ],
    icon: 'ShieldAlert',
    image: taxationImg,
    imageAlt: 'Tax advisor analyzing UAE Corporate Tax documentation and statutory compliance requirements',
    serviceValue: 'Taxation & Compliance',
  },
  {
    id: 'business-consultancy',
    index: '03',
    title: 'Business Consultancy',
    short: 'Strategic financial planning, performance analysis, cash-flow projections, and management reporting for informed leadership decisions.',
    description: 'Clear financial insight and planning to help your business grow with confidence.',
    bullets: [
      'Financial planning and forecasting',
      'Business advisory and profitability',
      'Management reporting and analysis',
    ],
    icon: 'TrendingUp',
    image: consultancyImg,
    imageAlt: 'Business consultants and corporate leadership reviewing financial growth roadmap and strategy',
    serviceValue: 'Business Consultancy',
  },
];
