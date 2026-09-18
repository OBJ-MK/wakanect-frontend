import { useReveal } from '../hooks/useReveal';
import SectionHeading from './ui/SectionHeading';
import {Button} from './ui/Button';
import Icon from './Icon';

const INCLUDED = [
  'Boutique publique en ligne, prête à partager',
  'Parsing WhatsApp illimité — vos messages deviennent des produits',
  'Gestion complète des commandes',
  'Paiement direct par Wave, 0 % de commission',
  'Statistiques de vente (analytics)',
  "Ajout d'employés avec accès personnalisés",
  'Support pour vous accompagner au démarrage',
];

export default function Pricing() {
  const scope = useReveal();

  return (
    <section id="pricing" ref={scope} className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="L'offre de lancement"
          title="Un seul plan : tout, gratuitement, pendant 2 mois."
          intro="On lance Wakanect avec les commerçants pilotes de Dakar et Bamako. Pas de carte bancaire, pas de piège."
        />

        <div className="mx-auto mt-14 max-w-lg">
          <article
            data-reveal
            className="relative overflow-hidden rounded-[2rem] border-2 border-orange/60 bg-cream/[0.04] p-8 text-center shadow-glow sm:p-10"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-warm px-3 py-1 text-xs font-bold text-cream shadow-glow">
              Offre de lancement
            </span>

            <h3 className="font-display text-2xl font-extrabold text-cream sm:text-3xl">
              Test gratuit — 2 mois
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-cream/65">
              Accès complet à toutes les fonctionnalités, sans carte bancaire, sans engagement.
              Vous arrêtez quand vous voulez.
            </p>

            <ul className="mt-8 flex flex-col gap-3 text-left">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-cream/85">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-orange" />
                  {f}
                </li>
              ))}
            </ul>

            <Button as="a" href="#hero" size="lg" magnetic className="mt-9 w-full">
              Démarrer mon test gratuit
              <Icon name="arrowRight" size={18} />
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
