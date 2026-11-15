'use client';

import { AnimatePresence, motion } from 'framer-motion';

/** Error box above a form's submit button. Slides open and closed instead of popping in. */
export default function FormAlert({ message }: { message: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={message}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className='overflow-hidden'
        >
          <p role='alert' className='mb-6 border border-white/30 px-4 py-3 text-sm text-white/80'>
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
