import { useState, useEffect } from 'react'

const KEY = 'waka_sidebar_collapsed_v2'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '0' ? false : true
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