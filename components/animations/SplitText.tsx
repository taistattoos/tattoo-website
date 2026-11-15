'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Fragment, type ElementType } from 'react';
import { EASE_OUT, VIEWPORT, type TriggerType } from './config';

type SplitTextProps = {
  text: string;
  as?: ElementType;
  by?: 'letters' | 'words';
  stagger?: number;
  delay?: number;
  duration?: number;
  trigger?: TriggerType;
  className?: string;
  id?: string;
  /**
   * 'fade': pieces fade in from invisible (fine below the fold).
   * 'focus': pieces are painted from the first frame, rising from a blur. Use it for above-the-fold
   * headings: Google's Largest Contentful Paint ignores invisible text, so 'fade' there delays the score.
   */
  reveal?: 'fade' | 'focus';
};

export default function SplitText({
  text,
  as: Tag = 'span',
  by = 'letters',
  stagger = 0.04,
  delay = 0,
  duration = 0.6,
  trigger = 'inView',
  className,
  id,
  reveal = 'fade',
}: SplitTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const piece: Variants = {
    hidden: reveal === 'focus' ? { opacity: 1, y: '0.3em', filter: 'blur(12px)' } : { opacity: 0, y: '0.4em' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration, ease: EASE_OUT } },
  };

  const words = text.split(' ');

  const triggerProps = trigger === 'mount' ? { animate: 'visible' } : { whileInView: 'visible', viewport: VIEWPORT };

  return (
    <Tag id={id} className={className}>
      <span className='sr-only'>{text}</span>

      <motion.span aria-hidden='true' className='inline' variants={container} initial='hidden' {...triggerProps}>
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className='inline-block whitespace-nowrap'>
              {by === 'words' ? (
                <motion.span variants={piece} className='inline-block'>
                  {word}
                </motion.span>
              ) : (
                Array.from(word).map((char, ci) => (
                  <motion.span key={ci} variants={piece} className='inline-block'>
                    {char}
                  </motion.span>
                ))
              )}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
