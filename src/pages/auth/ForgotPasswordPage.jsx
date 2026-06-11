import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ArrowLeft, Send } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ForgotPasswordPage() {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!phone.trim()) {
      setError('Entrez votre numéro WhatsApp.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="glass rounded-4xl p-6 animate-fade-up flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center">
          <Send size={28} className="text-emerald" />
        </div>
        <div>
          <h1 className="font-display text-h2 font-bold text-white">Lien envoyé !</h1>
          <p className="text-label text-white/55 mt-2 leading-relaxed">
            Un lien de réinitialisation a été envoyé par SMS au <span className="text-white font-semibold">{phone}</span>.
          </p>
        </div>
        <Link
          to="/login"
          className="text-label text-orange font-semibold hover:text-orange-hi transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-label text-white/45 hover:text-white/70 transition-colors mb-5"
      >
        <ArrowLeft size={15} />
        Retour
      </Link>

      <h1 className="font-display text-h1 font-bold text-white mb-1">Mot de passe oublié</h1>
      <p className="text-label text-white/55 mb-6">
        Entrez votre numéro WhatsApp pour recevoir un lien de réinitialisation.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Numéro WhatsApp"
          type="tel"
          placeholder="+221 77 000 00 00"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          icon={<Phone size={16} />}
          required
        />

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
          Envoyer le lien
        </Button>
      </form>
    </div>
  )
}
