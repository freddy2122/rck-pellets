import { Link } from 'react-router-dom';

import { setConsent, useCookieBannerVisible } from '../lib/consent';

export default function CookieBanner() {
    const visible = useCookieBannerVisible();

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-16 z-50 border-t border-sand bg-white p-4 lg:bottom-0">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-3xl text-sm leading-6 text-stone-600">
                    Utilizamos cookies esenciales para el funcionamiento de la
                    tienda y, solo con tu consentimiento, cookies de análisis.
                    Consulta la{' '}
                    <Link to="/cookies" className="font-semibold text-pine underline">
                        Política de cookies
                    </Link>{' '}
                    y la{' '}
                    <Link
                        to="/privacidade"
                        className="font-semibold text-pine underline"
                    >
                        Política de privacidad
                    </Link>
                    .
                </p>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setConsent('essential')}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                    >
                        Solo esenciales
                    </button>
                    <button
                        type="button"
                        onClick={() => setConsent('all')}
                        className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    );
}
