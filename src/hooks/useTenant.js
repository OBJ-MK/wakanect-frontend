import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { catalogueService } from '@/services/catalogueService'
import { useCatalogueStore } from '@/store/catalogueStore'

export function useTenant() {
  const { slug } = useParams()
  const { setBoutique } = useCatalogueStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [boutique, setBoutiqueLocal] = useState(null)

  useEffect(() => {
    if (!slug) return
    catalogueService.getBoutique(slug)
      .then(data => {
        setBoutiqueLocal(data)
        setBoutique(data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  return { boutique, loading, error, slug }
}
