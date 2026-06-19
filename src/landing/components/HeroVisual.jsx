import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import Icon from './Icon';
import Img from './ui/Img';

/**
 * Hybrid hero: a real merchant photo (the human, the trust) with the live Wakanect
 * storefront UI layered on top as crisp HTML — input (WhatsApp) → output (published shop).
 */
export default function HeroVisual() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Transform-only entrances (opacity stays 1) so nothing blinks and paint isn't blocked.
      gsap.from('[data-photo]', {
        y: 40,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1,
      });
      gsap.from('[data-card]', {
        y: 30,
        x: 20,
        scale: 0.9,
        duration: 0.9,
        ease: 'back.out(1.4)',
        delay: 0.6,
      });
      gsap.from('[data-float]', {
        scale: 0.6,
        duration: 0.6,
        ease: 'back.out(2)',
        stagger: 0.15,
        delay: 0.9,
      });
      gsap.fromTo(
        '[data-conf-fill]',
        { width: '0%' },
        { width: '98%', duration: 1.2, ease: 'power2.out', delay: 1.1 }
      );

      // Idle drift
      gsap.to('[data-card]', { y: '+=10', duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('[data-float="wa"]', { y: '-=8', duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true });

      // Scroll-linked depth
      gsap.to(el, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 20%', end: 'bottom top', scrub: 1 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[26rem] select-none">
      {/* Warm glow behind — radial-gradient (no blur filter) */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(16rem 16rem at 50% 38%, rgba(236,94,42,0.34), transparent 62%), radial-gradient(11rem 11rem at 82% 82%, rgba(255,179,71,0.26), transparent 62%)',
        }}
      />

      {/* Merchant photo */}
      <div data-photo className="relative">
        <Img
          src="/images/hero-merchant.jpg"
          alt="Commerçante ouest-africaine qui gère sa boutique depuis son téléphone"
          width={832}
          height={1040}
          eager
          className="aspect-[4/5] w-full rounded-[1.75rem] border border-cream/10 shadow-lift"
        >
          {/* Scrim to seat overlays + melt into the page */}
          <div className="absolute inset-0 z-[2] rounded-[1.75rem] bg-gradient-to-t from-navy-deep/85 via-navy-deep/10 to-navy-deep/15" />

          {/* WhatsApp input chip (top-left) */}
          <div
            data-float="wa"
            className="glass absolute left-3 top-3 z-[3] flex items-center gap-2 rounded-full px-3 py-1.5 shadow-glass"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-wa/20 text-wa">
              <Icon name="message" size={13} />
            </span>
            <span className="text-[0.7rem] font-medium text-cream">Nouveau message produit</span>
          </div>
        </Img>
      </div>

      {/* Floating speed chip */}
      <div
        data-float
        className="glass absolute left-1 top-[38%] z-[4] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.68rem] font-medium text-cream shadow-glass sm:-left-4"
      >
        <Icon name="zap" size={14} className="text-amber" /> Publié en 1,2s
      </div>

      {/* Published storefront card (output) */}
      <div
        data-card
        className="glass absolute -bottom-7 right-1 z-[5] w-[14.5rem] rounded-2xl p-3 shadow-lift sm:-right-6"
      >
        <Img
          src="/images/hero-product.jpg"
          alt="Robe Wax Royale publiée sur la boutique"
          className="mb-2.5 h-24 w-full rounded-xl"
        >
          <span className="absolute right-2 top-2 z-[2] flex items-center gap-1 rounded-full bg-navy-deep/70 px-2 py-0.5 text-[0.6rem] font-semibold text-status-success backdrop-blur">
            <Icon name="check" size={11} /> Publié
          </span>
        </Img>
        <p className="text-[0.82rem] font-semibold text-cream">Robe Wax Royale</p>
        <p className="mt-0.5 text-[0.9rem] font-bold text-orange">25 000 XOF</p>
        <div className="mt-2 flex gap-1.5">
          {['S', 'M', 'L'].map((s) => (
            <span
              key={s}
              className="rounded-md border border-cream/20 px-1.5 py-0.5 text-[0.6rem] font-medium text-cream/80"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[0.6rem] text-cream/60">
            <span>Confiance IA</span>
            <span className="font-semibold text-status-success">98%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
            <div data-conf-fill className="h-full rounded-full bg-status-success" style={{ width: '98%' }} />
          </div>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-wa py-1.5 text-[0.72rem] font-semibold text-[#04231a]">
          <Icon name="wave" size={13} /> Payer avec Wave
        </button>
      </div>
    </div>
  );
}
