import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Phone, Lock, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { handleLogin, loading, error } = useAuth()
  const [mode, setMode] = useState('owner')
  const [form, setForm] = useState({ shop: '', identifier: '', password: '' })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    handleLogin(
      mode === 'owner'
        ? { identifier: form.identifier, password: form.password }
        : { shop: form.shop, identifier: form.identifier, password: form.password, role: 'employee' }
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
        <Input
          label={mode === 'owner' ? 'Numéro ou email' : 'Ton numéro de téléphone'}
          type="text"
          placeholder="+221 77 000 00 00"
          value={form.identifier}
          onChange={set('identifier')}
          icon={<Phone size={16} />}
          autoComplete="username"
          required
        />
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
