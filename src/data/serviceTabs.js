// PLACEHOLDER: replace images with real photos before launch.
import { servicesData } from './services';

export const serviceTabsData = [
  {
    id: 'accounting-bookkeeping',
    type: 'accordion',
    tabLabel: servicesData[0].title,
    serviceValue: servicesData[0].serviceValue,
    intro: "Organised records and accurate accounts, so you always know where your business stands.",
    items: [
      {
        title: "Financial Record Management",
        text: "Systematic recording of invoices, bills and expenses."
      },
      {
        title: "Account Preparation",
        text: "Clear, complete accounts prepared on time."
      },
      {
        title: "Bookkeeping Support",
        text: "Regular reconciliations and monthly closing."
      }
    ],
    image: servicesData[0].image,
    imageAlt: servicesData[0].imageAlt,
  },
  {
    id: 'taxation-compliance',
    type: 'bullets',
    tabLabel: servicesData[1].title,
    serviceValue: servicesData[1].serviceValue,
    intro: "While tax regulations and corporate rules require careful navigation, they also provide opportunities for structured financial efficiency and compliance. Our team provides practical guidance and accurate filing support so your business remains fully compliant with UAE requirements.",
    bullets: [
      "Tax Consultancy",
      "Corporate Tax Advisory",
      "Tax Filing Assistance",
      "VAT Return Submissions",
      "Statutory Compliance",
      "AML & KYC Diligence",
    ],
    image: servicesData[1].image,
    imageAlt: servicesData[1].imageAlt,
  },
  {
    id: 'audit-advisory',
    type: 'features',
    tabLabel: servicesData[2].title,
    serviceValue: servicesData[2].serviceValue,
    intro: "Clear financial planning and structured advisory support are essential for building a reliable roadmap to business success, defining long-term goals and actionable growth.",
    features: [
      {
        title: "Financial Planning",
        text: "Plan ahead with realistic numbers, structured forecasting, and liquidity oversight.",
        icon: "TrendingUp"
      },
      {
        title: "Business Advisory",
        text: "Practical, data-driven guidance for better executive decisions and sustainable growth.",
        icon: "Compass"
      },
      {
        title: "Financial Reporting Support",
        text: "Clear, audit-ready financial reports that leadership can easily read and act on.",
        icon: "FileText"
      }
    ],
    image: servicesData[2].image,
    imageAlt: servicesData[2].imageAlt,
  }
];
