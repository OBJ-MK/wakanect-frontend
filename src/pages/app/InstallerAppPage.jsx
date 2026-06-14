import { Link } from 'react-router-dom'
import { ChevronLeft, Smartphone } from 'lucide-react'

const STEPS = [
  {
    n: 1,
    title: 'Appuie sur le menu ⋮',
    desc: 'En haut à droite de Chrome (les trois points).',
  },
  {
    n: 2,
    title: 'Choisis « Ajouter à l\'écran d\'accueil »',
    desc: 'Puis confirme avec « Ajouter ».',
  },
  {
    n: 3,
    title: 'C\'est fait ✓',
    desc: 'L\'icône Wakanect apparaît sur ton écran d\'accueil.',
  },
]

export function InstallerAppPage() {
  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Installe l'app</h1>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Intro */}
        <div className="glass rounded-3xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center shrink-0">
            <Smartphone size={22} className="text-white/60" />
          </div>
          <div className="flex-1">
            <p className="text-body font-semibold text-white">Ajoute Wakanect à ton écran d'accueil</p>
            <p className="text-micro text-white/40 mt-0.5">Ouvre-la comme une vraie app, même sans connexion.</p>
          </div>
        </div>

        {/* Android Chrome */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-3 px-1">
            Sur Android (Chrome)
          </p>

          {/* Mockup navigateur */}
          <div className="glass rounded-3xl overflow-hidden border border-white/8 mb-4">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
              </div>
              <div className="flex-1 h-4 bg-white/8 rounded-lg" />
              <div className="flex flex-col gap-0.5 p-1 border border-white/20 rounded-md">
                <div className="w-2.5 h-0.5 bg-white/40 rounded-full" />
                <div className="w-2.5 h-0.5 bg-white/40 rounded-full" />
                <div className="w-2.5 h-0.5 bg-white/40 rounded-full" />
              </div>
            </div>
            <div className="h-14 flex items-center justify-center bg-white/2">
              <p className="text-micro text-white/25">ta boutique Wakanect</p>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-4 border-b border-white/6 last:border-0"
              >
                <div className="w-7 h-7 rounded-full bg-white text-navy-deep flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">
                  {step.n}
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-white">{step.title}</p>
                  <p className="text-micro text-white/45 mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note iPhone */}
        <div className="glass rounded-3xl p-4 border border-white/8">
          <p className="text-label text-white/55 leading-relaxed">
            <span className="font-semibold text-white">Sur iPhone (Safari) :</span>{' '}
            appuie sur Partager ⬆ puis « Sur l'écran d'accueil ».
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="py-4 rounded-2xl bg-white text-navy-deep font-bold text-body hover:opacity-90 active:scale-95 transition-all"
        >
          J'ai installé l'app
        </button>
      </div>
    </div>
  )
}
