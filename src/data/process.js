// Generic process copy. Client to confirm. No timeframes, prices or guarantees.
export const processSteps = [
  {
    id: 'enquiry',
    number: '01',
    title: 'Enquiry',
    text: 'Reach us by form, call or WhatsApp and tell us what you need.',
    points: [
      'Tell us your service needs',
      'Choose form, call or WhatsApp',
      'We respond to your enquiry',
    ],
    youProvide: [
      'Your business name',
      'The service you need',
    ],
  },
  {
    id: 'consultation',
    number: '02',
    title: 'Consultation',
    text: 'We understand your business, requirements and compliance needs.',
    points: [
      'Understand your business',
      'Review your accounting and tax needs',
      'Identify compliance requirements',
    ],
    youProvide: [
      'Company profile and business details',
      'Current accounting or tax status',
    ],
  },
  {
    id: 'proposal',
    number: '03',
    title: 'Proposal',
    text: 'You receive a clear scope of services and the next steps.',
    points: [
      'Clear scope of services',
      'Defined next steps',
      'Your questions answered',
    ],
    youProvide: [
      'Feedback on the proposed scope',
      'Approval to proceed',
    ],
  },
  {
    id: 'onboarding',
    number: '04',
    title: 'Onboarding',
    text: 'We set up your accounts and begin supporting your business.',
    points: [
      'Set up your accounts',
      'Share documents securely with the team',
      'Start ongoing support',
    ],
    youProvide: [
      'Trade licence and company documents',
      'Access to relevant financial records',
    ],
  },
];
