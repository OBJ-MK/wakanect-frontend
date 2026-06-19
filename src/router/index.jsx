import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppShell } from '@/components/layout/AppShell'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'

const AdminApp = lazy(() => import('@/pages/admin/AdminApp'))
const LandingPage = lazy(() => import('@/landing/LandingPage'))

function AdminFallback() {
  return (
    <div className="min-h-screen bg-[#0F1C3F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#EC5E2A] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Auth
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { CompteCreePage } from '@/pages/auth/CompteCreePage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// Onboarding
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'

// App — merchant
import { DashboardPage } from '@/pages/app/DashboardPage'
import { OrdersPage } from '@/pages/app/OrdersPage'
import { StockPage } from '@/pages/app/StockPage'
import { ValidationPage } from '@/pages/app/ValidationPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { NotificationsPage } from '@/pages/app/NotificationsPage'
import { CatalogueMarchandPage } from '@/pages/app/CatalogueMarchandPage'
import { ProductFormPage } from '@/pages/app/ProductFormPage'
import { StockBasPage } from '@/pages/app/StockBasPage'
import { EditBoutiquePage } from '@/pages/app/EditBoutiquePage'
import { PartagerPage } from '@/pages/app/PartagerPage'
import { AidePage } from '@/pages/app/AidePage'
import { CommentAjouterPage } from '@/pages/app/CommentAjouterPage'
import { MonAbonnementPage } from '@/pages/app/MonAbonnementPage'
import { MonEquipePage } from '@/pages/app/MonEquipePage'
import { AjouterEmployePage } from '@/pages/app/AjouterEmployePage'
import { FicheEmployePage } from '@/pages/app/FicheEmployePage'
import { ActiverNotificationsPage } from '@/pages/app/ActiverNotificationsPage'
import { InstallerAppPage } from '@/pages/app/InstallerAppPage'

// Public boutique
import { CataloguePage } from '@/pages/public/CataloguePage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { CartSheet } from '@/pages/public/CartSheet'
import { CheckoutPage } from '@/pages/public/CheckoutPage'
import { ConfirmationPage } from '@/pages/public/ConfirmationPage'
import { OrderTrackingPage } from '@/pages/public/OrderTrackingPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

// Abonnement
import { FormulasPage } from '@/pages/abonnement/FormulasPage'
import { AbonnementPaiementPage } from '@/pages/abonnement/AbonnementPaiementPage'
import { EssaiTerminePage } from '@/pages/abonnement/EssaiTerminePage'
import { AbonnementSuccesPage } from '@/pages/abonnement/AbonnementSuccesPage'
import { AbonnementEchecPage } from '@/pages/abonnement/AbonnementEchecPage'

export const router = createBrowserRouter([
  // Onboarding (before auth)
  {
    path: '/bienvenue',
    element: <OnboardingPage />,
  },

  // Landing publique — page d'accueil, lazy (chunk isolé, jamais téléchargé par l'app/admin)
  {
    path: '/',
    element: (
      <Suspense fallback={<AdminFallback />}>
        <LandingPage />
      </Suspense>
    ),
  },

  // Auth
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/compte-cree', element: <CompteCreePage /> },
      { path: '/mot-de-passe-oublie', element: <ForgotPasswordPage /> },
      { path: '/reinitialiser', element: <ResetPasswordPage /> },
    ],
  },

  // Protected merchant app
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'commandes', element: <OrdersPage /> },
          { path: 'commandes/:id', element: <OrdersPage /> },
          { path: 'stock', element: <StockPage /> },
          { path: 'stock-bas', element: <StockBasPage /> },
          { path: 'validation', element: <ValidationPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'catalogue', element: <CatalogueMarchandPage /> },
          { path: 'catalogue/ajouter', element: <ProductFormPage /> },
          { path: 'catalogue/:id/modifier', element: <ProductFormPage /> },
          { path: 'profil', element: <ProfilePage /> },
          { path: 'profil/boutique', element: <EditBoutiquePage /> },
          { path: 'profil/partager', element: <PartagerPage /> },
          { path: 'profil/aide', element: <AidePage /> },
          { path: 'profil/comment-ajouter', element: <CommentAjouterPage /> },
          { path: 'profil/abonnement', element: <MonAbonnementPage /> },
          { path: 'profil/installer', element: <InstallerAppPage /> },
          { path: 'notifications/activer', element: <ActiverNotificationsPage /> },
          { path: 'equipe', element: <MonEquipePage /> },
          { path: 'equipe/ajouter', element: <AjouterEmployePage /> },
          { path: 'equipe/:id', element: <FicheEmployePage /> },
        ],
      },
    ],
  },

  // Abonnement (accessible without full auth for paywall)
  {
    path: '/abonnement',
    element: <FormulasPage />,
  },
  {
    path: '/abonnement/paiement',
    element: <AbonnementPaiementPage />,
  },
  {
    path: '/abonnement/essai-termine',
    element: <EssaiTerminePage />,
  },
  {
    path: '/abonnement/succes',
    element: <AbonnementSuccesPage />,
  },
  {
    path: '/abonnement/echec',
    element: <AbonnementEchecPage />,
  },

  // Public boutique (no auth)
  {
    path: '/boutique/:slug',
    element: <PublicLayout />,
    children: [
      { index: true, element: <CataloguePage /> },
      { path: 'produit/:id', element: <ProductDetailPage /> },
      { path: 'commande', element: <CheckoutPage /> },
      { path: 'confirmation', element: <ConfirmationPage /> },
      { path: 'suivi/:orderId', element: <OrderTrackingPage /> },
    ],
  },

  // Super-admin back-office — lazy-loaded, chunk isolé (commerçants ne le téléchargent jamais)
  {
    path: '/admin/*',
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminApp />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminApp />
          </Suspense>
        ),
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
