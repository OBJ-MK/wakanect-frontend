import { Routes, Route } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
import AdminShell from './AdminShell'
import OverviewPage from './OverviewPage'
import ParsingPage from './ParsingPage'
import ParsingJournalPage from './ParsingJournalPage'
import BoutiquesPage from './BoutiquesPage'
import BoutiqueFichePage from './BoutiqueFichePage'
import EmployesPage from './EmployesPage'
import AbonnementsAdminPage from './AbonnementsAdminPage'
import SantePage from './SantePage'
import AuditPage from './AuditPage'

// ── Impersonate context ───────────────────────────────────────────────────────
// Conserve la session admin intacte ; stocke uniquement l'info d'affichage.
const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

export default function AdminApp() {
  const [impersonating, setImpersonating] = useState(null) // { id, slug, name }

  return (
    <AdminContext.Provider value={{ impersonating, setImpersonating }}>
      <Routes>
        <Route element={<AdminShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="parsing" element={<ParsingPage />} />
          <Route path="parsing/journal" element={<ParsingJournalPage />} />
          <Route path="boutiques" element={<BoutiquesPage />} />
          <Route path="boutiques/:slug" element={<BoutiqueFichePage />} />
          <Route path="employes" element={<EmployesPage />} />
          <Route path="abonnements" element={<AbonnementsAdminPage />} />
          <Route path="sante" element={<SantePage />} />
          <Route path="audit" element={<AuditPage />} />
        </Route>
      </Routes>
    </AdminContext.Provider>
  )
}
