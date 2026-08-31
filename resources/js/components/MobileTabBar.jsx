import { NavLink, useLocation } from 'react-router-dom';
import { Home, Leaf, Package, Phone, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cart';

const tabs = [
    { to: '/', label: 'Inicio', icon: Home, end: true },
    { to: '/produtos', label: 'Catálogo', icon: Package },
    { to: '/carrinho', label: 'Carrito', icon: ShoppingBag },
    { to: '/sobre-nos', label: 'Sobre', icon: Leaf },
    { to: '/contactos', label: 'Contacto', icon: Phone },
];

function tabIsActive(to, pathname) {
    if (to === '/') {
        return pathname === '/';
    }

    return pathname === to || pathname.startsWith(`${to}/`);
}

export default function MobileTabBar() {
    const { count } = useCart();
    const { pathname } = useLocation();

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            aria-label="Navegação principal"
        >
            <div className="grid grid-cols-5">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = tabIsActive(tab.to, pathname);

                    return (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            end={tab.end}
                            className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                                active ? 'text-pine' : 'text-stone-400'
                            }`}
                        >
                            <span className="relative">
                                <Icon size={22} strokeWidth={1.9} />
                                {tab.to === '/carrinho' && count > 0 && (
                                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pine px-1 text-[9px] font-bold text-white">
                                        {count}
                                    </span>
                                )}
                            </span>
                            {tab.label}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
