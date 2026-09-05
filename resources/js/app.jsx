import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CartProvider } from './lib/cart';
import { SiteProvider } from './lib/SiteContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import WhatsAppButton from './components/WhatsAppButton';
import MobileTabBar from './components/MobileTabBar';
import CartNotification from './components/CartNotification';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Products from './pages/Products';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiesPolicy from './pages/CookiesPolicy';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import LegalNotice from './pages/LegalNotice';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function PublicLayout({ children }) {
    return (
        <div className="pb-20 lg:pb-0">
            <Navbar />
            <CartNotification />
            {children}
            <Footer />
            <WhatsAppButton />
            <CookieBanner />
            <MobileTabBar />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <SiteProvider>
            <CartProvider>
                <ScrollToTop />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicLayout>
                                <Home />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/produtos"
                        element={
                            <PublicLayout>
                                <Products />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/collections/all"
                        element={
                            <PublicLayout>
                                <Products />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/produtos/:id"
                        element={
                            <PublicLayout>
                                <ProductDetail />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/guias"
                        element={
                            <PublicLayout>
                                <Guides />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/guias/:slug"
                        element={
                            <PublicLayout>
                                <GuideDetail />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/sobre-nos"
                        element={
                            <PublicLayout>
                                <About />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/pages/sobre"
                        element={
                            <PublicLayout>
                                <About />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/contactos"
                        element={
                            <PublicLayout>
                                <Contact />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/seguir-pedido"
                        element={
                            <PublicLayout>
                                <TrackOrder />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/pages/contato"
                        element={
                            <PublicLayout>
                                <Contact />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/carrinho"
                        element={
                            <PublicLayout>
                                <Cart />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <PublicLayout>
                                <Cart />
                            </PublicLayout>
                        }
                    />
                    <Route path="/encomenda" element={<Checkout />} />
                    <Route
                        path="/checkouts"
                        element={<Checkout />}
                    />
                    <Route
                        path="/encomenda/confirmacao"
                        element={<OrderConfirmation />}
                    />
                    <Route
                        path="/encomenda/confirmacao/:token"
                        element={<OrderConfirmation />}
                    />
                    <Route
                        path="/termos"
                        element={
                            <PublicLayout>
                                <Terms />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/privacidade"
                        element={
                            <PublicLayout>
                                <Privacy />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/cookies"
                        element={
                            <PublicLayout>
                                <CookiesPolicy />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/envios"
                        element={
                            <PublicLayout>
                                <Shipping />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/aviso-legal"
                        element={
                            <PublicLayout>
                                <LegalNotice />
                            </PublicLayout>
                        }
                    />
                    <Route
                        path="/resolucao"
                        element={
                            <PublicLayout>
                                <Returns />
                            </PublicLayout>
                        }
                    />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </CartProvider>
            </SiteProvider>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);
