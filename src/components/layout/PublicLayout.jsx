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

  function handleFabClick() {
    const orders = slug ? getOrdersForSlug(slug) : []
    if (orders.length === 1) {
      navigate(`/boutique/${slug}/suivi/${orders[0].trackingCode}`)
    } else if (orders.length > 1) {
      setSheetOpen(true)
    }
  }

  return (
    <div className="min-h-dvh bg-cream dark:bg-navy-deep">
      <Outlet />
      <MyOrdersFab onOpen={handleFabClick} />
      <MyOrdersSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}