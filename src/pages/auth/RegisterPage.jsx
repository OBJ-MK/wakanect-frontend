import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { slugify } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Store, User, Lock, AtSign, Check } from 'lucide-react'
import { PUBLIC_BASE } from '@/lib/constants'

export function RegisterPage() {
  const { handleRegister, loading, error } = useAuth()
  const [form, setForm] = useState({
    shop_name: '',
    slug: '',
    owner_name: '',
    phone_dial: '+221',
    phone_number: '',
    password: '',
    accepted_terms: false,
  })
  const [touchedTerms, setTouchedTerms] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.value
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'shop_name') next.slug = slugify(value)
      return next
    })
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!form.accepted_terms) {
      setTouchedTerms(true)
      return
    }
    handleRegister({
      businessName: form.shop_name,
      slug: form.slug,
      ownerName: form.owner_name,
      whatsappPhone: `${form.phone_dial} ${form.phone_number}`.trim(),
      password: form.password,
    })
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up">
      <h1 className="font-display text-h1 font-bold text-white mb-1">Créer un compte</h1>
      <p className="text-label text-white/55 mb-6">Lancez votre boutique en quelques minutes</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nom de la boutique"
          type="text"
          placeholder="Ma Super Boutique"
          value={form.shop_name}
          onChange={set('shop_name')}
          icon={<Store size={16} />}
          required
        />

        <Input
          label="Lien de votre boutique"
          type="text"
          placeholder="ma-boutique"
          value={form.slug}
          onChange={set('slug')}
          icon={<AtSign size={16} />}
          hint={form.slug ? `${PUBLIC_BASE}/boutique/${form.slug}`.replace(/^https?:\/\//, '') : 'Généré automatiquement'}
          required
        />

        <Input
          label="Votre nom"
          type="text"
          placeholder="Modibo Kane"
          value={form.owner_name}
          onChange={set('owner_name')}
          icon={<User size={16} />}
          required
        />

        <PhoneInput
          label="Numéro WhatsApp"
          dialCode={form.phone_dial}
          onDialCodeChange={(v) => setForm(f => ({ ...f, phone_dial: v }))}
          number={form.phone_number}
          onNumberChange={(v) => setForm(f => ({ ...f, phone_number: v }))}
          hint="Pour recevoir les notifications de commandes"
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          icon={<Lock size={16} />}
          autoComplete="new-password"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              form.accepted_terms
                ? 'bg-orange border-orange'
                : touchedTerms
                  ? 'border-red-400'
                  : 'border-white/20'
            }`}>
              {form.accepted_terms && <Check size={13} className="text-white" strokeWidth={3} />}
            </span>
            <input
              type="checkbox"
              checked={form.accepted_terms}
              onChange={(e) => {
                setForm(f => ({ ...f, accepted_terms: e.target.checked }))
                setTouchedTerms(true)
              }}
              className="sr-only"
            />
            <span className="text-label text-white/70 leading-snug">
              J'accepte les conditions d'utilisation et la{' '}
              <Link to="/politique-confidentialite" target="_blank" className="text-orange font-semibold hover:text-orange-hi">
                politique de confidentialité
              </Link>{' '}
              de Wakanect
            </span>
          </label>
          {touchedTerms && !form.accepted_terms && (
            <p className="text-label text-red-400">Vous devez accepter les conditions pour continuer</p>
          )}
        </div>

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} disabled={!form.accepted_terms} className="mt-2">
          Créer ma boutique
        </Button>
      </form>

      <p className="text-center text-label text-white/45 mt-5">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-orange font-semibold hover:text-orange-hi">
          Se connecter
        </Link>
      </p>
    </div>
  )
}