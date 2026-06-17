import { useState, useEffect, useCallback, useRef } from 'react'

export function useAdminQuery(fetchFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const mountedRef = useRef(true)
  // Always hold the latest fetchFn without re-creating `run` on every render.
  const fetchRef = useRef(fetchFn)
  fetchRef.current = fetchFn

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const run = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }))
    fetchRef.current()
      .then(data  => { if (mountedRef.current) setState({ data, loading: false, error: null }) })
      .catch(err  => { if (mountedRef.current) setState({ data: null, loading: false, error: err.message }) })
  // deps controls WHEN to re-fetch; fetchRef gives us the latest fn without being a dep.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { ...state, refetch: run }
}
