import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { usePlans } from '@/hooks/usePlans';
import SectionHeading from './ui/SectionHeading';
import Button from './ui/Button';
import Icon from './Icon';

// `price` sert de repli si l'API /api/plans est indisponible — sinon le prix
// mensuel réel (éditable via l'admin) est affiché à la place.
const PLANS = [
  {
    key: 'free',
    name: 'Gratuit',
    price: '0',
    cycle: 'pour toujours',
    desc: 'Pour tester et lancer votre première boutique.',
    features: ['10 scans WhatsApp / mois', 'Parsing regex', '1 boutique', 'Support email'],
    cta: 'Commencer gratuitement',
    variant: 'ghost',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '50 000',
    cycle: 'XOF / mois',
    desc: 'Pour les commerçants qui vendent au quotidien.',
    features: [
      '200 scans WhatsApp / mois',
      'Parsing IA avec escalade',
      "Jusqu'à 5 boutiques",
      'Cloudflare Workers AI',
      'Support prioritaire',
    ],
    cta: 'Essayer 7 jours',
    variant: 'primary',
    featured: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '200 000',
    cycle: 'XOF / mois',
    desc: "Pour les volumes élevés et l'intégration sur mesure.",
    features: [
      '1 000 scans WhatsApp / mois',
      'Parsing Claude Haiku illimité',
      "Jusqu'à 20 boutiques",
      'API & webhooks personnalisés',
      'Support 24/5',
    ],
    cta: "Contacter l'équipe",
    variant: 'ghost',
  },
];

const MATRIX = [
  ['Scans / mois', '10', '200', '1 000'],
  ['Parsing regex', true, true, true],
  ['Cloudflare AI', false, true, true],
  ['Claude Haiku', false, true, true],
  ['Boutiques', '1', '5', '20'],
  ['Support', 'Email', 'Prioritaire', '24/5'],
];

function Cell({ v }) {
  if (v === true) return <Icon name="check" size={18} className="mx-auto text-status-success" />;
  if (v === false) return <Icon name="x" size={16} className="mx-auto text-cream/25" />;
  return <span className="text-cream/85">{v}</span>;
}

export default function Pricing() {
  const scope = useReveal();
  const { data } = usePlans();

  function priceFor(p) {
    const live = data?.plans?.find(pl => pl.key === p.key)?.prices?.month;
    if (live == null) return p.price; // repli pendant le chargement ou si l'API échoue
    return live === 0 ? '0' : live.toLocaleString('fr-FR');
  }

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
          {PLANS.map((p) => (
            <article
              key={p.name}
              data-reveal
              className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
                p.featured
                  ? 'border-2 border-orange/60 bg-cream/[0.04] shadow-glow lg:-translate-y-3'
                  : 'glass hover:border-cream/25 hover:-translate-y-1'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-warm px-3 py-1 text-xs font-bold text-cream shadow-glow">
                  Recommandé
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-cream">{p.name}</h3>
              <p className="mt-1 text-sm text-cream/55">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold text-cream">{priceFor(p)}</span>
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
                magnetic={p.featured}
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
                {['Gratuit', 'Pro', 'Premium'].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-center font-display font-bold ${
                      h === 'Pro' ? 'text-orange' : 'text-cream'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr key={row[0]} className={i % 2 ? 'bg-cream/[0.02]' : ''}>
                  <td className="px-6 py-3.5 text-cream/70">{row[0]}</td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell v={row[1]} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell v={row[2]} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell v={row[3]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
