import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppShell } from '@/components/layout/AppShell'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProtectedRoute } from './ProtectedRoute'

import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { OrdersPage } from '@/pages/app/OrdersPage'
import { StockPage } from '@/pages/app/StockPage'
import { ValidationPage } from '@/pages/app/ValidationPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { CataloguePage } from '@/pages/public/CataloguePage'
import { CheckoutPage } from '@/pages/public/CheckoutPage'
import { ConfirmationPage } from '@/pages/public/ConfirmationPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
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
          { path: 'validation', element: <ValidationPage /> },
          { path: 'profil', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '/boutique/:slug',
    element: <PublicLayout />,
    children: [
      { index: true, element: <CataloguePage /> },
      { path: 'commande', element: <CheckoutPage /> },
      { path: 'confirmation', element: <ConfirmationPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
