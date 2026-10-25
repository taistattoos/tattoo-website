'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CONTACT_LABELS } from './../../../../lib/constants/contactLabels';
import { ColorChoice, ContactMethod, FormStateInterface, Placement } from '@/types/hero';
import { initialState, inputClasses } from '@/lib/constants/contact-form';

type Locale = keyof typeof CONTACT_LABELS;

export default function ContactForm({ locale }: { locale: string }) {
  const t = CONTACT_LABELS[locale as Locale] ?? CONTACT_LABELS.en;
  const [form, setForm] = useState<FormStateInterface>(initialState);

  const showFullDetails = form.contactMethod === 'form_now';
  const showWhatsapp = form.contactMethod === 'whatsapp';

  const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
    { value: 'form_now', label: t.methodFormNow },
    { value: 'in_person', label: t.methodInPerson },
    { value: 'whatsapp', label: t.methodWhatsapp },
    { value: 'email_direct', label: t.methodEmailDirect },
  ];

  const PLACEMENTS: { value: Exclude<Placement, ''>; label: string }[] = [
    { value: 'arm', label: t.placementArm },
    { value: 'leg', label: t.placementLeg },
    { value: 'elbow', label: t.placementElbow },
    { value: 'neck', label: t.placementNeck },
    { value: 'other', label: t.placementOther },
  ];

  const COLORS: { value: ColorChoice; label: string }[] = [
    { value: 'black', label: t.colorBlack },
    { value: 'gray', label: t.colorGray },
    { value: 'red', label: t.colorRed },
    { value: 'blue', label: t.colorBlue },
    { value: 'green', label: t.colorGreen },
    { value: 'other', label: t.colorOther },
  ];

  function toggleColor(color: ColorChoice) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    console.log('form state', form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-white/70">
          {t.name}
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white/70">
          {t.email}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClasses}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm text-white/70">
          {t.contactMethodLabel}
        </legend>
        {CONTACT_METHODS.map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center gap-2 text-sm text-white/70"
          >
            <input
              type="radio"
              name="contactMethod"
              value={value}
              checked={form.contactMethod === value}
              onChange={() => setForm({ ...form, contactMethod: value })}
              className="accent-white"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <AnimatePresence>
        {showWhatsapp && (
          <motion.label
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1 overflow-hidden text-sm text-white/70"
          >
            {t.whatsappNumber}
            <input
              type="tel"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
              className={inputClasses}
            />
          </motion.label>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-6 overflow-hidden"
          >
            <label className="flex flex-col gap-1 text-sm text-white/70">
              {t.placementLabel}
              <select
                value={form.placement}
                onChange={(e) =>
                  setForm({ ...form, placement: e.target.value as Placement })
                }
                className={inputClasses}
              >
                <option value="" className="bg-black">
                  {t.selectPlaceholder}
                </option>
                {PLACEMENTS.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-black">
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <AnimatePresence>
              {form.placement === 'other' && (
                <motion.label
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1 overflow-hidden text-sm text-white/70"
                >
                  {t.placementOtherLabel}
                  <input
                    type="text"
                    value={form.placementOther}
                    onChange={(e) =>
                      setForm({ ...form, placementOther: e.target.value })
                    }
                    className={inputClasses}
                  />
                </motion.label>
              )}
            </AnimatePresence>

            <label className="flex flex-col gap-1 text-sm text-white/70">
              {t.sizeLabel}
              <input
                type="text"
                placeholder={t.sizePlaceholder}
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className={inputClasses}
              />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm text-white/70">
                {t.colorsLabel}
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {COLORS.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <input
                      type="checkbox"
                      checked={form.colors.includes(value)}
                      onChange={() => toggleColor(value)}
                      className="accent-white"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </motion.div>
        )}
      </AnimatePresence>

      <label className="flex flex-col gap-1 text-sm text-white/70">
        {t.messageLabel}
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClasses}
        />
      </label>

      <button
        type="submit"
        className="rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        {t.send}
      </button>
    </form>
  );
}
