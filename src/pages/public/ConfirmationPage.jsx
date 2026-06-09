import { Link, useParams } from 'react-router-dom'
import { CheckCircle, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ConfirmationPage() {
  const { slug } = useParams()

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-scale-in">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald/15 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald" strokeWidth={1.5} />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-emerald/20 animate-ping" />
        </div>

        <h1 className="font-display font-extrabold text-h1 text-navy dark:text-white mb-2">
          Commande confirmée !
        </h1>
        <p className="text-body text-navy/60 dark:text-white/60 mb-2">
          Votre reçu a été envoyé sur WhatsApp.
        </p>
        <p className="text-label text-navy/40 dark:text-white/40 mb-8">
          Le commerçant vous contactera sous peu pour confirmer les détails.
        </p>

        {/* WhatsApp confirmation note */}
        <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-wa-green/10 border border-wa-green/20 mb-6">
          <MessageCircle size={18} className="text-wa-green shrink-0" />
          <p className="text-label text-navy dark:text-white/80 text-left">
            Reçu envoyé par WhatsApp — vérifiez vos messages
          </p>
        </div>

        <Link to={`/boutique/${slug}`} className="w-full">
          <Button variant="outline" size="lg" fullWidth>
            <ArrowLeft size={16} /> Retour à la boutique
          </Button>
        </Link>
      </div>
    </div>
  )
}
