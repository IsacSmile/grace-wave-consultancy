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
    website_url: '', // Honeypot field 1
    website: '',     // Honeypot field 2
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
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters.';
    }

    // Phone validation (tolerant of UAE & international formats)
    const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide a contact phone number.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid telephone (e.g. +971 50 123 4567).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    // Service validation
    if (!formData.service) {
      newErrors.service = 'Please select a service.';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please include details about your enquiry.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters.';
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
        body: JSON.stringify({
          ...formData,
          website_url: formData.website_url || formData.website, // pass either honeypot
        }),
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
          website: '',
        });
      } else {
        setSubmitError(
          data.error || 'Failed to submit your enquiry. Please verify your details or contact us directly.'
        );
      }
    } catch (err) {
      setSubmitError('A network connection error occurred. Please reach out via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    setErrors({});
  };

  return (
    <div className="w-full max-w-xl rounded-3xl bg-[#071328] border-2 border-white p-6 sm:p-8 md:p-9 shadow-2xl relative">
      {/* Card Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
          {siteConfig.contact.cardTitle}
        </h3>
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
          <Send className="w-4 h-4 transform rotate-12" />
        </div>
      </div>
        
        {/* Success Confirmation State */}
        {submitSuccess ? (
          <div className="py-6 sm:py-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-heading font-bold text-2xl text-white mb-2">
              Enquiry Received
            </h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
              Thank you for reaching out to <strong>{siteConfig.business.name}</strong>. An accounting consultant will examine your requirements and get in touch with you shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Send Another Enquiry</span>
              </button>

              <a
                href={siteConfig.business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Intro text */}
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {siteConfig.contact.cardIntro}
            </p>

            {/* Error banner */}
            {submitError && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs sm:text-sm"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-rose-300">Submission Error</span>
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              {/* Off-screen Honeypot fields (catches bots silently) */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
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

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tariq Al Mansoori"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl text-base text-white placeholder:text-slate-400 bg-white/5 border transition-all focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-400/40'
                        : 'border-white/15 focus:border-blue-400 focus:ring-blue-400/30'
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-rose-400" aria-live="polite">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +971 50 123 4567"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`w-full h-12 px-4 rounded-xl text-base text-white placeholder:text-slate-400 bg-white/5 border transition-all focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-rose-400 focus:ring-rose-400/40'
                        : 'border-white/15 focus:border-blue-400 focus:ring-blue-400/30'
                    }`}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-xs text-rose-400" aria-live="polite">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
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
                    className={`w-full h-12 px-4 rounded-xl text-base text-white placeholder:text-slate-400 bg-white/5 border transition-all focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-400/40'
                        : 'border-white/15 focus:border-blue-400 focus:ring-blue-400/30'
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-rose-400" aria-live="polite">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Service Required <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl text-base text-white bg-[#0e1f3d] border border-white/15 transition-all focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-400/30"
                  >
                    {siteConfig.contact.formServices.map((svc) => (
                      <option key={svc.value} value={svc.value} className="bg-[#071328] text-white">
                        {svc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Message <span className="text-rose-400">*</span>
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
                  placeholder="Share details about your business or immediate tax / accounting requirement..."
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`w-full p-4 rounded-xl text-base text-white placeholder:text-slate-400 bg-white/5 border transition-all focus:outline-none focus:ring-2 resize-y min-h-[120px] ${
                    errors.message
                      ? 'border-rose-400 focus:ring-rose-400/40'
                      : 'border-white/15 focus:border-blue-400 focus:ring-blue-400/30'
                  }`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-rose-400" aria-live="polite">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
    </div>
  );
}
