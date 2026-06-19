import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { parseProduct } from '../lib/parseProduct';
import { useReveal } from '../hooks/useReveal';
import SectionHeading from './ui/SectionHeading';
import Icon from './Icon';

const SAMPLE = 'Chemise bleu roi, tailles S M L XL, 25.000 F, 5 pièces dispo';
const ALT = [
  'Robe wax bleu ciel 🌸 S M L, 18 mille, 8 dispo',
  'Sneakers blanc cassé, 40 41 42, 35.000 XOF, stock 12',
  'Sac cuir marron, prix 22000 F, 4 pièces',
];

function confColor(c) {
  if (c === 0) return 'var(--cream)';
  if (c < 40) return '#EF4444';
  if (c < 70) return '#FFB347';
  return '#10B981';
}

export default function ParserDemo() {
  const scope = useReveal();
  const [text, setText] = useState(SAMPLE);
  const [result, setResult] = useState(null);
  const [altIdx, setAltIdx] = useState(0);
  const outRef = useRef(null);

  const run = (value) => {
    const parsed = parseProduct((value ?? text).trim() || SAMPLE);
    setResult(parsed);
  };

  // Animate bars + overall whenever a new result lands.
  useLayoutEffect(() => {
    if (!result || !outRef.current) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-bar]', { width: (_i, el) => el.dataset.target + '%' });
        const ring = outRef.current.querySelector('[data-overall]');
        if (ring) ring.textContent = result.overall + '%';
        return;
      }
      gsap.fromTo(
        '[data-row]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
      gsap.fromTo(
        '[data-bar]',
        { width: '0%' },
        {
          width: (_i, el) => el.dataset.target + '%',
          duration: 1,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
      const counter = { v: 0 };
      gsap.to(counter, {
        v: result.overall,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          const ring = outRef.current?.querySelector('[data-overall]');
          if (ring) ring.textContent = Math.round(counter.v) + '%';
        },
      });
    }, outRef);
    return () => ctx.revert();
  }, [result]);

  const tryAlt = () => {
    const next = ALT[altIdx % ALT.length];
    setText(next);
    setAltIdx((i) => i + 1);
    run(next);
  };

  const ready = result && result.overall >= 60;

  return (
    <section id="demo" ref={scope} className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-orange/10 blur-[120px]" />
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Essayez maintenant"
          title="Écrivez un message. Voyez la structure."
          intro="Le même moteur de parsing que vos clients ne verront jamais — mais qui travaille pour vous à chaque message."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 lg:grid-cols-2">
          {/* Input */}
          <div data-reveal className="glass flex flex-col rounded-3xl p-5 sm:p-6">
            <label htmlFor="parse-input" className="text-sm font-medium text-cream/70">
              Message produit (WhatsApp)
            </label>
            <textarea
              id="parse-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              spellCheck={false}
              className="mt-3 w-full resize-none rounded-xl border border-cream/15 bg-navy-deep px-4 py-3 text-cream placeholder:text-cream/55 outline-none transition focus:border-amber/60 focus:ring-2 focus:ring-orange/20"
              placeholder="Ex : Chemise bleu roi, S M L XL, 25.000 F, 5 dispo"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => run()}
                className="group inline-flex h-11 items-center gap-2 rounded-xl bg-orange px-5 font-medium text-navy-deep transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <Icon name="zap" size={18} />
                Analyser ce message
              </button>
              <button
                type="button"
                onClick={tryAlt}
                className="link-underline text-sm font-medium text-cream/70 hover:text-cream"
              >
                Essayer un autre exemple
              </button>
            </div>
          </div>

          {/* Output */}
          <div ref={outRef} data-reveal className="glass rounded-3xl p-5 sm:p-6">
            {!result ? (
              <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center text-cream/60">
                <Icon name="cpu" size={32} className="text-cream/30" />
                <p className="mt-3 max-w-[18rem] text-sm">
                  Cliquez sur « Analyser » pour voir les champs extraits et leur score de confiance.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cream/70">Produit structuré</span>
                  <span
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: ready ? 'var(--wa)' : '#FFB347',
                      background: ready ? 'rgba(37,211,102,0.12)' : 'rgba(255,179,71,0.12)',
                    }}
                  >
                    <Icon name={ready ? 'checkCircle' : 'sparkles'} size={14} />
                    {ready ? 'Prêt à publier' : 'À compléter'}
                  </span>
                </div>

                <ul className="mt-5 space-y-3.5">
                  {result.fields.map((f) => (
                    <li key={f.key} data-row>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-cream/65">
                          {f.label}
                        </span>
                        {f.value ? (
                          Array.isArray(f.value) ? (
                            <span className="flex flex-wrap justify-end gap-1">
                              {f.value.map((v) => (
                                <span
                                  key={v}
                                  className="rounded-md border border-cream/20 px-1.5 py-0.5 text-xs text-cream/85"
                                >
                                  {v}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="text-right text-sm font-semibold text-cream">{f.value}</span>
                          )
                        ) : (
                          <span className="text-xs italic text-cream/65">non détecté</span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                        <div
                          data-bar
                          data-target={f.conf}
                          className="h-full rounded-full"
                          style={{ width: 0, background: confColor(f.conf) }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-4">
                  <span className="text-sm text-cream/60">Confiance globale</span>
                  <span
                    data-overall
                    className="font-display text-2xl font-bold"
                    style={{ color: confColor(result.overall) }}
                  >
                    0%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
