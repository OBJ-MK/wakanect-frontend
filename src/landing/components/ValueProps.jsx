import { useReveal } from '../hooks/useReveal';
import SectionHeading from './ui/SectionHeading';
import Icon from './Icon';
import { LogoMark } from './Logo';
import Img from './ui/Img';

const CARDS = [
  {
    icon: 'zap',
    title: 'Parsing en temps réel',
    desc: "L'IA extrait nom, prix, tailles et couleurs. Vous validez, c'est en ligne.",
  },
  {
    icon: 'card',
    title: 'Paiement Wave direct',
    desc: 'Les clients paient le commerçant directement. Wakanect ne prélève rien sur vos ventes.',
  },
  {
    icon: 'store',
    title: 'Vitrine publique',
    desc: 'Une URL publique unique pour chaque boutique, prête à partager. Aucune configuration technique.',
  },
  {
    icon: 'smartphone',
    title: 'Pensé pour la 3G',
    desc: 'Léger, rapide, hors-ligne. Optimisé pour les réseaux ouest-africains.',
  },
  {
    icon: 'globe',
    title: 'Paiements locaux',
    desc: "Wave aujourd'hui. Orange Money et Airtel Money bientôt.",
  },
];

export default function ValueProps() {
  const scope = useReveal();

  return (
    <section id="features" ref={scope} className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Pourquoi Wakanect"
          title="Tout le commerce. Aucune complexité."
          intro="Vous gérez déjà vos ventes sur WhatsApp. Wakanect ajoute la vitrine, la structure et l'encaissement — sans rien changer à vos habitudes."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Featured card */}
          <article
            data-reveal
            className="group glass relative col-span-1 overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:border-cream/25 hover:-translate-y-1 md:col-span-2 lg:col-span-4 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/15 opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex h-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-warm text-cream shadow-glow">
                <Icon name="message" size={22} />
              </span>
              <h3 className="mt-6 max-w-md font-display text-2xl font-bold sm:text-[1.9rem]">
                Publiez un produit en envoyant un simple message.
              </h3>
              <p className="mt-3 max-w-md text-cream/65">
                Décrivez l'article comme vous le feriez à un client. Wakanect comprend le
                français, les variantes locales de prix et les emojis.
              </p>

              {/* Mini transform illustration */}
              <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-2xl rounded-br-sm bg-[#005c4b]/90 px-4 py-3 text-sm text-cream/90">
                  « Sac cuir marron, 18.000 F, 3 dispo »
                </div>
                <span className="hidden place-items-center text-amber sm:grid">
                  <Icon name="arrowRight" size={22} />
                </span>
                <div className="glass flex items-center gap-3 rounded-2xl p-2.5">
                  <Img
                    src="/images/product-sac.jpg"
                    alt="Sac en cuir marron"
                    width={200}
                    height={200}
                    className="h-10 w-10 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cream">Sac Cuir Marron</p>
                    <p className="text-sm font-bold text-orange">18 000 XOF</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[0.65rem] font-semibold text-status-success">
                    <LogoMark size={14} /> live
                  </span>
                </div>
              </div>
            </div>
          </article>

          {CARDS.map((c) => (
            <article
              key={c.title}
              data-reveal
              className="group glass relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:border-cream/25 hover:-translate-y-1 md:col-span-1 lg:col-span-2"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream/[0.06] text-orange transition-colors duration-300 group-hover:bg-orange/15">
                <Icon name={c.icon} size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-cream">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
