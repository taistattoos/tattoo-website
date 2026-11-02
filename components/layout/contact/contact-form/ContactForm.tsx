'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Turnstile } from '@marsidev/react-turnstile';
import FormField from '@/components/layout/contact/contact-form/FormField';
import { useContactForm } from '@/hooks/useContactForm';
import { inputClasses } from '@/lib/constants/contact-form';
import type { ContactFormContent } from '@/types/contact-form';

export default function ContactForm({ content }: { content: ContactFormContent }) {
  const {
    name,
    setName,
    email,
    setEmail,
    answers,
    setAnswer,
    honeypot,
    setHoneypot,
    consent,
    setConsent,
    setToken,
    turnstileRef,
    status,
    canSubmit,
    visibleQuestions,
    handleSubmit,
  } = useContactForm(content);

  if (status === 'success') {
    return (
      <p role='status' className='border border-white/20 px-6 py-8 text-lg text-white'>
        {content.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='relative flex flex-col'>
      <div aria-hidden='true' className='absolute -left-2499.75 h-0 w-0 overflow-hidden'>
        <label>
          Website
          <input
            type='text'
            name='website'
            tabIndex={-1}
            autoComplete='off'
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </div>

      <div className='grid gap-4 pb-6 sm:grid-cols-2'>
        <label className='flex flex-col gap-1 text-sm text-white/70'>
          {content.nameLabel} *
          <input
            required
            type='text'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClasses}
          />
        </label>
        <label className='flex flex-col gap-1 text-sm text-white/70'>
          {content.emailLabel} *
          <input
            required
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      <AnimatePresence initial={false}>
        {visibleQuestions.map((question) => (
          <motion.div
            key={question.key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='-m-1 overflow-hidden p-1'
          >
            <div className='pb-6'>
              <FormField
                question={question}
                value={answers[question.key] ?? ''}
                onChange={(value) => setAnswer(question.key, value)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <label className='flex cursor-pointer items-start gap-3 pb-6 text-sm text-white/70'>
        <input
          type='checkbox'
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          className='mt-1 h-4 w-4 shrink-0 accent-white'
        />
        <span>
          {content.consentText}{' '}
          <Link
            href={`/${content.locale}/privacy`}
            target='_blank'
            className='text-white underline underline-offset-4 hover:text-white/70'
          >
            {content.consentLink}
          </Link>
        </span>
      </label>

      <div className='pb-6'>
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
          options={{ theme: 'dark' }}
          onSuccess={setToken}
          onExpire={() => setToken('')}
          onError={() => setToken('')}
        />
      </div>

      {status === 'error' && (
        <p role='alert' className='mb-6 border border-white/30 px-4 py-3 text-sm text-white/80'>
          {content.error}
        </p>
      )}

      <button
        type='submit'
        disabled={!canSubmit}
        className='self-start cursor-pointer rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'
      >
        {status === 'sending' ? content.sending : content.submit}
      </button>
    </form>
  );
}