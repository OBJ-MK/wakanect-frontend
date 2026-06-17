import { useState, useEffect } from 'react'
import { stockService } from '@/services/stockService'

export function useStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    stockService.list()
      .then(data => setProducts(Array.isArray(data) ? data : (data?.products ?? data?.rows ?? [])))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function updateStock(id, data) {
    await stockService.updateStock(id, data)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  return { products, loading, error, updateStock }
}

export function usePendingProducts() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    stockService.getPending()
      .then(data => setPending(Array.isArray(data) ? data : (data?.pending ?? data?.rows ?? [])))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function applyProduct(id, data) {
    await stockService.applyPending(id, data)
    setPending(prev => prev.filter(p => p.id !== id))
  }

  async function ignoreProduct(id) {
    await stockService.ignorePending(id)
    setPending(prev => prev.filter(p => p.id !== id))
  }

  return { pending, loading, error, applyProduct, ignoreProduct }
}
