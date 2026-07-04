import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { usePlans } from '@/hooks/usePlans';
import SectionHeading from './ui/SectionHeading';
import Icon from './Icon';

function empLabel(max) {
  if (max === 0)  return 'aucun';
  if (max === -1) return 'sans limite';
  return String(max);
}

function buildItems(data) {
  const trialDays = data?.trial?.days ?? 14;
  const plans     = data?.plans;

  // Lookup par clé pour éviter tout crash si l'ordre ou le nombre de plans change
  const planMap = plans ? Object.fromEntries(plans.map(p => [p.key, p])) : {};
  const free    = planMap.free;
  const pro     = planMap.pro;
  const prem    = planMap.premium;
  const hasAll  = free && pro && prem;

  return [
    {
      q: "Pourquoi aucun compte client n'est requis ?",
      a: "Les comptes créent de la friction. En Afrique de l'Ouest, les clients veulent acheter vite, sans mot de passe. La confirmation de paiement Wave suffit : plus simple, plus de conversions.",
    },
    {
      q: 'Comment fonctionne le parsing des produits ?',
      a: "Trois niveaux : regex (Gratuit), Cloudflare Workers AI (Pro), puis Claude Haiku (Premium). Si un niveau n'est pas assez confiant, il escalade. Vous voyez toujours le score et corrigez si besoin.",
    },
    {
      q: "Où va l'argent de mes clients ?",
      a: "Directement sur votre compte Wave. Wakanect n'intervient jamais dans la transaction. Zéro commission sur les ventes — vous ne payez que votre abonnement.",
    },
    {
      q: "Combien d'employés puis-je ajouter ?",
      a: hasAll
        ? `Cela dépend de votre plan : Gratuit = ${empLabel(free.max_employees)}, Pro = ${empLabel(pro.max_employees)}, Premium = ${empLabel(prem.max_employees)}. Chaque employé peut scanner les messages et gérer les commandes selon les permissions que vous lui accordez.`
        : "Cela dépend de votre plan : Gratuit = aucun, Pro = 2, Premium = 50. Chaque employé peut scanner les messages et gérer les commandes selon les permissions que vous lui accordez.",
    },
    {
      q: 'Que se passe-t-il une fois mon quota de scans atteint ?',
      a: "Vos produits déjà validés restent publiés indéfiniment. Seul le nombre de nouveaux messages analysés est limité chaque mois.",
    },
    {
      q: 'En quelle langue fonctionne le parsing ?',
      a: 'Français au lancement. Le moteur comprend les variantes locales de prix (25k, 25 mille, vingt-cinq mille). Bambara et Pulaar arrivent en phase 2.',
    },
    {
      q: "Y a-t-il une période d'essai ?",
      a: `Oui — ${trialDays} jours d'accès complet (niveau Premium), sans carte bancaire. Après l'essai, vous choisissez un plan payant ou restez sur le plan Gratuit.`,
    },
  ];
}

export default function Faq() {
  const scope = useReveal();
  const [open, setOpen] = useState(0);
  const { data } = usePlans({ country: 'SN' });

  const items = buildItems(data);

  return (
    <section id="faq" ref={scope} className="relative py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Ce que vous vous demandez, sûrement."
            intro="Une question qui n'est pas ici ?"
          />
          <a
            href="mailto:contact@wakanect.com"
            className="link-underline mt-2 inline-flex items-center gap-1.5 font-medium text-orange hover:text-amber"
          >
            Écrivez-nous <Icon name="arrowUpRight" size={16} />
          </a>
        </div>

        <ul className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal className="glass overflow-hidden rounded-2xl">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-semibold text-cream sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream/[0.06] text-orange transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <Icon name="chevron" size={18} />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-cream/65 sm:px-6 sm:pb-6">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
