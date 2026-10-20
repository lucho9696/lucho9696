import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CartProvider } from '@/context/CartContext'
import { StoreConfigProvider } from '@/context/StoreConfigContext'
import { ToastProvider } from '@/context/ToastContext'
import { UiProvider } from '@/context/UiContext'
import HomePage from '@/pages/HomePage'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const WholesalePage = lazy(() => import('@/pages/WholesalePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const FaqPage = lazy(() => import('@/pages/FaqPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export default function App() {
  return (
    <BrowserRouter>
      <StoreConfigProvider>
        <ToastProvider>
          <CartProvider>
            <UiProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="productos" element={<CatalogPage />} />
                  <Route path="producto/:slug" element={<ProductPage />} />
                  <Route path="carrito" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="mayoristas" element={<WholesalePage />} />
                  <Route path="nosotros" element={<AboutPage />} />
                  <Route path="preguntas-frecuentes" element={<FaqPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </UiProvider>
          </CartProvider>
        </ToastProvider>
      </StoreConfigProvider>
    </BrowserRouter>
  )
}
