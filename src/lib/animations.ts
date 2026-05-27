import { Variants } from 'motion/react';

// ============================================
// ANIMATION SYSTEM FOR LANDING PAGE
// Using Framer Motion whileInView pattern
// ============================================

// --- SHARED TRANSITION PRESETS ---
export const transitions = {
  smooth: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  spring: { type: 'spring' as const, stiffness: 100, damping: 20 },
  bounce: { type: 'spring' as const, stiffness: 200, damping: 15 },
  slow: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  fast: { duration: 0.4, ease: 'easeOut' as const },
};

// --- VIEWPORT CONFIG ---
export const viewport = {
  once: true,
  margin: '-80px',
};

// --- SECTION HEADER ANIMATIONS ---
// Fade up from below — used for section titles
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Fade in from left
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

// Fade in from right
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

// Scale up from smaller
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// --- STAGGER CONTAINER ---
// Wrap children to stagger their animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

// --- CARD ANIMATIONS ---
// Cards sliding in from left with stagger
export const cardFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Cards sliding in from right with stagger
export const cardFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Cards scaling up (good for grid items)
export const cardScale: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Cards flipping in (3D effect)
export const cardFlip: Variants = {
  hidden: { opacity: 0, rotateY: 15, x: 30 },
  visible: { opacity: 1, rotateY: 0, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// --- SECTION-SPECIFIC ANIMATIONS ---

// Hero: dramatic entrance
export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export const heroProduct: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

// Parent Problems: cards slide from left
export const problemCard: Variants = {
  hidden: { opacity: 0, x: -50, y: 15 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// ONBI Solution: cards slide from right with scale
export const solutionCard: Variants = {
  hidden: { opacity: 0, x: 50, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Meet Our Team: cards pop from center
export const teamCard: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Features: rotate in
export const featureCard: Variants = {
  hidden: { opacity: 0, rotateY: 10, x: 15 },
  visible: { opacity: 1, rotateY: 0, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Product Specs: slide up with shadow
export const productReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

// Testimonials: fade scale
export const testimonialCard: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: transitions.smooth },
};

// Footer: simple fade
export const footerFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};
