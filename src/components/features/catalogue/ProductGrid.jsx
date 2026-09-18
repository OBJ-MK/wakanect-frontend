import { ProductCard } from './ProductCard'
import { useCatalogueStore } from '@/store/catalogueStore'

export function ProductGrid({ products = [] }) {
  const { addToCart, boutique } = useCatalogueStore()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📦</span>
        <p className="text-body font-semibold text-[var(--text-secondary)]">Aucun produit trouvé</p>
        <p className="text-label text-[var(--text-muted)] mt-1">Essayez une autre catégorie</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          variant="public"
          slug={boutique?.slug}
          onAdd={(p) => addToCart(p, null)}
        />
      ))}
    </div>
  )
}