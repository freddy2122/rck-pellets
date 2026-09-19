import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Le pixel Meta ne suit qu'un PageView initial (chargement complet
        // de la page) ; ici on le redeclenche a chaque changement de route
        // du SPA pour que la navigation reelle soit suivie.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
        }
    }, [pathname]);

    return null;
}
