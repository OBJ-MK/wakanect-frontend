import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import Button from './ui/Button';

const NAV = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Comment ça marche', href: '#how-it-works' },
  { label: 'Démo', href: '#demo' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = open ? 'hidden' : '';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-navy-dark/80 backdrop-blur-glass border-b border-cream/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-x flex h-[4.5rem] items-center justify-between" aria-label="Principale">
        <a href="#hero" className="shrink-0" aria-label="Wakanect — accueil">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="link-underline text-[0.95rem] text-cream/75 transition-colors hover:text-cream"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/login"
            className="link-underline text-[0.95rem] font-medium text-cream/80 hover:text-cream"
          >
            Se connecter
          </Link>
          <Button as={Link} to="/register" magnetic>
            Essayer gratuitement
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl text-cream transition-colors hover:bg-cream/10 lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <div
          className={`absolute inset-0 bg-navy-deep/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[min(86vw,22rem)] flex-col bg-navy border-l border-cream/10 px-6 pb-8 pt-5 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo size={30} />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-cream/80 hover:bg-cream/10"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="x" />
            </button>
          </div>

          <ul className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-lg text-cream/85 transition-colors hover:bg-cream/[0.06] hover:text-cream"
                >
                  {item.label}
                  <Icon name="arrowUpRight" size={18} className="text-orange" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <Button as={Link} to="/login" variant="ghost" size="lg" className="w-full" onClick={() => setOpen(false)}>
              Se connecter
            </Button>
            <Button as={Link} to="/register" size="lg" className="w-full" onClick={() => setOpen(false)}>
              Essayer gratuitement
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
