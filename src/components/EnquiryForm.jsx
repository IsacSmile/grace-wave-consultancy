import React, { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: siteConfig.contact.formServices[0].value,
    message: '',
    website_url: '', // Honeypot field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Listen for service selection from ServiceDetail cards
  useEffect(() => {
    const handleServiceSelect = (e) => {
      const targetService = e.detail;
      const matched = siteConfig.contact.formServices.find(
        (s) => s.value.toLowerCase().includes(targetService.toLowerCase()) || 
               targetService.toLowerCase().includes(s.value.toLowerCase())
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, service: matched.value }));
      }
    };

    window.addEventListener('select-service', handleServiceSelect);
    return () => window.removeEventListener('select-service', handleServiceSelect);
  }, []);

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    // Phone validation (tolerant of UAE & international formats)
    const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number (e.g. +971 50 123 4567).';
    }

    // Service validation
    if (!formData.service) {
      newErrors.service = 'Please select a service.';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Enquiry message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters detailing your request.';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be under 1,000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: siteConfig.contact.formServices[0].value,
          message: '',
          website_url: '',
        });
      } else {
        setSubmitError(
          data.error || 'Failed to submit your enquiry. Please verify your details and try again.'
        );
      }
    } catch (err) {
      setSubmitError('A network error occurred. Please check your connection or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    setErrors({});
  };

  // Success Confirmation State
  if (submitSuccess) {
    return (
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-emerald-200 shadow-elevated text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-heading font-bold text-2xl text-navy-950 mb-2">
          Enquiry Received
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          Thank you for reaching out to <strong>{siteConfig.business.name}</strong>. An accounting consultant will review your inquiry and contact you within 24 business hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Send Another Enquiry</span>
          </button>

          <a
            href={siteConfig.business.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Now on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-slate-200 shadow-elevated">
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-navy-950 mb-1">
          Send Us an Enquiry
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Fill in your details below and our team will get back to you promptly.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Submission Error</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
        {/* Honeypot field (hidden from real users, caught by bots) */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="website_url">Website URL</label>
          <input
            type="text"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Mohammed Al Mansoori"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.name
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-navy-900 focus:ring-navy-100'
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-rose-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Two-column on tablets / desktop: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. name@company.ae"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 min-h-[44px] ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-navy-900 focus:ring-navy-100'
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-rose-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +971 50 123 4567"
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 min-h-[44px] ${
                errors.phone
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-navy-900 focus:ring-navy-100'
              }`}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-rose-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Service Requested */}
        <div>
          <label htmlFor="service" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Service Required <span className="text-rose-500">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:border-navy-900 focus:ring-navy-100 min-h-[44px]"
          >
            {siteConfig.contact.formServices.map((svc) => (
              <option key={svc.value} value={svc.value}>
                {svc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-700">
              Message / Scope Details <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {formData.message.length}/1000
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your business, transaction volume, or specific tax/accounting requirement..."
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 resize-y min-h-[110px] ${
              errors.message
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-navy-900 focus:ring-navy-100'
            }`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-rose-600">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-400 shadow-md hover:shadow-gold-glow disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] min-h-[48px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Transmitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Free Enquiry</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500 pt-1">
          Your information is protected under strict confidentiality. Zero spam.
        </p>
      </form>
    </div>
  );
}
