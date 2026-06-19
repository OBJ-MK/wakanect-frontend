import Logo from './Logo';
import Icon from './Icon';

const COLS = [
  {
    title: 'Produit',
    links: [
      ['Fonctionnalités', '#features'],
      ['Comment ça marche', '#how-it-works'],
      ['Démo', '#demo'],
      ['Tarifs', '#pricing'],
    ],
  },
  {
    title: 'Ressources',
    links: [
      ['Documentation', '/documentation'],
      ['API Reference', '/documentation'],
      ['Centre d’aide', '/documentation'],
      ['Blog', '/blog'],
    ],
  },
  {
    title: 'Entreprise',
    links: [
      ['À propos', '/about'],
      ['Nous contacter', '/contact'],
      ['Mentions légales', '/legal'],
      ['Confidentialité', '/privacy'],
    ],
  },
];

const SOCIAL = [
  ['facebook', 'Facebook'],
  ['twitter', 'X (Twitter)'],
  ['linkedin', 'LinkedIn'],
];

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-cream/10 bg-navy-deep">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-cream/55">
              Le commerce WhatsApp, automatisé. Vendez, encaissez et publiez — sans friction.
            </p>
            <p className="mt-4 text-xs text-cream/60">Sénégal · Mali · 2026</p>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(([icon, label]) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-cream/12 text-cream/70 transition-colors hover:border-orange/50 hover:text-orange"
                >
                  <Icon name={icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold text-cream">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="link-underline text-sm text-cream/60 hover:text-cream">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-cream/65">© 2026 Wakanect SAS. Tous droits réservés.</p>
          <p className="text-xs text-cream/65">
            Créé en Afrique de l'Ouest, pour l'Afrique de l'Ouest.
          </p>
        </div>
      </div>
    </footer>
  );
}
