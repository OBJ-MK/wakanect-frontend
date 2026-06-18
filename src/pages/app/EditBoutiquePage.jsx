import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'
import { slugify } from '@/lib/formatters'
import { merchantService } from '@/services/merchantService'

export function EditBoutiquePage() {
  const { merchant, setMerchant } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shop_name:   merchant?.shop_name   ?? '',
    slug:        merchant?.slug        ?? '',
    address:     merchant?.address     ?? '',
    description: merchant?.description ?? '',
    _slugEdited: false,
  })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const set = (key) => (e) => {
    const value = e.target.value
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'shop_name' && !f._slugEdited) next.slug = slugify(value)
      return next
    })
  }

  function setSlug(e) {
    setForm(f => ({ ...f, slug: slugify(e.target.value), _slugEdited: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const updated = await merchantService.updateProfile({
        businessName:       form.shop_name,
        slug:               form.slug,
        address:            form.address,
        catalogDescription: form.description,
      })
      setMerchant(updated)
      navigate('/app/profil')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
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
            Infos boutique
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="page-container py-5 flex flex-col gap-5">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange to-amber flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-h1 text-white">
                    {getInitials(form.shop_name || 'W')}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange flex items-center justify-center text-white cursor-pointer hover:bg-orange-hi transition-colors">
                <Camera size={13} />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setLogoPreview(URL.createObjectURL(f))
                  }}
                />
              </label>
            </div>
            <p className="text-micro text-white/40">Appuyez sur l'icône pour changer le logo</p>
          </div>

          {/* Fields */}
          <div className="glass rounded-3xl p-4 flex flex-col gap-4">
            <Input
              label="Nom de la boutique"
              placeholder="Ma Super Boutique"
              value={form.shop_name}
              onChange={set('shop_name')}
              required
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Lien de la boutique"
                placeholder="ma-boutique"
                value={form.slug}
                onChange={setSlug}
                hint={`wakanect.com/boutique/${form.slug || '...'}`}
                required
              />
            </div>

            <Input
              label="Numéro WhatsApp"
              type="tel"
              value={merchant?.whatsapp_number ?? ''}
              disabled
              hint="Modifiable depuis les paramètres du compte"
            />

            <Input
              label="Adresse"
              placeholder="5 Rue Moussé Diop, Dakar"
              value={form.address}
              onChange={set('address')}
            />
          </div>

          <div className="glass rounded-3xl p-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-white/60">
                Description <span className="text-white/35 font-normal">(facultatif)</span>
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Présentez votre boutique en quelques mots..."
                rows={3}
                className="w-full rounded-2xl px-4 py-3 text-body bg-navy/60 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange resize-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center px-2">{error}</p>
          )}

          <Button type="submit" size="lg" fullWidth loading={saving}>
            <Check size={16} />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
