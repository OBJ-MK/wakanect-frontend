import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, MessageCircle, Package, ShoppingBag, Zap } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

const SLIDES = [
  {
    icon: Zap,
    iconBg: 'bg-orange/15',
    iconColor: 'text-orange',
    gradient: 'from-orange/20 via-transparent to-transparent',
    title: 'Bienvenue sur Wakanect',
    subtitle: 'Gérez votre boutique WhatsApp comme un pro, depuis votre téléphone.',
    cta: 'Commencer',
  },
  {
    icon: MessageCircle,
    iconBg: 'bg-wa-green/15',
    iconColor: 'text-wa-green',
    gradient: 'from-wa-green/15 via-transparent to-transparent',
    title: 'Transférez vos produits',
    subtitle: "Envoyez simplement un message WhatsApp décrivant un produit au numéro Wakanect. L'IA s'occupe du reste.",
    cta: 'Suivant',
  },
  {
    icon: Package,
    iconBg: 'bg-amber/15',
    iconColor: 'text-amber',
    gradient: 'from-amber/15 via-transparent to-transparent',
    title: 'Catalogue automatique',
    subtitle: 'Vos produits sont analysés, organisés et publiés dans votre boutique en ligne en quelques secondes.',
    cta: 'Suivant',
  },
  {
    icon: ShoppingBag,
    iconBg: 'bg-emerald/15',
    iconColor: 'text-emerald',
    gradient: 'from-emerald/15 via-transparent to-transparent',
    title: 'Vendez & encaissez',
    subtitle: 'Vos clients commandent en ligne, vous payez directement sur Wave. Tout est suivi dans l\'app.',
    cta: 'Créer mon compte',
  },
]

export function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  function next() {
    if (isLast) {
      navigate('/register')
    } else {
      setCurrent(c => c + 1)
    }
  }

  function skip() {
    navigate('/login')
  }

  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col">
      {/* Skip */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <WakanectLogo variant="mark" className="h-8 w-8" />
        {!isLast && (
          <button
            onClick={skip}
            className="text-label text-white/40 hover:text-white/70 transition-colors px-2 py-1"
          >
            Ignorer
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Illustration area */}
        <div className={`relative w-48 h-48 rounded-full bg-gradient-radial ${slide.gradient} flex items-center justify-center mb-10`}>
          <div className={`w-24 h-24 rounded-3xl ${slide.iconBg} flex items-center justify-center`}>
            <slide.icon size={44} className={slide.iconColor} />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div className="absolute inset-4 rounded-full border border-white/4" />
        </div>

        {/* Text */}
        <div className="text-center max-w-xs">
          <h1 className="font-display font-bold text-h1 text-white mb-3">
            {slide.title}
          </h1>
          <p className="text-body text-white/55 leading-relaxed">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-5 pb-10 flex flex-col items-center gap-6">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-orange' : 'w-2 h-2 bg-white/20'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
        >
          {slide.cta}
          <ChevronRight size={18} />
        </button>

        {isLast && (
          <button
            onClick={skip}
            className="text-label text-white/40 hover:text-white/60 transition-colors"
          >
            J'ai déjà un compte → Connexion
          </button>
        )}
      </div>
    </div>
  )
}
