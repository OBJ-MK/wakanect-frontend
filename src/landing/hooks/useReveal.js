import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

/**
 * Scroll-reveal for any descendants marked with [data-reveal].
 * Uses ScrollTrigger.batch so staggers feel natural per viewport entry.
 * Returns a ref to attach to the section root.
 */
export function useReveal({ y = 28, stagger = 0.08, duration = 0.7 } = {}) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const root = scope.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]', root);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y });

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: 'power3.out',
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [y, stagger, duration]);

  return scope;
}
