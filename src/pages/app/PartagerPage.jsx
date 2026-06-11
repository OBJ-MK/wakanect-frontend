import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Copy, Check, MessageCircle, Share2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { buildWhatsAppLink } from '@/lib/utils'

function QRPlaceholder({ url }) {
  return (
    <div className="w-44 h-44 rounded-3xl bg-white p-3 flex items-center justify-center mx-auto">
      {/* Simple SVG QR placeholder pattern */}
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="QR code de la boutique">
        <rect width="100" height="100" fill="white" />
        {/* Top-left finder */}
        <rect x="5" y="5" width="30" height="30" fill="none" stroke="#0F1C3F" strokeWidth="5" rx="2" />
        <rect x="13" y="13" width="14" height="14" fill="#0F1C3F" rx="1" />
        {/* Top-right finder */}
        <rect x="65" y="5" width="30" height="30" fill="none" stroke="#0F1C3F" strokeWidth="5" rx="2" />
        <rect x="73" y="13" width="14" height="14" fill="#0F1C3F" rx="1" />
        {/* Bottom-left finder */}
        <rect x="5" y="65" width="30" height="30" fill="none" stroke="#0F1C3F" strokeWidth="5" rx="2" />
        <rect x="13" y="73" width="14" height="14" fill="#0F1C3F" rx="1" />
        {/* Data dots */}
        {[44,50,56,44,56,50,44,56].map((x, i) => (
          <rect key={i} x={x} y={i % 2 === 0 ? 44 : 50} width="6" height="6" fill="#0F1C3F" rx="1" />
        ))}
      </svg>
    </div>
  )
}

export function PartagerPage() {
  const { merchant } = useAuthStore()
  const [copiedLink, setCopiedLink] = useState(false)

  const boutiqueUrl = merchant?.slug
    ? `https://wakanect.com/boutique/${merchant.slug}`
    : 'https://wakanect.com/boutique/ma-boutique'

  const shopName = merchant?.shop_name ?? 'ma boutique'
  const waNumber = merchant?.whatsapp_number ?? ''

  const waShareMsg = `Découvrez ${shopName} sur Wakanect ! 🛍️\n${boutiqueUrl}`
  const waLink = buildWhatsAppLink(waNumber, waShareMsg)

  function copyLink() {
    navigator.clipboard.writeText(boutiqueUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title: shopName, url: boutiqueUrl })
    } else {
      copyLink()
    }
  }

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
          <h1 className="font-display font-bold text-h3 text-white flex-1">
            Partager ma boutique
          </h1>
        </div>
      </div>

      <div className="page-container py-6 flex flex-col gap-6">
        {/* QR + Shop name */}
        <div className="glass rounded-4xl p-6 flex flex-col items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-60 rounded-t-4xl" />
          <p className="text-micro text-white/45 uppercase tracking-wider">QR code de votre boutique</p>
          <QRPlaceholder url={boutiqueUrl} />
          <div className="text-center">
            <p className="font-display font-bold text-h3 text-white">{shopName}</p>
            <p className="text-label text-white/45 mt-0.5">
              {merchant?.slug ? `wakanect.com/boutique/${merchant.slug}` : boutiqueUrl.replace('https://', '')}
            </p>
          </div>
        </div>

        {/* Link row */}
        <div className="glass rounded-3xl px-4 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-micro text-white/40 mb-0.5">Lien de votre boutique</p>
            <p className="text-label text-orange truncate">{boutiqueUrl.replace('https://', '')}</p>
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 text-white/70 text-label hover:bg-white/15 active:scale-95 transition-all shrink-0"
            aria-label="Copier le lien"
          >
            {copiedLink ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            {copiedLink ? 'Copié !' : 'Copier'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(waShareMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-4 rounded-3xl bg-wa-green text-white font-semibold text-body hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={20} />
            Partager sur WhatsApp
          </a>

          <button
            onClick={nativeShare}
            className="flex items-center justify-center gap-3 py-4 rounded-3xl glass border border-white/15 text-white font-semibold text-body hover:bg-white/8 active:scale-[0.98] transition-all"
          >
            <Share2 size={18} />
            Autres options de partage
          </button>
        </div>
      </div>
    </div>
  )
}
