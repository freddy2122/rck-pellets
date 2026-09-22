import { useEffect } from 'react';
import { useCookieConsent } from '../lib/consent';
import { loadGoogleTag } from '../lib/googleTag';

export default function GoogleTag() {
    const consent = useCookieConsent();

    useEffect(() => {
        if (consent === 'all') {
            loadGoogleTag();
        }
    }, [consent]);

    return null;
}
