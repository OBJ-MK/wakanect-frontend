import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Copy, Check, MessageCircle, Send, Package, Sparkles } from 'lucide-react'

const WAKANECT_NUMBER = '+221 77 XXX XX XX'
const WAKANECT_RAW = '221770000000'

const STEPS = [
  {
    icon: Send,
    color: 'bg-orange/12 text-orange',
    title: 'Transférez votre message',
    desc: "Dans WhatsApp, transférez le message décrivant votre produit (nom, prix, quantité, tailles…) au numéro Wakanect ci-dessus.",
  },
  {
    icon: Sparkles,
    color: 'bg-amber/12 text-amber',
    title: "L'IA extrait les infos",
    desc: 'Notre intelligence artificielle analyse votre message et crée automatiquement une fiche produit avec tous les détails.',
  },
  {
    icon: Package,
    color: 'bg-emerald/12 text-emerald',
    title: 'Validez et publiez',
    desc: "Rendez-vous dans « Valider un produit » pour vérifier les informations extraites, les corriger si besoin, puis publiez en un tap.",
  },
]

export function CommentAjouterPage() {
  const [copied, setCopied] = useState(false)

  function copyNumber() {
    navigator.clipboard.writeText(WAKANECT_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">
            Ajouter un produit
          </h1>
        </div>
      </div>

      <div className="page-container py-6 flex flex-col gap-6">
        {/* Intro */}
        <div className="text-center px-2">
          <p className="text-body text-white/65 leading-relaxed">
            Ajoutez vos produits en transférant simplement un message WhatsApp. Wakanect fait le reste.
          </p>
        </div>

        {/* Numéro Wakanect — hero */}
        <div className="relative overflow-hidden glass rounded-4xl p-6 flex flex-col items-center gap-4 border border-wa-green/20">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-wa-green opacity-60 rounded-t-4xl" />
          <div className="w-14 h-14 rounded-2xl bg-wa-green/15 flex items-center justify-center">
            <MessageCircle size={26} className="text-wa-green" />
          </div>
          <div className="text-center">
            <p className="text-micro text-white/45 uppercase tracking-wider mb-1">Numéro Wakanect</p>
            <p className="font-display font-bold text-h1 text-white">{WAKANECT_NUMBER}</p>
          </div>
          <button
            onClick={copyNumber}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white text-label font-semibold hover:bg-white/18 active:scale-95 transition-all"
          >
            {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
            {copied ? 'Numéro copié !' : 'Copier le numéro'}
          </button>
        </div>

        {/* 3 steps */}
        <div className="flex flex-col gap-3">
          <p className="text-micro text-white/40 uppercase tracking-wider px-1">Comment ça marche</p>
          {STEPS.map((step, i) => (
            <div key={i} className="glass rounded-3xl p-4 flex items-start gap-4">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${step.color}`}>
                  <step.icon size={19} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 h-4 bg-white/10 rounded-full" />
                )}
              </div>
              <div className="pt-1.5">
                <p className="text-body font-semibold text-white">{step.title}</p>
                <p className="text-label text-white/50 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={`https://wa.me/${WAKANECT_RAW}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-4 rounded-3xl bg-wa-green text-white font-semibold text-body hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <MessageCircle size={20} />
          Ouvrir WhatsApp
        </a>
      </div>
    </div>
  )
}
