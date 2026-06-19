import { lazy, Suspense, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import Header from './components/Header';
import Hero from './components/Hero';
import '@/styles/landing.css';

// Below-the-fold sections are split out so only Header + Hero load first.
const ValueProps = lazy(() => import('./components/ValueProps'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const ParserDemo = lazy(() => import('./components/ParserDemo'));
const Pricing = lazy(() => import('./components/Pricing'));
const TrustSignals = lazy(() => import('./components/TrustSignals'));
const Faq = lazy(() => import('./components/Faq'));
const FinalCta = lazy(() => import('./components/FinalCta'));
const Footer = lazy(() => import('./components/Footer'));
const StickyCta = lazy(() => import('./components/StickyCta'));

export default function LandingPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div className="landing-root">
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="main">
        <Hero />
        {hydrated && (
          <Suspense fallback={null}>
            <ValueProps />
            <HowItWorks />
            <ParserDemo />
            <TrustSignals />
            <Pricing />
            <Faq />
            <FinalCta />
          </Suspense>
        )}
      </main>
      {hydrated && (
        <Suspense fallback={null}>
          <Footer />
          <StickyCta />
        </Suspense>
      )}
    </div>
  );
}
