import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import {Button} from './ui/Button';
import WhatsAppLeadForm from './WhatsAppLeadForm';
import HeroVisual from './HeroVisual';

const LINES = [
  [{ t: 'Vendez sur' }],
  [{ t: 'WhatsApp.' }],
  [{ t: 'Sans ' }, { t: 'effort.', grad: true }],
];

const STATS = [
  ['2 mois', 'gratuits — aucun engagement'],
  ['0 %', 'prélevé sur vos ventes'],
];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      // Transform-only (opacity stays 1) so hero text paints on the first frame — keeps LCP fast.
      tl.from('[data-line]', { y: 20, duration: 0.55, stagger: 0.08 })
        .from('[data-hero-fade]', { y: 24, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-28"
    >
      {/* Ambient background — radial-gradients instead of blur filters (cheap to paint) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(38rem 38rem at 50% -6rem, rgba(236,94,42,0.16), transparent 62%), radial-gradient(32rem 32rem at 100% 12rem, rgba(255,179,71,0.10), transparent 60%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,248,244,0.045) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
          }}
        />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Copy */}
        <div className="max-w-xl">
          <span data-hero-fade className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-wa" />
            Commerce WhatsApp · Afrique de l'Ouest
          </span>

          <h1 className="mt-6 font-display text-display-xl font-extrabold">
            {LINES.map((line, i) => (
              <span key={i} data-line className="block pb-[0.08em]">
                <span className="inline-block">
                  {line.map((part, j) => (
                    <span key={j} className={part.grad ? 'text-gradient-warm' : ''}>
                      {part.t}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-fade
            className="mt-7 max-w-prose text-pretty text-lg text-cream/70 sm:text-xl"
          >
            Wakanect transforme vos messages WhatsApp en vraie boutique en ligne — automatiquement.
            <span className="text-cream"> Testez gratuitement pendant 2 mois, sans engagement.</span>
          </p>

          <div data-hero-fade className="mt-9 max-w-md">
            <WhatsAppLeadForm />
            <Button as="a" href="#demo" variant="ghost" size="lg" className="mt-3 w-full sm:w-auto">
              Voir la démo
            </Button>
          </div>

          <dl data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {STATS.map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="font-display text-2xl font-bold text-cream">{n}</dt>
                <dd className="text-sm text-cream/55">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div data-hero-fade className="relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}