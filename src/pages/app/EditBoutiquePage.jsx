import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Camera, Check, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'
import { slugify } from '@/lib/formatters'
import { merchantService } from '@/services/merchantService'
import { PUBLIC_BASE } from '@/lib/constants'

export function EditBoutiquePage() {
  const { merchant, setMerchant } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shop_name:   merchant?.shop_name   ?? '',
    slug:        merchant?.slug        ?? '',
    address:     merchant?.address     ?? '',
    description: merchant?.description ?? '',
    wave_number:         merchant?.payment_settings?.wave?.number         ?? '',
    wave_name:           merchant?.payment_settings?.wave?.name           ?? '',
    orange_money_number: merchant?.payment_settings?.orange_money?.number ?? '',
    orange_money_name:   merchant?.payment_settings?.orange_money?.name   ?? '',
    _slugEdited: false,
  })
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState(null)
  const [logoPreview, setLogoPreview] = useState(merchant?.logo_url ?? null)
  const [logoUploading, setLogoUploading] = useState(false)

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
        paymentSettings: {
          wave:        { number: form.wave_number.trim(),         name: form.wave_name.trim() },
          orangeMoney: { number: form.orange_money_number.trim(), name: form.orange_money_name.trim() },
        },
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
        <div className="max-w-lg mx-auto lg:max-w-3xl flex items-center gap-3">
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
        <div className="page-container py-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
          {/* Colonne logo + aperçu — sticky sous l'en-tête en desktop */}
          <div className="flex flex-col items-center gap-3 lg:w-[260px] lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
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
              <label className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange flex items-center justify-center text-white transition-colors ${logoUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-orange-hi'}`}>
                {logoUploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={logoUploading}
                  onChange={async e => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setLogoUploading(true)
                    setError(null)
                    try {
                      const { logoUrl } = await merchantService.uploadLogo(f)
                      setLogoPreview(logoUrl)
                      setMerchant({ ...merchant, logo_url: logoUrl })
                    } catch (err) {
                      setError(err.message)
                    } finally {
                      setLogoUploading(false)
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-micro text-white/40 text-center">Appuyez sur l'icône pour changer le logo</p>

            {/* Aperçu — desktop uniquement, reflète le formulaire en direct */}
            <div className="hidden lg:flex flex-col w-full glass rounded-3xl p-4 mt-2 gap-1">
              <p className="text-micro text-white/40 uppercase tracking-wider mb-1">Aperçu boutique</p>
              <p className="font-display font-semibold text-body text-white truncate">
                {form.shop_name || 'Ma Super Boutique'}
              </p>
              <p className="text-micro text-white/40 break-all">
                {`${PUBLIC_BASE}/boutique/${form.slug || '...'}`.replace(/^https?:\/\//, '')}
              </p>
              {form.address && (
                <p className="text-micro text-white/35 mt-1">{form.address}</p>
              )}
            </div>
          </div>

          {/* Colonne formulaire */}
          <div className="flex flex-col gap-5 lg:flex-1 lg:min-w-0">
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
                  hint={`${PUBLIC_BASE}/boutique/${form.slug || '...'}`.replace(/^https?:\/\//, '')}
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
                  className="w-full rounded-2xl px-4 py-3 text-body bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange resize-none dark:bg-navy/60 dark:border-white/10"
                />
              </div>
            </div>

            <div className="glass rounded-3xl p-4 flex flex-col gap-4">
              <div>
                <p className="text-label font-semibold text-white/80">Wave &amp; Orange Money</p>
                <p className="text-micro text-white/40 mt-0.5">
                  Affichés au client dans le tunnel de commande quand il choisit ce mode de paiement.
                </p>
              </div>
              <Input
                label="Numéro Wave"
                type="tel"
                placeholder="+221 77 000 00 00"
                value={form.wave_number}
                onChange={set('wave_number')}
              />
              <Input
                label="Nom affiché sur le compte Wave"
                placeholder="Ex : Boutique Aminata"
                value={form.wave_name}
                onChange={set('wave_name')}
                hint="Facultatif — rassure le client qu'il envoie au bon compte"
              />
              <Input
                label="Numéro Orange Money"
                type="tel"
                placeholder="+221 77 000 00 00"
                value={form.orange_money_number}
                onChange={set('orange_money_number')}
              />
              <Input
                label="Nom affiché sur le compte Orange Money"
                placeholder="Ex : Boutique Aminata"
                value={form.orange_money_name}
                onChange={set('orange_money_name')}
                hint="Facultatif — rassure le client qu'il envoie au bon compte"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center px-2">{error}</p>
            )}

            <Button type="submit" size="lg" fullWidth loading={saving} disabled={logoUploading}>
              <Check size={16} />
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}