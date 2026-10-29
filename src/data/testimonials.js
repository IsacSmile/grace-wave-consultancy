// PLACEHOLDER: dummy reviews for design only. Replace with REAL, client-approved reviews (with written permission for name and photo) or set showTestimonials to false before launch. Do NOT add Review or AggregateRating JSON-LD.

import client1Img from '../assets/testimonials/client-1.webp';
import client2Img from '../assets/testimonials/client-2.webp';
import client3Img from '../assets/testimonials/client-3.webp';

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
];

// Dev-only: Warn about placeholder testimonials
let hasWarned = false;
if (import.meta.env.DEV && !hasWarned) {
  if (testimonials.some((t) => t.isPlaceholder)) {
    console.warn('Testimonials are placeholders. Replace before launch.');
    hasWarned = true;
  }
}

