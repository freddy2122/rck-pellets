import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useCart } from '../lib/cart';
import { imageUrl } from '../lib/format';

export default function CartNotification() {
    const { lastAdded, count, dismissAdded } = useCart();
    const { pathname } = useLocation();
    const previousPath = useRef(pathname);

    useEffect(() => {
        if (previousPath.current === pathname) {
            return;
        }

        previousPath.current = pathname;
        dismissAdded();
    }, [pathname, dismissAdded]);

    useEffect(() => {
        if (!lastAdded) {
            return undefined;
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                dismissAdded();
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [lastAdded, dismissAdded]);

    if (!lastAdded) {
        return null;
    }

    return (
        <div
            className="fixed right-4 top-28 z-50 w-[min(calc(100%-2rem),22rem)] rounded-xl bg-cream p-5 shadow-[0_8px_30px_rgba(46,42,57,0.18)] sm:right-6 lg:top-36"
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                    <Check size={16} strokeWidth={2.4} />
                    Item añadido a tu carrito
                </p>
                <button
                    type="button"
                    onClick={dismissAdded}
                    className="shrink-0 text-ink/50 hover:text-ink"
                    aria-label="Cerrar"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-white">
                    {imageUrl(lastAdded.image) ? (
                        <img
                            src={imageUrl(lastAdded.image)}
                            alt=""
                            className="h-full w-full object-contain p-1"
                        />
                    ) : null}
                </div>
                <p className="text-sm leading-5">{lastAdded.name}</p>
            </div>

            <Link
                to="/carrinho"
                className="mt-5 flex w-full items-center justify-center rounded-lg border border-ink py-3 text-sm font-medium"
            >
                Ver carrito ({count})
            </Link>
            <Link
                to="/encomenda"
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-semibold text-white"
            >
                Finalizar la compra
            </Link>
            <button
                type="button"
                onClick={dismissAdded}
                className="mt-3 w-full text-center text-sm underline underline-offset-4"
            >
                Seguir comprando
            </button>
        </div>
    );
}
