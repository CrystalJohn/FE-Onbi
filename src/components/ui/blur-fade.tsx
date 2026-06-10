'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

interface BlurFadeProps extends HTMLMotionProps<'div'> {
  delay?: number;
  inView?: boolean;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  inView = false,
  ...props
}: BlurFadeProps) {
  const shouldReduceMotion = useReducedMotion();

  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 18, filter: 'blur(8px)' };

  const visible = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      initial={hidden}
      {...(inView
        ? {
            whileInView: visible,
            viewport: { once: true, margin: '-80px' },
          }
        : { animate: visible })}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
