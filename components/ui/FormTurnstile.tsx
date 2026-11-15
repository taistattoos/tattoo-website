'use client';

import { useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface FormTurnstileProps {
  turnstileRef: RefObject<TurnstileInstance | null>;
  onToken: (token: string) => void;
  /** The widget couldn't load or run (blocker, network, unsupported browser). */
  onFail: () => void;
}

/**
 * Cloudflare Turnstile in interaction-only mode: invisible for nearly everyone, and only shown
 * (sliding open smoothly) when Cloudflare needs the visitor to click.
 */
export default function FormTurnstile({ turnstileRef, onToken, onFail }: FormTurnstileProps) {
  const [interactive, setInteractive] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ height: interactive ? 'auto' : 0, opacity: interactive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className='overflow-hidden'
    >
      <div className='pb-6'>
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
          options={{ theme: 'dark', appearance: 'interaction-only' }}
          onSuccess={onToken}
          onExpire={() => onToken('')}
          onError={onFail}
          onUnsupported={onFail}
          // The visitor didn't answer a challenge in time: start a fresh one.
          onTimeout={() => turnstileRef.current?.reset()}
          onBeforeInteractive={() => setInteractive(true)}
          onAfterInteractive={() => setInteractive(false)}
        />
      </div>
    </motion.div>
  );
}
