const GOOGLE_TAG_ID = 'GT-NGM9K2JS';

let loaded = false;

export function loadGoogleTag() {
    if (loaded || typeof window === 'undefined') {
        return;
    }

    loaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_TAG_ID);
}
