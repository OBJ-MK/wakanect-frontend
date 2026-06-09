import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTenant } from '@/hooks/useTenant'
import { ProductGrid } from '@/components/features/catalogue/ProductGrid'
import { FilterChips } from '@/components/features/catalogue/FilterChips'
import { CartFab } from '@/components/features/catalogue/CartFab'
import { CartSheet } from './CartSheet'
import { buildWhatsAppLink } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

const MOCK_BOUTIQUE = {
  slug: 'demo-boutique',
  shop_name: 'Fashion Dakar',
  owner_name: 'Aminata Diop',
  whatsapp_number: '+221770000000',
  banner_url: null,
  products: [
    { id: '1', name: 'Robe Wax Ankara Premium', price: 25000, stock: 12, category: 'Vêtements', colors: ['Rouge', 'Noir', 'Blanc'], sizes: ['S', 'M', 'L', 'XL'], image_url: null },
    { id: '2', name: 'Sneakers Air Force One', price: 45000, stock: 3, category: 'Chaussures', colors: ['Blanc', 'Noir'], sizes: ['40', '41', '42', '43'], image_url: null },
    { id: '3', name: 'Sac à main cuir', price: 35000, stock: 0, category: 'Accessoires', colors: ['Marron', 'Noir'], sizes: [], image_url: null },
    { id: '4', name: 'Boubou grand modèle', price: 18000, stock: 8, category: 'Vêtements', colors: ['Bleu', 'Kaki'], sizes: ['M', 'L', 'XL', 'XXL'], image_url: null },
    { id: '5', name: 'Sandales cuir tressé', price: 12000, stock: 15, category: 'Chaussures', colors: ['Marron', 'Noir'], sizes: ['37', '38', '39', '40', '41'], image_url: null },
    { id: '6', name: 'Pochette tissu wax', price: 8000, stock: 20, category: 'Accessoires', colors: ['Multicolore'], sizes: [], image_url: null },
  ],
}

export function CataloguePage() {
  const { boutique: fetchedBoutique, loading, error } = useTenant()
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [cartOpen, setCartOpen] = useState(false)

  const boutique = fetchedBoutique || MOCK_BOUTIQUE

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-h3 font-display font-bold text-navy">Boutique introuvable</p>
        <p className="text-body text-navy/60">Vérifiez le lien ou contactez le commerçant.</p>
      </div>
    )
  }

  const categories = ['Tout', ...new Set(boutique.products?.map(p => p.category).filter(Boolean) ?? [])]

  const products = activeCategory === 'Tout'
    ? (boutique.products ?? [])
    : (boutique.products ?? []).filter(p => p.category === activeCategory)

  const waLink = boutique.whatsapp_number
    ? buildWhatsAppLink(boutique.whatsapp_number, `Bonjour, j'ai une question sur votre boutique ${boutique.shop_name}.`)
    : null

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-h3 text-navy dark:text-white truncate">
              {boutique.shop_name}
            </p>
            <p className="text-micro text-navy/50 dark:text-white/40">
              {boutique.products?.length ?? 0} produits
            </p>
          </div>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-wa-green text-white text-label font-semibold shrink-0 hover:bg-green-500 active:scale-95 transition-all"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Category filter */}
        <FilterChips
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Product grid */}
        <ProductGrid products={products} />
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <a
          href="https://wakanect.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-micro text-navy/30 dark:text-white/20 hover:text-navy/50 dark:hover:text-white/40 transition-colors"
        >
          Propulsé par <WakanectLogo variant="mark" className="h-4 w-4 opacity-40" />
        </a>
      </div>

      {/* Cart FAB */}
      <CartFab onOpen={() => setCartOpen(true)} />

      {/* Cart sheet */}
      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
