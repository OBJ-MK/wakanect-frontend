import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { usePlans } from '@/hooks/usePlans';
import Button from './ui/Button';
import Icon from './Icon';
import { LogoMark } from './Logo';

export default function FinalCta() {
  const scope = useReveal();
  const { data } = usePlans({ country: 'SN' });
  const trialDays = data?.trial?.days ?? 14;

  return (
    <section ref={scope} className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="grain relative overflow-hidden rounded-[2rem] border border-cream/10 bg-navy px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* glow */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-orange/20 blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 h-48 w-72 rounded-full bg-amber/15 blur-[100px]" />
          </div>

          <div className="relative">
            <span data-reveal className="mx-auto inline-flex">
              <LogoMark size={52} />
            </span>
            <h2 data-reveal className="mx-auto mt-7 max-w-2xl font-display text-display-md font-bold">
              Prêt à lancer votre boutique ?
            </h2>
            <p data-reveal className="mx-auto mt-5 max-w-lg text-lg text-cream/65">
              Accès Premium complet pendant {trialDays} jours — sans carte bancaire.
              Votre premier produit est en ligne en quelques minutes.
            </p>
            <div data-reveal className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/register" size="lg" magnetic>
                Essayer gratuitement
                <Icon name="arrowRight" size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button as={Link} to="/login" variant="ghost" size="lg">
                J'ai déjà un compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
