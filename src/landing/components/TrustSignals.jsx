import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { useReveal } from '../hooks/useReveal';
import Icon from './Icon';
import Img from './ui/Img';

const STATS = [
  { to: 500, suffix: '+', label: 'commerçants accompagnés' },
  { to: 0, suffix: '%', label: 'commission sur vos ventes' },
  { to: 1.2, suffix: 's', label: 'pour structurer un produit', decimals: 1 },
  { to: 100, suffix: '%', label: 'des produits restent publiés' },
];

const CHIPS = [
  { icon: 'shield', text: 'Données isolées par tenant · TLS/HTTPS' },
  { icon: 'smartphone', text: 'Zéro compte client = zéro friction' },
  { icon: 'card', text: 'Paiements directs via Wave' },
  { icon: 'globe', text: "Construit en Afrique de l'Ouest" },
];

function Stat({ to, suffix, label, decimals = 0 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const fmt = (v) => (decimals ? v.toFixed(decimals).replace('.', ',') : Math.round(v).toString());
    if (prefersReducedMotion) {
      el.textContent = fmt(to) + suffix;
      return;
    }
    const obj = { v: 0 };
    const tw = gsap.to(obj, {
      v: to,
      duration: 1.4,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => (el.textContent = fmt(obj.v) + suffix),
    });
    const st = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } }).add(() => tw.play());
    }, ref);
    return () => st.revert();
  }, [to, suffix, label, decimals]);

  return (
    <div data-reveal className="text-center sm:text-left">
      <div ref={ref} className="font-display text-4xl font-extrabold text-gradient-warm sm:text-5xl">
        0{suffix}
      </div>
      <p className="mt-2 text-sm text-cream/60">{label}</p>
    </div>
  );
}

export default function TrustSignals() {
  const scope = useReveal();
  return (
    <section ref={scope} className="relative py-20 sm:py-24">
      <div className="container-x">
        <div data-reveal className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Img
                key={i}
                src={`/images/merchant-${i}.jpg`}
                alt={`Commerçante ${i} utilisant Wakanect`}
                width={96}
                height={96}
                className="h-11 w-11 rounded-full ring-2 ring-navy-deep"
              />
            ))}
          </div>
          <p className="text-sm text-cream/65">
            Ils vendent déjà avec Wakanect en Afrique de l'Ouest
          </p>
        </div>

        <div className="glass grid grid-cols-2 gap-8 rounded-3xl p-8 sm:p-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {CHIPS.map((c) => (
            <span
              key={c.text}
              data-reveal
              className="inline-flex items-center gap-2 rounded-full border border-cream/12 bg-cream/[0.03] px-4 py-2 text-sm text-cream/75"
            >
              <Icon name={c.icon} size={16} className="text-orange" />
              {c.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
