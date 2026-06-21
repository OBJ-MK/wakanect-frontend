import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { usePlans } from '@/hooks/usePlans';
import SectionHeading from './ui/SectionHeading';
import Button from './ui/Button';
import Icon from './Icon';

// ── Helpers ──────────────────────────────────────────────────────────────────

function empLabel(max) {
  if (max === 0)  return '—';
  if (max === -1) return '∞';
  return max.toLocaleString('fr-FR');
}

function supportLabel(flags) {
  return flags?.priority_support ? 'Prioritaire 24h' : 'Email';
}

function buildMatrix(plans) {
  const [free, pro, prem] = plans;
  return [
    ['Scans / mois',
      free.scan_quota.toLocaleString('fr-FR'),
      pro.scan_quota.toLocaleString('fr-FR'),
      prem.scan_quota.toLocaleString('fr-FR')],
    ['Parsing regex',  true,  true,  true],
    ['Cloudflare AI',  false, true,  true],
    ['Claude Haiku',   false, true,  true],
    ['Employés',
      empLabel(free.max_employees),
      empLabel(pro.max_employees),
      empLabel(prem.max_employees)],
    ['Support',
      supportLabel(free.features_flags),
      supportLabel(pro.features_flags),
      supportLabel(prem.features_flags)],
  ];
}

// Fallback statique affiché si /api/plans est indisponible
const FALLBACK_PLANS = [
  {
    key: 'free', name: 'Gratuit', prices_month: 0, cycle: 'pour toujours',
    desc: 'Pour tester Wakanect gratuitement.',
    features: ['100 scans / mois', 'Boutique publique', 'Gestion des commandes'],
    cta: 'Commencer gratuitement', variant: 'ghost', highlight: false,
  },
  {
    key: 'pro', name: 'Pro', prices_month: 5000, cycle: 'XOF / mois',
    desc: 'Pour les commerçants qui vendent au quotidien.',
    features: ['3 000 scans / mois', 'Gestion des commandes', 'Employés (max 2)', 'Analytics avancées'],
    cta: 'Essayer 14 jours', variant: 'primary', highlight: true,
  },
  {
    key: 'premium', name: 'Premium', prices_month: 15000, cycle: 'XOF / mois',
    desc: 'Pour les volumes élevés.',
    features: ['15 000 scans / mois', 'Gestion des commandes', 'Employés (max 50)', 'Catalogue complet', 'Support prioritaire 24h'],
    cta: 'Choisir ce plan', variant: 'ghost', highlight: false,
  },
];

const FALLBACK_MATRIX = [
  ['Scans / mois',  '100',  '3 000',  '15 000'],
  ['Parsing regex', true,   true,     true],
  ['Cloudflare AI', false,  true,     true],
  ['Claude Haiku',  false,  true,     true],
  ['Employés',      '—',    '2',      '50'],
  ['Support',       'Email','Email',  'Prioritaire 24h'],
];

function Cell({ v }) {
  if (v === true)  return <Icon name="check" size={18} className="mx-auto text-status-success" />;
  if (v === false) return <Icon name="x"     size={16} className="mx-auto text-cream/25" />;
  return <span className="text-cream/85">{v}</span>;
}

// ── Composant ─────────────────────────────────────────────────────────────────

export default function Pricing() {
  const scope = useReveal();
  const { data } = usePlans();

  const trialDays = data?.trial?.days ?? 14;

  const plansToDisplay = useMemo(() => {
    if (!data?.plans) return FALLBACK_PLANS;
    return data.plans.map(p => ({
      key:          p.key,
      name:         p.name,
      prices_month: p.prices?.month ?? 0,
      cycle:        p.key === 'free' ? 'pour toujours' : 'XOF / mois',
      desc:
        p.key === 'free'
          ? 'Pour tester Wakanect gratuitement.'
          : p.key === 'pro'
          ? 'Pour les commerçants qui vendent au quotidien.'
          : 'Pour les volumes élevés.',
      features: p.features ?? [],
      cta:
        p.key === 'free'
          ? 'Commencer gratuitement'
          : p.key === 'pro'
          ? `Essayer ${trialDays} jours`
          : 'Choisir ce plan',
      variant:   p.key === 'pro' ? 'primary' : 'ghost',
      highlight: p.highlight ?? false,
    }));
  }, [data, trialDays]);

  const matrix = useMemo(
    () => (data?.plans ? buildMatrix(data.plans) : FALLBACK_MATRIX),
    [data]
  );

  return (
    <section id="pricing" ref={scope} className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Tarifs"
          title="Vous payez l'outil. Jamais vos ventes."
          intro="Zéro commission sur les transactions de vos clients. Vous ne payez qu'un abonnement clair, en francs CFA. Les produits publiés restent en ligne, même après le quota."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-start">
          {plansToDisplay.map((p) => (
            <article
              key={p.key}
              data-reveal
              className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
                p.highlight
                  ? 'border-2 border-orange/60 bg-cream/[0.04] shadow-glow lg:-translate-y-3'
                  : 'glass hover:border-cream/25 hover:-translate-y-1'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-warm px-3 py-1 text-xs font-bold text-cream shadow-glow">
                  Recommandé
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-cream">{p.name}</h3>
              <p className="mt-1 text-sm text-cream/55">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold text-cream">
                  {p.prices_month === 0 ? '0' : p.prices_month.toLocaleString('fr-FR')}
                </span>
                <span className="text-sm text-amber">{p.cycle}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream/80">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-orange" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                to="/register"
                variant={p.variant}
                size="lg"
                magnetic={p.highlight}
                className="mt-8 w-full"
              >
                {p.cta}
              </Button>
            </article>
          ))}
        </div>

        {/* Comparison matrix — desktop */}
        <div data-reveal className="mt-14 hidden overflow-hidden rounded-3xl glass lg:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/10 text-left">
                <th className="px-6 py-4 font-medium text-cream/60">Comparer les plans</th>
                {plansToDisplay.map((p) => (
                  <th
                    key={p.key}
                    className={`px-6 py-4 text-center font-display font-bold ${
                      p.highlight ? 'text-orange' : 'text-cream'
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={row[0]} className={i % 2 ? 'bg-cream/[0.02]' : ''}>
                  <td className="px-6 py-3.5 text-cream/70">{row[0]}</td>
                  <td className="px-6 py-3.5 text-center"><Cell v={row[1]} /></td>
                  <td className="px-6 py-3.5 text-center"><Cell v={row[2]} /></td>
                  <td className="px-6 py-3.5 text-center"><Cell v={row[3]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
