import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useSite } from '../lib/SiteContext';

const links = [
    { to: '/', label: 'Inicio' },
    { to: '/produtos', label: 'Catálogo' },
    { to: '/contactos', label: 'Contacto' },
    { to: '/seguir-pedido', label: 'Seguir pedido' },
    { to: '/sobre-nos', label: 'Sobre nosotros' },
];

export default function Navbar() {
    const site = useSite();
    const { count } = useCart();
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');

    const submitSearch = (event) => {
        event.preventDefault();
        const value = query.trim();
        setSearchOpen(false);
        navigate(value ? `/produtos?q=${encodeURIComponent(value)}` : '/produtos');
    };

    return (
        <header className="sticky top-0 z-40 bg-cream">
            <div className="bg-lime">
                <p className="py-2.5 text-center text-sm font-medium text-ink">
                    Bienvenido a {site.name}
                </p>
            </div>

            <nav className="border-b border-black/5 bg-cream">
                <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setSearchOpen((open) => !open)}
                            className="inline-flex h-10 w-10 items-center justify-center text-ink"
                            aria-label="Buscar"
                        >
                            {searchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>
                    </div>

                    <Link to="/" className="justify-self-center">
                        <img
                            src="/images/logo.png"
                            alt={site.name}
                            className="h-11 w-auto sm:h-14"
                        />
                    </Link>

                    <div className="flex items-center justify-end">
                        <Link
                            to="/carrinho"
                            className="relative inline-flex h-10 w-10 items-center justify-center text-ink"
                            aria-label="Carrito de compras"
                        >
                            <ShoppingBag size={20} />
                            {count > 0 && (
                                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                                    {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="hidden justify-center gap-8 pb-4 text-sm font-medium text-ink lg:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                isActive
                                    ? 'underline decoration-2 underline-offset-8'
                                    : 'hover:underline hover:underline-offset-8'
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {searchOpen && (
                    <form
                        onSubmit={submitSearch}
                        className="mx-auto max-w-6xl px-4 pb-4 sm:px-6"
                    >
                        <input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar productos…"
                            className="w-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                        />
                    </form>
                )}
            </nav>
        </header>
    );
}
