import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import SectionHeading from './ui/SectionHeading';
import Icon from './Icon';

const ITEMS = [
  {
    q: "Pourquoi aucun compte client n'est requis ?",
    a: "Les comptes créent de la friction. En Afrique de l'Ouest, les clients veulent acheter vite, sans mot de passe. La confirmation de paiement Wave suffit : plus simple, plus de conversions.",
  },
  {
    q: 'Comment fonctionne le parsing des produits ?',
    a: "Trois niveaux : regex (gratuit), Cloudflare Workers AI (Pro), puis Claude Haiku (Premium). Si un niveau n'est pas assez confiant, il escalade. Vous voyez toujours le score et corrigez si besoin.",
  },
  {
    q: "Où va l'argent de mes clients ?",
    a: "Directement sur votre compte Wave. Wakanect n'intervient jamais dans la transaction. Zéro commission sur les ventes — vous ne payez que votre abonnement.",
  },
  {
    q: 'Combien de boutiques puis-je créer ?',
    a: 'Cela dépend du plan : Gratuit = 1, Pro = 5, Premium = 20. Chacune a sa propre URL publique et son catalogue.',
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
    q: 'Y a-t-il une période d’essai ?',
    a: "Le plan Gratuit l'est pour toujours (10 scans/mois). Le plan Pro offre 7 jours gratuits, sans carte bancaire.",
  },
];

export default function Faq() {
  const scope = useReveal();
  const [open, setOpen] = useState(0);

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
          {ITEMS.map((item, i) => {
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
