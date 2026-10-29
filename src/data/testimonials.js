// PLACEHOLDER: dummy reviews for design only. Replace with REAL, client-approved reviews (with written permission for name and photo) or set showTestimonials to false before launch. Do NOT add Review or AggregateRating JSON-LD.

import client1Img from '../assets/testimonials/client-1.webp';
import client2Img from '../assets/testimonials/client-2.webp';
import client3Img from '../assets/testimonials/client-3.webp';
import client4Img from '../assets/testimonials/client-4.webp';
import client5Img from '../assets/testimonials/client-5.webp';
import client6Img from '../assets/testimonials/client-6.webp';
import client7Img from '../assets/testimonials/client-7.webp';
import client8Img from '../assets/testimonials/client-8.webp';

export const testimonials = [
  {
    id: 'testimonial-1',
    name: 'Tariq Al-Mansoor',
    role: 'Finance Manager',
    quote: 'The team keeps our books accurate and on time, so we always know where the business stands.',
    rating: 5,
    image: client1Img,
    imageAlt: 'Portrait of Tariq Al-Mansoor, Finance Manager',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-2',
    name: 'Sarah Jenkins',
    role: 'Business Owner',
    quote: 'Clear guidance on tax and compliance has taken a lot of pressure off our small team.',
    rating: 4,
    image: client2Img,
    imageAlt: 'Portrait of Sarah Jenkins, Business Owner',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-3',
    name: 'Omar Al-Khatib',
    role: 'Operations Coordinator',
    quote: 'Professional accounting support that is easy to work with and easy to understand.',
    rating: 5,
    image: client3Img,
    imageAlt: 'Portrait of Omar Al-Khatib, Operations Coordinator',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-4',
    name: 'Elena Rostova',
    role: 'Managing Director',
    quote: 'Their monthly reporting is exceptionally thorough, giving our leadership team complete clarity across all regional operations.',
    rating: 5,
    image: client4Img,
    imageAlt: 'Portrait of Elena Rostova, Managing Director',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-5',
    name: 'Rajesh Sharma',
    role: 'Chief Technology Officer',
    quote: 'Seamless payroll management and proactive advisory that allows our core engineering team to focus entirely on product growth.',
    rating: 5,
    image: client5Img,
    imageAlt: 'Portrait of Rajesh Sharma, Chief Technology Officer',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-6',
    name: 'Fatima Al-Zahra',
    role: 'General Manager',
    quote: 'Consistent communication, dependable compliance handling, and a genuinely supportive advisory team that feels like an internal department.',
    rating: 5,
    image: client6Img,
    imageAlt: 'Portrait of Fatima Al-Zahra, General Manager',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-7',
    name: 'David Miller',
    role: 'Supply Chain Director',
    quote: 'Structured financial reviews and prompt answers to complex regulatory queries have made our annual planning much smoother.',
    rating: 4,
    image: client7Img,
    imageAlt: 'Portrait of David Miller, Supply Chain Director',
    isPlaceholder: true,
  },
  {
    id: 'testimonial-8',
    name: 'Noor Al-Nuaimi',
    role: 'Retail Group Director',
    quote: 'Trustworthy, responsive, and detail-oriented professionals who have streamlined our financial workflows across multiple branch locations.',
    rating: 5,
    image: client8Img,
    imageAlt: 'Portrait of Noor Al-Nuaimi, Retail Group Director',
    isPlaceholder: true,
  },
];

// Dev-only: Warn about placeholder testimonials
let hasWarned = false;
if (import.meta.env.DEV && !hasWarned) {
  if (testimonials.some((t) => t.isPlaceholder)) {
    console.warn('Testimonials are placeholders. Replace before launch.');
    hasWarned = true;
  }
}
