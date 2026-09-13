import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Lock, Store, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { handleLogin, loading, error } = useAuth()
  const [mode, setMode] = useState('owner')
  // 'phone' | 'email' — bascule dispo en mode propriétaire seulement ;
  // en mode employé, la connexion est toujours par téléphone.
  const [identifierMode, setIdentifierMode] = useState('phone')
  const [form, setForm] = useState({
    shop: '',
    phone_dial: '+221',
    phone_number: '',
    email: '',
    password: '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    const identifier = mode === 'owner' && identifierMode === 'email'
      ? form.email
      : `${form.phone_dial} ${form.phone_number}`.trim()

    handleLogin(
      mode === 'owner'
        ? { identifier, password: form.password }
        : { shop: form.shop, identifier, password: form.password, role: 'employee' }
    )
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up">
      <h1 className="font-display text-h1 font-bold text-white mb-4">Connexion</h1>

      {/* Mode tabs */}
      <div className="flex bg-white/8 rounded-2xl p-1 gap-1 mb-5">
        {[
          { id: 'owner', label: 'Propriétaire' },
          { id: 'employee', label: 'Employé' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              mode === id ? 'bg-white text-navy-deep' : 'text-white/55 hover:text-white/80'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {mode === 'employee' && (
          <Input
            label="Nom de la boutique"
            type="text"
            placeholder="Ex : Boutique Marché HLM"
            value={form.shop}
            onChange={set('shop')}
            icon={<Store size={16} />}
            required
          />
        )}

        {mode === 'owner' && identifierMode === 'email' ? (
          <Input
            label="Email"
            type="email"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={set('email')}
            icon={<AtSign size={16} />}
            autoComplete="username"
            required
          />
        ) : (
          <PhoneInput
            label={mode === 'owner' ? 'Numéro de téléphone' : 'Ton numéro de téléphone'}
            dialCode={form.phone_dial}
            onDialCodeChange={(v) => setForm(f => ({ ...f, phone_dial: v }))}
            number={form.phone_number}
            onNumberChange={(v) => setForm(f => ({ ...f, phone_number: v }))}
            required
          />
        )}

        {mode === 'owner' && (
          <button
            type="button"
            onClick={() => setIdentifierMode(m => m === 'phone' ? 'email' : 'phone')}
            className="self-start -mt-2 text-micro text-white/40 hover:text-white/65 transition-colors"
          >
            {identifierMode === 'phone' ? 'Se connecter avec un email' : 'Se connecter avec un numéro'}
          </button>
        )}

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          icon={<Lock size={16} />}
          autoComplete="current-password"
          required
        />

        {mode === 'employee' && (
          <p className="text-label text-white/45 bg-white/6 rounded-xl px-4 py-2.5 leading-relaxed">
            Ces infos te sont données par le propriétaire de la boutique.
          </p>
        )}

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
          Se connecter
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 mt-5">
        {mode === 'owner' && (
          <>
            <Link to="/mot-de-passe-oublie" className="text-label text-white/40 hover:text-white/60 transition-colors">
              Mot de passe oublié ?
            </Link>
            <p className="text-label text-white/45">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-orange font-semibold hover:text-orange-hi">
                Créer un compte
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}