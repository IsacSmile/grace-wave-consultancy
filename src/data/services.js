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
    description: 'Maintaining accurate books is not just a statutory necessity under UAE Commercial Companies Law—it is the foundation of smart business decision-making. We take ownership of your day-to-day accounts, reconciling bank transactions, accounts payable, and accounts receivable with exact precision.',
    bullets: [
      'Financial Record Management – Systematic recording of daily invoices, bills, expenses, and asset registers.',
      'Account Preparation – Preparation of complete Balance Sheets, Profit & Loss Statements, and Cash Flow summaries compliant with IFRS.',
      'Bookkeeping Support & Clean-up – Regular ledger reconciliations, historical accounts clean-up, and continuous monthly closing.',
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
    description: 'With the introduction of UAE Corporate Tax (Federal Decree-Law No. 47) and VAT regulations, non-compliance carries severe administrative penalties. We provide clear, structured guidance to ensure your registrations, tax calculations, and periodic filings are executed accurately and on schedule.',
    bullets: [
      'UAE Corporate Tax Strategy – Review of taxable income thresholds, QFZP conditions, and expense deductibility.',
      'VAT Return Filing – Preparation and submission of periodic VAT returns via the FTA EmaraTax portal.',
      'Statutory Compliance – Corporate Tax registration, ESR awareness, and compliance audit trail preparation.',
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
    description: 'Sound accounting is most powerful when translated into actionable strategic direction. Our business advisory team works alongside leadership to interpret financial metrics, forecast liquidity, assess cost-saving opportunities, and support capital allocation.',
    bullets: [
      'Financial Planning & Budgets – Operational budgets, variance analysis, scenario modeling, and working capital forecasting.',
      'Business Advisory – Diagnostic review of operating margins, overhead distribution, and profitability optimization.',
      'Executive Reporting – Customized Management Information Systems (MIS) dashboards and investor reporting packs.',
    ],
    icon: 'TrendingUp',
    image: consultancyImg,
    imageAlt: 'Business consultants and corporate leadership reviewing financial growth roadmap and strategy',
    serviceValue: 'Business Consultancy',
  },
];
