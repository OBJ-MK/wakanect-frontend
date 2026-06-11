import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Phone, Lock } from 'lucide-react'

export function LoginPage() {
  const { handleLogin, loading, error } = useAuth()
  const [form, setForm] = useState({ identifier: '', password: '' })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function onSubmit(e) {
    e.preventDefault()
    handleLogin(form)
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up">
      <h1 className="font-display text-h1 font-bold text-white mb-1">Connexion</h1>
      <p className="text-label text-white/55 mb-6">Accédez à votre tableau de bord</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Numéro ou email"
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

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
          Se connecter
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 mt-5">
        <Link to="/mot-de-passe-oublie" className="text-label text-white/40 hover:text-white/60 transition-colors">
          Mot de passe oublié ?
        </Link>
        <p className="text-label text-white/45">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-orange font-semibold hover:text-orange-hi">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
