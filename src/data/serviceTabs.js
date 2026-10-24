// PLACEHOLDER: replace images with real photos before launch.
import { servicesData } from './services';

export const serviceTabsData = [
  {
    id: 'accounting-bookkeeping',
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
    tabLabel: servicesData[1].title,
    serviceValue: servicesData[1].serviceValue,
    intro: "Practical tax guidance and filing support, so you stay compliant with UAE requirements.",
    items: [
      {
        title: "Tax Consultancy",
        text: "Advice on the tax rules that apply to your business."
      },
      {
        title: "Tax Filing Assistance",
        text: "Accurate, on-time submissions."
      },
      {
        title: "Statutory Compliance",
        text: "Support with regulatory obligations."
      }
    ],
    image: servicesData[1].image,
    imageAlt: servicesData[1].imageAlt,
  },
  {
    id: 'audit-advisory',
    tabLabel: servicesData[2].title,
    serviceValue: servicesData[2].serviceValue,
    intro: "Clear financial planning and advice to help your business grow with confidence.",
    items: [
      {
        title: "Financial Planning",
        text: "Plan ahead with realistic numbers."
      },
      {
        title: "Business Advisory",
        text: "Practical guidance for better decisions."
      },
      {
        title: "Financial Reporting Support",
        text: "Reports that are easy to read and act on."
      }
    ],
    image: servicesData[2].image,
    imageAlt: servicesData[2].imageAlt,
  }
];
