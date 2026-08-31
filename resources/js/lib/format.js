export const VAT_INCLUDED_RATE = 0.23;

export function includedVat(gross) {
    const value = Number(gross) || 0;

    return (value * VAT_INCLUDED_RATE) / (1 + VAT_INCLUDED_RATE);
}

export function formatIban(value) {
    return String(value || '')
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

export function formatCheckoutMoney(value) {
    return formatEuro(value);
}

export function formatCheckoutGrandTotal(value) {
    const amount = Number(value).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `EUR ${amount} €`;
}

export function formatEuro(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value));
}

export function formatShopifyAmount(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const amount = Number(value).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `€${amount}`;
}

export function formatShopifyPrice(value) {
    const amount = formatShopifyAmount(value);

    return amount ? `${amount} EUR` : null;
}

export function categoryLabel(category) {
    if (category === 'carbon') {
        return 'Carbón';
    }

    if (category === 'lenha') {
        return 'Leña';
    }

    return 'Pellets';
}

export function stripHtml(text) {
    return String(text || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function truncate(text, max = 50) {
    if (!text) {
        return '';
    }

    const clean = stripHtml(text);

    if (clean.length <= max) {
        return clean;
    }

    return `${clean.slice(0, max).trimEnd()}...`;
}

export function imageUrl(image) {
    if (!image) {
        return null;
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/storage/${image}`;
}

export function productImages(product) {
    if (Array.isArray(product?.images) && product.images.length > 0) {
        return product.images
            .map((image) => image.url || imageUrl(image.path))
            .filter(Boolean);
    }

    const main = imageUrl(product?.image);

    return main ? [main] : [];
}

export function productMainImage(product) {
    const primary = product?.images?.find((image) => image.is_primary)
        || product?.images?.[0];

    if (primary?.url) {
        return primary.url;
    }

    if (primary?.path) {
        return imageUrl(primary.path);
    }

    return imageUrl(product?.image);
}

export function isValidSpanishPostalCode(value) {
    return /^\d{5}$/.test(String(value).trim());
}

export function isValidPortuguesePostalCode(value) {
    return isValidSpanishPostalCode(value) || /^\d{4}-\d{3}$/.test(String(value).trim());
}

export function nationalPhoneDigits(value, dial = '34') {
    let digits = String(value).replace(/\D/g, '');
    const prefix = String(dial).replace(/\D/g, '');

    if (digits.startsWith('00')) {
        digits = digits.slice(2);
    }

    if (digits.startsWith(prefix) && digits.length > prefix.length + 5) {
        digits = digits.slice(prefix.length);
    }

    return digits;
}

export function isValidSpanishPhone(value) {
    const digits = nationalPhoneDigits(value, '34');

    return /^[6789]\d{8}$/.test(digits);
}

export function isValidPortuguesePhone(value) {
    const digits = nationalPhoneDigits(value, '351');

    return /^\d{9}$/.test(digits);
}

export function isValidPhoneForCountry(value, country) {
    const digits = nationalPhoneDigits(value, country?.dial || '34');

    if (country?.iso === 'ES') {
        return /^[6789]\d{8}$/.test(digits);
    }

    if (country?.iso === 'PT') {
        return /^\d{9}$/.test(digits);
    }

    return digits.length >= 6 && digits.length <= 15;
}

export function formatInternationalPhone(value, country) {
    const dial = country?.dial || '34';
    const digits = nationalPhoneDigits(value, dial);

    return digits ? `+${dial} ${digits}` : `+${dial}`;
}

export function isValidSpanishNif(value) {
    const raw = String(value).replace(/\s/g, '').toUpperCase();

    if (!raw) {
        return false;
    }

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let body = raw;

    if (/^[XYZ]/.test(body)) {
        body = body.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2');
    }

    if (!/^\d{8}[A-Z]$/.test(body)) {
        return false;
    }

    const number = Number(body.slice(0, 8));
    const letter = body.slice(8);

    return letters[number % 23] === letter;
}

export function isValidSpanishCif(value) {
    const raw = String(value).replace(/\s/g, '').toUpperCase();
    const match = raw.match(/^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/);

    if (!match) {
        return false;
    }

    const letter = match[1];
    const digits = match[2];
    const control = match[3];
    let sum = 0;

    for (let index = 0; index < 7; index += 1) {
        let n = Number(digits[index]);

        if (index % 2 === 0) {
            n *= 2;

            if (n > 9) {
                n = Math.floor(n / 10) + (n % 10);
            }
        }

        sum += n;
    }

    const unit = (10 - (sum % 10)) % 10;
    const controlLetters = 'JABCDEFGHI';

    if ('ABEH'.includes(letter)) {
        return control === String(unit);
    }

    if ('KPQS'.includes(letter)) {
        return control === controlLetters[unit];
    }

    return control === String(unit) || control === controlLetters[unit];
}

export function isValidNif(value) {
    return isValidSpanishNif(value) || isValidSpanishCif(value);
}
