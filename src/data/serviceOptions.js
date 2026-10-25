/**
 * Grace Way Accounting FZC LLC
 * Shared Service Options for Enquiry Form & Serverless API Validation
 */

export const SERVICE_OPTIONS = [
  { value: 'Accounting & Bookkeeping', label: 'Accounting & Bookkeeping' },
  { value: 'Taxation & Compliance', label: 'Taxation & Compliance' },
  { value: 'Audit & Advisory', label: 'Audit & Advisory' },
  { value: 'Other', label: 'Other' },
];

export const ALLOWED_SERVICES = SERVICE_OPTIONS.map((s) => s.value);
