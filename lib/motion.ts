export const DURATION = {
  micro: 0.15, // 150ms immediate feedback
  routine: 0.25, // 250ms routine state change
  layout: 0.35, // 350ms layout, modal, or overlay transition
  focal: 0.7, // 700ms authored focal entrance
  section: 0.7, // 700ms section transition
  enter: 0.8, // 800ms
} as const;

export const EASING = {
  orbit: [0.22, 1, 0.36, 1] as const, // signature orbit curve
  decel: [0.16, 1, 0.3, 1] as const, // natural exponential deceleration
  standard: [0.25, 0.1, 0.25, 1] as const,
  linear: [0, 0, 1, 1] as const,
} as const;

export const TRANSITION = {
  micro: {
    duration: DURATION.micro,
    ease: EASING.decel,
  },
  routine: {
    duration: DURATION.routine,
    ease: EASING.decel,
  },
  section: {
    duration: DURATION.section,
    ease: EASING.orbit,
  },
  focal: {
    duration: DURATION.focal,
    ease: EASING.decel,
  },
} as const;
