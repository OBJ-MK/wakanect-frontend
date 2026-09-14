import { useReveal } from '../hooks/useReveal';
import Icon from './Icon';

// Pas de chiffres d'usage ici (nombre de marchands, vitesse, taux de rétention) —
// tant qu'on n'a pas de données réelles issues des tests, on ne met en avant que
// des faits structurels du produit, vérifiables indépendamment du volume d'usage.
const CHIPS = [
  { icon: 'card', text: '0% de commission — paiement direct via Wave' },
  { icon: 'shield', text: 'Données isolées par tenant · TLS/HTTPS' },
  { icon: 'smartphone', text: 'Zéro compte client = zéro friction' },
  { icon: 'globe', text: "Construit en Afrique de l'Ouest" },
];

export default function TrustSignals() {
  const scope = useReveal();
  return (
    <section ref={scope} className="relative py-20 sm:py-24">
      <div className="container-x">
        <div className="flex flex-wrap justify-center gap-3">
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