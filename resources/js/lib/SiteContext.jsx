import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SITE, fullAddress as formatAddress, phoneDigits } from './site';

const SiteContext = createContext({
    ...SITE,
    fullAddress: () => formatAddress(),
});

export function SiteProvider({ children }) {
    const [contact, setContact] = useState(null);

    useEffect(() => {
        fetch('/api/site-content/contact')
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (data) {
                    setContact(data);
                }
            })
            .catch(() => {});
    }, []);

    const value = useMemo(() => {
        const email = contact?.email || SITE.email;
        const phone = contact?.phone || SITE.phone;
        const address = { ...SITE.address, ...(contact?.address || {}) };
        const digits = phoneDigits(phone);

        return {
            ...SITE,
            email,
            phone,
            phoneHref: `tel:+${digits}`,
            whatsapp: digits,
            whatsappDisplay: phone,
            address,
            fullAddress: () => formatAddress(address),
        };
    }, [contact]);

    return (
        <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
    );
}

export function useSite() {
    return useContext(SiteContext);
}
