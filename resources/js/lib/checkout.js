import { PROVINCES, SITE } from './site';
import { includedVat, isValidSpanishPostalCode } from './format';

export const ORDER_STORAGE_KEY = 'rck_last_order';
export const CHECKOUT_DRAFT_KEY = 'rck_checkout_draft';

export const PAYMENT_METHODS = [
    {
        id: 'transferencia',
        label: 'Ingreso bancario',
        hint: 'Tras el pedido verás el IBAN, el BIC y la referencia en la página de confirmación.',
    },
];

export function paymentLabel(id) {
    return PAYMENT_METHODS.find((method) => method.id === id)?.label || id;
}

export function isIslandDistrict(district) {
    return [
        'Islas Baleares',
        'Las Palmas',
        'Santa Cruz de Tenerife',
        'Ceuta',
        'Melilla',
    ].includes(district);
}

export function addressIsComplete(form) {
    return Boolean(
        form.street?.trim() &&
            isValidSpanishPostalCode(form.postalCode) &&
            form.city?.trim() &&
            PROVINCES.includes(form.district),
    );
}

export function shippingFor(form) {
    if (!addressIsComplete(form)) {
        return null;
    }

    if (isIslandDistrict(form.district)) {
        return {
            code: 'ilhas',
            label: 'Estándar',
            price: SITE.shipping.islandsPrice,
            detail: SITE.shipping.islands,
        };
    }

    return {
        code: 'continente',
        label: 'Estándar',
        price: SITE.shipping.mainlandPrice,
        detail: SITE.shipping.mainland,
    };
}

export function totalsFor(subtotal, shipping) {
    const shippingPrice = shipping?.price ?? 0;
    const total = Number(subtotal) + shippingPrice;

    return {
        subtotal: Number(subtotal) || 0,
        shipping: shippingPrice,
        total,
        tax: includedVat(total),
    };
}

export function makeOrderId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';

    for (let index = 0; index < 9; index += 1) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
}

export function saveLastOrder(order) {
    sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readLastOrder() {
    try {
        const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function readCheckoutDraft() {
    try {
        const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveCheckoutDraft(form) {
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(form));
}
