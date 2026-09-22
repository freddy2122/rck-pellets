import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Les pixels Meta et Google ne suivent qu'une page vue au
        // chargement initial ; on la redeclenche a chaque changement de
        // route du SPA pour que la navigation reelle soit suivie.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
        }

        if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_path: pathname,
                page_location: window.location.href,
            });
        }
    }, [pathname]);

    return null;
}
