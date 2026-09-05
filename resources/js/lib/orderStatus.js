/**
 * Trois familles de statut, lisibles d'un coup d'oeil :
 *   jaune  = commande en cours (paiement, preparation, expedition)
 *   vert   = commande aboutie (livree)
 *   rouge  = commande annulee
 */
const TONES = {
    pending_payment: 'progress',
    paid: 'progress',
    preparing: 'progress',
    shipped: 'progress',
    delivered: 'done',
    cancelled: 'cancelled',
};

const STYLES = {
    progress: {
        badge: 'bg-amber-100 text-amber-800 ring-amber-200',
        dot: 'bg-amber-500',
        select: 'border-amber-300 bg-amber-50 text-amber-900',
    },
    done: {
        badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
        dot: 'bg-emerald-500',
        select: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    },
    cancelled: {
        badge: 'bg-rose-100 text-rose-800 ring-rose-200',
        dot: 'bg-rose-500',
        select: 'border-rose-300 bg-rose-50 text-rose-900',
    },
};

export function statusTone(status) {
    return TONES[status] || 'progress';
}

/**
 * @param {string} status
 * @param {'badge'|'dot'|'select'} variant
 */
export function statusClass(status, variant = 'badge') {
    return STYLES[statusTone(status)][variant];
}

export const STATUS_LABELS = {
    pending_payment: 'Pago pendiente',
    paid: 'Pago confirmado',
    preparing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};
