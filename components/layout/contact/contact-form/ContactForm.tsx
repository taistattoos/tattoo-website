'use client';

import { AnimatePresence, motion } from 'framer-motion';
import FormField from '@/components/layout/contact/contact-form/FormField';
import { useContactForm } from '@/hooks/useContactForm';
import { inputClasses } from '@/lib/constants/contact-form';
import type { ContactFormContent } from '@/types/contact-form';

export default function ContactForm({ content }: { content: ContactFormContent }) {
  const { name, setName, email, setEmail, answers, setAnswer, visibleQuestions, handleSubmit } =
    useContactForm(content);

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
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

      <button
        type='submit'
        className='self-start rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10'
      >
        {content.submit}
      </button>
    </form>
  );
}