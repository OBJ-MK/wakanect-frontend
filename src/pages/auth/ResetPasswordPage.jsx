import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Le mot de passe doit avoir au moins 8 caractères.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    navigate('/login')
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up">
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-orange/15 flex items-center justify-center">
          <Lock size={26} className="text-orange" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-h2 font-bold text-white">Nouveau mot de passe</h1>
          <p className="text-label text-white/55 mt-1">Choisissez un mot de passe sécurisé</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          icon={<Lock size={16} />}
          hint="8 caractères minimum"
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={set('confirm')}
          icon={<Check size={16} />}
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-label text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
          Réinitialiser le mot de passe
        </Button>
      </form>
    </div>
  )
}
