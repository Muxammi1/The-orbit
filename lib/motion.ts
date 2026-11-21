export const DURATION = {
  micro: 0.2, // 200ms
  section: 0.7, // 700ms
  enter: 0.8, // 800ms
} as const;

export const EASING = {
  orbit: [0.22, 1, 0.36, 1] as const, // cubic-bezier(0.22, 1, 0.36, 1)
  standard: [0.25, 0.1, 0.25, 1] as const,
  linear: [0, 0, 1, 1] as const,
} as const;

export const TRANSITION = {
  micro: {
    duration: DURATION.micro,
    ease: EASING.orbit,
  },
  section: {
    duration: DURATION.section,
    ease: EASING.orbit,
  },
} as const;
