import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useSite } from '../lib/SiteContext';

const footerLinks = [
    { to: '/resolucao', label: 'Política de reembolso' },
    { to: '/envios', label: 'Envío' },
    { to: '/privacidade', label: 'Política de privacidad' },
    { to: '/termos', label: 'Términos del servicio' },
    { to: '/aviso-legal', label: 'Aviso legal' },
    { to: '/seguir-pedido', label: 'Seguir pedido' },
    { to: '/contactos', label: 'Contacto' },
];

export default function CheckoutShell({ children, summary, showBag = true }) {
    const site = useSite();

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <header className="border-b border-[#e6e6e6] px-4 py-4 sm:px-8">
                <div className="relative mx-auto flex max-w-6xl items-center justify-center">
                    <Link to="/" className="inline-flex items-center">
                        <img
                            src="/images/logo.png"
                            alt={site.name}
                            className="h-10 w-auto"
                        />
                    </Link>
                    {showBag && (
                        <Link
                            to="/carrinho"
                            className="absolute right-0 inline-flex h-10 w-10 items-center justify-center text-[#1a1a1a]"
                            aria-label="Carrito"
                        >
                            <ShoppingBag size={20} />
                        </Link>
                    )}
                </div>
            </header>

            <div
                className={
                    summary
                        ? 'lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]'
                        : ''
                }
            >
                <div className="px-4 py-8 sm:px-10 lg:justify-self-end lg:pr-16 lg:pl-8">
                    <div className="mx-auto w-full max-w-[560px]">
                        {children}
                        <footer className="mt-10 border-t border-[#e6e6e6] pt-6">
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#1773b8]">
                                {footerLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="hover:underline"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </footer>
                    </div>
                </div>

                {summary ? (
                    <aside className="border-t border-[#e6e6e6] bg-[#f5f5f5] px-4 py-8 sm:px-10 lg:min-h-[calc(100vh-65px)] lg:border-t-0 lg:border-l lg:px-12">
                        <div className="mx-auto w-full max-w-[420px] lg:sticky lg:top-8">
                            {summary}
                        </div>
                    </aside>
                ) : null}
            </div>
        </div>
    );
}
