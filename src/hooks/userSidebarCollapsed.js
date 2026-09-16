import { useState, useEffect } from 'react'

const KEY = 'waka_sidebar_collapsed'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, collapsed ? '1' : '0')
    } catch {
      // Stockage indisponible (navigation privée, quota) — préférence non
      // persistée, pas bloquant.
    }
  }, [collapsed])

  return [collapsed, setCollapsed]
}