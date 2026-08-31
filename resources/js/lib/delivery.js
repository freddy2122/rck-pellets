export function addBusinessDays(from, days) {
    const date = new Date(from);

    if (Number.isNaN(date.getTime())) {
        return addBusinessDays(new Date(), days);
    }

    date.setHours(12, 0, 0, 0);
    let added = 0;

    while (added < days) {
        date.setDate(date.getDate() + 1);
        const weekday = date.getDay();

        if (weekday !== 0 && weekday !== 6) {
            added += 1;
        }
    }

    return date;
}

export function estimatedDeliveryDate(from = new Date(), days = 5) {
    return addBusinessDays(from, days);
}

export function formatDeliveryDate(value) {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const formatted = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export const ORDER_STATUSES = [
    {
        id: 'received',
        label: 'Pedido recibido',
        detail: 'Hemos registrado tu pedido.',
    },
    {
        id: 'paid',
        label: 'Pago confirmado',
        detail: 'Hemos identificado el pago y preparamos el envío.',
    },
    {
        id: 'shipped',
        label: 'Enviado',
        detail: 'El transportista recoge el pedido.',
    },
    {
        id: 'delivered',
        label: 'Entregado',
        detail: 'El pedido llega a la dirección de envío.',
    },
];

export function trackingStepIndex(status) {
    if (status === 'delivered') {
        return 3;
    }

    if (status === 'shipped') {
        return 2;
    }

    if (status === 'paid' || status === 'preparing') {
        return 1;
    }

    return 0;
}
