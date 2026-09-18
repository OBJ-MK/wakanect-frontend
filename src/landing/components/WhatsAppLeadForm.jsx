import { useState } from 'react';

// Numéro de campagne — pas d'API, juste un générateur de lien wa.me.
const PHONE = '221706425477';

function WhatsAppGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

/**
 * Générateur de lien wa.me — Prénom + Nom → message pré-rempli.
 * Pas de backend, pas d'API, pas de stockage : purement client.
 * Rendu une seule fois dans le DOM (Hero) ; les autres CTA scrollent vers #hero.
 */
export default function WhatsAppLeadForm({ className = '' }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const valid = firstName.trim() !== '' && lastName.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    const message = `Bonjour, je suis ${firstName.trim()} ${lastName.trim()}. Je souhaite tester Wakanect gratuitement pendant 2 mois. JE TESTE`;
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`} noValidate>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          aria-label="Prénom"
          autoComplete="given-name"
          className="h-12 w-full min-w-0 rounded-xl border border-cream/15 bg-cream/[0.04] px-4 text-cream placeholder:text-cream/40 outline-none transition focus:border-amber/60 focus:ring-2 focus:ring-orange/20"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          aria-label="Nom"
          autoComplete="family-name"
          className="h-12 w-full min-w-0 rounded-xl border border-cream/15 bg-cream/[0.04] px-4 text-cream placeholder:text-cream/40 outline-none transition focus:border-amber/60 focus:ring-2 focus:ring-orange/20"
        />
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-wa-green font-display font-semibold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-green"
      >
        <WhatsAppGlyph className="h-5 w-5" />
        Envoyer sur WhatsApp
      </button>
    </form>
  );
}
