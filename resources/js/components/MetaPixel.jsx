import { useEffect } from 'react';
import { useCookieConsent } from '../lib/consent';
import { loadMetaPixel } from '../lib/metaPixel';

export default function MetaPixel() {
    const consent = useCookieConsent();

    useEffect(() => {
        if (consent === 'all') {
            loadMetaPixel();
        }
    }, [consent]);

    return null;
}
