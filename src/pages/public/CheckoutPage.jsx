import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Package } from 'lucide-react'
import { useCatalogueStore } from '@/store/catalogueStore'
import { catalogueService } from '@/services/catalogueService'
import { formatFCFA } from '@/lib/formatters'
import { PAYMENT_METHODS, DELIVERY_MODES } from '@/lib/constants'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function CheckoutPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const cart = useCatalogueStore(s => s.cart)
  const clearCart = useCatalogueStore(s => s.clearCart)
  const boutique = useCatalogueStore(s => s.boutique)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    delivery_mode: 'Livraison',
    address: '',
    note: '',
    payment_method: 'wave',
    payment_proof: null,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Entrez votre nom'
    if (!form.phone.trim()) e.phone = 'Entrez votre numéro WhatsApp'
    if (form.delivery_mode === 'Livraison' && !form.address.trim()) e.address = 'Entrez votre adresse'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setLoading(true)
    try {
      // Contrat back POST /api/orders/public :
      // { slug, customer: { name, phone, address, notes }, items: [{ productId, quantity, color? }] }
      // (prix et total recalculés côté back)
      const noteParts = [
        `Réception : ${form.delivery_mode}`,
        `Paiement : ${form.payment_method}`,
      ]
      if (form.note.trim()) noteParts.push(form.note.trim())
      const colorParts = cart
        .filter(i => i.selectedColor)
        .map(i => `${i.name} : ${i.selectedColor}`)
      if (colorParts.length) noteParts.push(`Couleurs — ${colorParts.join(', ')}`)

      await catalogueService.createOrder({
        slug,
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.delivery_mode === 'Livraison' ? form.address.trim() : '',
          notes: noteParts.join(' · '),
        },
        items: cart.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          color: i.selectedColor || undefined,
        })),
      })
      clearCart()
      navigate(`/boutique/${slug}/confirmation`)
    } catch (err) {
      setErrors({ _: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-h3 font-display font-bold text-navy dark:text-white">Panier vide</p>
        <Link to={`/boutique/${slug}`} className="text-orange underline text-body">
          Retour à la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header orange vif */}
      <div className="bg-gradient-to-r from-orange to-orange-hi px-4 pt-safe pt-4 pb-5">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to={`/boutique/${slug}`}
            className="p-2 -ml-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h2 text-white flex-1">Finaliser commande</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Order recap */}
          <div className="bg-white dark:bg-navy rounded-3xl overflow-hidden shadow-card border border-navy/8 dark:border-white/8">
            <p className="text-micro text-navy/50 dark:text-white/45 uppercase tracking-wider px-4 pt-4 pb-2">
              Récapitulatif
            </p>
            {cart.map(item => (
              <div key={item.key} className="flex items-center gap-3 px-4 py-3 border-t border-navy/6 dark:border-white/6">
                <div className="w-10 h-10 rounded-xl bg-cream-dark dark:bg-navy-light overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={15} className="text-navy/30 dark:text-white/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-navy dark:text-white truncate">{item.name}</p>
                  {item.selectedColor && (
                    <p className="text-micro text-navy/45 dark:text-white/45">{item.selectedColor}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-micro text-navy/50 dark:text-white/50">×{item.quantity}</p>
                  <p className="text-label font-semibold text-orange">{formatFCFA(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3.5 border-t border-navy/10 dark:border-white/10">
              <p className="text-body font-semibold text-navy dark:text-white">Total</p>
              <p className="font-display font-bold text-h3 text-orange">{formatFCFA(total)}</p>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white dark:bg-navy rounded-3xl p-5 shadow-card border border-navy/8 dark:border-white/8 flex flex-col gap-4">
            <p className="text-micro text-navy/50 dark:text-white/45 uppercase tracking-wider">Vos informations</p>
            <Input
              label="Nom complet"
              placeholder="Aminata Diallo"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Numéro WhatsApp"
              type="tel"
              placeholder="+221 77 000 00 00"
              value={form.phone}
              onChange={set('phone')}
              error={errors.phone}
              hint="Pour recevoir votre reçu"
              autoComplete="tel"
            />
          </div>

          {/* Delivery mode */}
          <div className="bg-white dark:bg-navy rounded-3xl p-5 shadow-card border border-navy/8 dark:border-white/8 flex flex-col gap-4">
            <p className="text-micro text-navy/50 dark:text-white/45 uppercase tracking-wider">Mode de réception</p>
            <div className="flex gap-3">
              {Object.values(DELIVERY_MODES).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, delivery_mode: mode }))}
                  className={cn(
                    'flex-1 py-3 rounded-2xl text-label font-semibold border transition-colors',
                    form.delivery_mode === mode
                      ? 'bg-orange text-white border-orange'
                      : 'border-navy/15 dark:border-white/15 text-navy dark:text-white hover:border-orange/50',
                  )}
                >
                  {mode === 'Livraison' ? '🚚' : '🏪'} {mode}
                </button>
              ))}
            </div>
            {form.delivery_mode === 'Livraison' && (
              <Input
                label="Adresse de livraison"
                placeholder="5 Rue Moussé Diop, Dakar"
                value={form.address}
                onChange={set('address')}
                error={errors.address}
                icon={<MapPin size={16} />}
              />
            )}
            <Input
              label="Note optionnelle"
              placeholder="Précisions sur votre commande..."
              value={form.note}
              onChange={set('note')}
            />
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-navy rounded-3xl p-5 shadow-card border border-navy/8 dark:border-white/8 flex flex-col gap-4">
            <p className="text-micro text-navy/50 dark:text-white/45 uppercase tracking-wider">Paiement</p>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors',
                    form.payment_method === method.id
                      ? 'border-orange bg-orange/5'
                      : 'border-navy/10 dark:border-white/10 hover:border-orange/40',
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={form.payment_method === method.id}
                    onChange={() => setForm(f => ({ ...f, payment_method: method.id }))}
                    className="accent-orange"
                  />
                  <span className="text-base">{method.icon}</span>
                  <span className="text-body text-navy dark:text-white">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {errors._ && (
            <p className="text-label text-red-500 bg-red-500/10 rounded-xl px-4 py-2.5">{errors._}</p>
          )}

          <Button type="submit" size="xl" fullWidth loading={loading}>
            Confirmer la commande · {formatFCFA(total)}
          </Button>
        </form>
      </div>
    </div>
  )
}
