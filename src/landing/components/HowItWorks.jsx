import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import SectionHeading from './ui/SectionHeading';
import Icon from './Icon';

const STEPS = [
  {
    n: '01',
    icon: 'message',
    title: 'Envoyez un message',
    desc: 'Décrivez votre produit sur WhatsApp, comme à un client. Une photo, un prix, des tailles — suffisent.',
  },
  {
    n: '02',
    icon: 'cpu',
    title: 'L’IA structure tout',
    desc: 'Nom, prix, tailles, couleurs et stock sont extraits automatiquement, avec un score de confiance transparent.',
  },
  {
    n: '03',
    icon: 'checkCircle',
    title: 'Vous validez',
    desc: 'Un coup d’œil, un ajustement si besoin, et c’est confirmé. Pas de rejet, pas de friction.',
  },
  {
    n: '04',
    icon: 'rocket',
    title: 'C’est en ligne',
    desc: 'Le produit est publié sur votre boutique. Vos clients commandent sans compte et paient avec Wave.',
  },
];

export default function HowItWorks() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const track = root.current.querySelector('[data-track]');
      gsap.fromTo(
        '[data-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray('[data-step]').forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 82%', once: true },
        });
        ScrollTriggerActivate(step);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={root} className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Du message à la vente, en quatre temps."
          intro="Aucune installation, aucun catalogue à remplir. Le flux que vous utilisez déjà, augmenté."
        />

        <div data-track className="relative mt-16 pl-10 sm:pl-0">
          {/* Vertical line (mobile/desktop left rail) */}
          <div className="absolute left-[1.15rem] top-2 h-full w-px bg-cream/10 sm:left-1/2 sm:-translate-x-1/2" />
          <div
            data-fill
            className="absolute left-[1.15rem] top-2 h-full w-px origin-top gradient-warm sm:left-1/2 sm:-translate-x-1/2"
          />

          <ol className="space-y-12 sm:space-y-0">
            {STEPS.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={s.n}
                  data-step
                  className="relative sm:grid sm:grid-cols-2 sm:gap-12 sm:py-8"
                >
                  {/* Node — kept off the grid placement so it stays centred on the rail */}
                  <span
                    data-node
                    className="absolute -left-[2.35rem] top-1 grid h-9 w-9 place-items-center rounded-full border border-cream/20 bg-navy-dark text-xs font-bold text-cream/70 transition-colors sm:left-1/2 sm:top-9 sm:-translate-x-1/2"
                  >
                    {s.n}
                  </span>

                  <div
                    className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-cream/25 ${
                      right ? 'sm:col-start-2 sm:text-right' : 'sm:col-start-1'
                    }`}
                  >
                    <span
                      className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-cream/[0.06] text-orange ${
                        right ? 'sm:ml-auto' : ''
                      }`}
                    >
                      <Icon name={s.icon} size={20} />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-cream/65">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Highlights the step node as it reaches the viewport center.
function ScrollTriggerActivate(step) {
  const node = step.querySelector('[data-node]');
  if (!node) return;
  gsap.to(node, {
    scrollTrigger: {
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      toggleClass: { targets: node, className: 'is-active' },
    },
  });
}
