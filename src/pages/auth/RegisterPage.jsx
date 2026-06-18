import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { slugify } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Store, User, Phone, Lock, AtSign } from 'lucide-react'
import { PUBLIC_BASE } from '@/lib/constants'

export function RegisterPage() {
  const { handleRegister, loading, error } = useAuth()
  const [form, setForm] = useState({
    shop_name: '',
    slug: '',
    owner_name: '',
    whatsapp_number: '',
    password: '',
  })

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
    handleRegister({
      businessName: form.shop_name,
      slug: form.slug,
      ownerName: form.owner_name,
      whatsappPhone: form.whatsapp_number,
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

        <Input
          label="Numéro WhatsApp"
          type="tel"
          placeholder="+221 77 000 00 00"
          value={form.whatsapp_number}
          onChange={set('whatsapp_number')}
          icon={<Phone size={16} />}
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

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
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
