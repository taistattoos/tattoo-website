'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AccordionItemInterface } from '@/types/ui';

export default function Accordion({ items }: { items: AccordionItemInterface[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className='border-t border-white/10'>
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id} className='border-b border-white/10'>
            <h3>
              <button
                type='button'
                id={`${item.id}-button`}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className='flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg text-white'
              >
                {item.title}

                <span aria-hidden='true' className='relative size-4 shrink-0'>
                  <span className='absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white' />
                  <span
                    className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white transition-transform duration-300 ${
                      isOpen ? 'scale-y-0' : ''
                    }`}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${item.id}-panel`}
                  role='region'
                  aria-labelledby={`${item.id}-button`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='overflow-hidden'
                >
                  <div className='max-w-2xl pb-6'>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}