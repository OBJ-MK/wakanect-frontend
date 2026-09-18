import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { MyOrdersFab } from '@/components/features/catalogue/MyOrdersFab'
import { MyOrdersSheet } from '@/pages/public/MyOrdersSheet'
import { useOrdersCacheStore } from '@/store/ordersCacheStore'

export function PublicLayout() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const getOrdersForSlug = useOrdersCacheStore(s => s.getOrdersForSlug)
  const [sheetOpen, setSheetOpen] = useState(false)
  const orders = slug ? getOrdersForSlug(slug) : []

  function handleFabClick() {
    if (orders.length === 1) {
      navigate(`/boutique/${slug}/suivi/${orders[0].trackingCode}`)
    } else if (orders.length > 1) {
      setSheetOpen(true)
    }
  }

  return (
    <div className="min-h-dvh bg-cream dark:bg-navy-deep">
      {/* myOrdersCount/onOpenMyOrders : repris tel quel par le bouton "Mes
          commandes" de l'en-tête desktop de CataloguePage (voir B2) — même
          logique de navigation que le FAB mobile, une seule source. */}
      <Outlet context={{ myOrdersCount: orders.length, onOpenMyOrders: handleFabClick }} />
      <MyOrdersFab onOpen={handleFabClick} />
      <MyOrdersSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}