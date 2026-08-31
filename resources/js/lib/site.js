export const SITE = {
    name: 'Jardines leña Shop',
    legalName: 'Jardines Gerardo',
    nif: 'B45617404',
    nifFormatted: 'B45617404',
    email: 'contato@rckpelletslda.pt',
    phone: '+34 696 10 20 70',
    phoneHref: 'tel:+34696102070',
    whatsapp: '34696102070',
    whatsappDisplay: '+34 696 10 20 70',
    hours: 'Lunes a viernes, de 9:00 a 18:00',
    capital: '€ 50.000,00',
    conservatoria: 'Registro Mercantil',
    address: {
        street: 'Carretera C-155, 24',
        postalCode: '08213',
        city: 'Polinyà',
        district: 'Barcelona',
        country: 'España',
    },
    shipping: {
        mainland: '2 a 5 días laborables (Península)',
        islands: '5 a 10 días laborables (Baleares, Canarias, Ceuta y Melilla)',
        freeFrom: 250,
        mainlandPrice: 2.99,
        islandsPrice: 24.9,
    },
    bank: {
        holder: 'Jardines Gerardo',
        name: '',
        iban: '',
        bic: '',
    },
};

export const PROVINCES = [
    'Álava',
    'Albacete',
    'Alicante',
    'Almería',
    'Asturias',
    'Ávila',
    'Badajoz',
    'Barcelona',
    'Burgos',
    'Cáceres',
    'Cádiz',
    'Cantabria',
    'Castellón',
    'Ceuta',
    'Ciudad Real',
    'Córdoba',
    'Cuenca',
    'Gerona',
    'Granada',
    'Guadalajara',
    'Guipúzcoa',
    'Huelva',
    'Huesca',
    'Islas Baleares',
    'Jaén',
    'La Coruña',
    'La Rioja',
    'Las Palmas',
    'León',
    'Lérida',
    'Lugo',
    'Madrid',
    'Málaga',
    'Melilla',
    'Murcia',
    'Navarra',
    'Orense',
    'Palencia',
    'Pontevedra',
    'Salamanca',
    'Santa Cruz de Tenerife',
    'Segovia',
    'Sevilla',
    'Soria',
    'Tarragona',
    'Teruel',
    'Toledo',
    'Valencia',
    'Valladolid',
    'Vizcaya',
    'Zamora',
    'Zaragoza',
];

export const DISTRICTS = PROVINCES;

export function phoneDigits(phone = SITE.phone) {
    const digits = String(phone).replace(/\D/g, '');

    if (digits.length === 9 && !digits.startsWith('34')) {
        return `34${digits}`;
    }

    return digits;
}

export function fullAddress(address = SITE.address) {
    const { street, postalCode, city, district, country } = address;

    return `${street}, ${postalCode} ${city}, ${district}, ${country}`;
}

export function whatsappLink(
    text = 'Hola, me gustaría pedir leña o carbón.',
    whatsapp = SITE.whatsapp,
) {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
