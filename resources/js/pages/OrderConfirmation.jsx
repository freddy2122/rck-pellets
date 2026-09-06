import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import CheckoutShell from '../components/CheckoutShell';
import OrderSummary from '../components/OrderSummary';
import { paymentLabel, readLastOrder } from '../lib/checkout';
import { formatCheckoutMoney, formatIban } from '../lib/format';
import {
    estimatedDeliveryDate,
    formatDeliveryDate,
} from '../lib/delivery';
import { SITE } from '../lib/site';

export default function OrderConfirmation() {
    const { token } = useParams();
    const [newsletter, setNewsletter] = useState(false);
    const [remoteOrder, setRemoteOrder] = useState(null);
    const [bank, setBank] = useState(SITE.bank);
    const [loading, setLoading] = useState(Boolean(token));
    const sessionOrder = useMemo(
        () => (typeof window === 'undefined' ? null : readLastOrder()),
        [],
    );

    useEffect(() => {
        fetch('/api/site-content/bank')
            .then((response) => (response.ok ? response.json() : SITE.bank))
            .then((data) => {
                if (data && typeof data === 'object') {
                    setBank({ ...SITE.bank, ...data });
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return undefined;
        }

        let cancelled = false;

        fetch(`/api/orders/${token}`)
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => {
                if (!cancelled) {
                    setRemoteOrder(data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setRemoteOrder(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    const order = remoteOrder || sessionOrder;

    if (loading) {
        return (
            <CheckoutShell showBag={false} summary={null}>
                <p className="text-sm text-[#6d6d6d]">Cargando pedido…</p>
            </CheckoutShell>
        );
    }

    if (!order) {
        return (
            <CheckoutShell showBag={false} summary={null}>
                <h1 className="text-2xl font-semibold">Sin pedido</h1>
                <p className="mt-3 text-sm text-[#6d6d6d]">
                    No hemos encontrado un pedido reciente en este navegador.
                </p>
                <Link
                    to="/produtos"
                    className="mt-6 inline-flex rounded-lg bg-[#1773b8] px-6 py-3 text-sm font-semibold text-white"
                >
                    Volver a la tienda
                </Link>
            </CheckoutShell>
        );
    }

    const fullName = `${order.firstName} ${order.lastName}`.trim();
    const billingSame = true;
    const amount = formatCheckoutMoney(order.total);
    const deliveryLabel =
        order.estimatedDeliveryLabel ||
        formatDeliveryDate(
            estimatedDeliveryDate(order.createdAt || new Date(), 5),
        );
    const trackTo = `/seguir-pedido?n=${encodeURIComponent(order.id || '')}&email=${encodeURIComponent(order.email || '')}`;

    return (
        <CheckoutShell
            showBag={false}
            summary={
                <OrderSummary
                    items={order.items}
                    subtotal={order.subtotal}
                    shipping={order.shipping}
                    total={order.total}
                    tax={order.tax}
                    addressComplete
                />
            }
        >
            <div className="flex items-start gap-3">
                <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#1773b8] text-[#1773b8]">
                    <Check size={22} strokeWidth={2.4} />
                </span>
                <div>
                    <p className="text-sm text-[#6d6d6d]">
                        Confirmación #{order.id}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                        Gracias, {order.firstName}!
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                        Entrega estimada:{' '}
                        <strong>{deliveryLabel}</strong> · 5 días laborables.
                    </p>
                    <Link
                        to={trackTo}
                        className="mt-3 inline-flex text-sm font-semibold text-[#1773b8] hover:underline"
                    >
                        Seguir mi pedido
                    </Link>
                </div>
            </div>

            <section className="mt-8 overflow-hidden rounded-lg border border-[#ddd]">
                <div className="px-5 py-5">
                    <h2 className="text-lg font-semibold">
                        Hemos recibido tu pedido
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                        Completa el pago por transferencia SEPA con los datos
                        siguientes. Recibirás un e-mail de confirmación cuando
                        identifiquemos el ingreso ({paymentLabel(order.payment)}
                        ) en {order.email} o al {SITE.phone}.
                    </p>

                    <div className="mt-4 rounded-lg bg-[#ffffff] px-4 py-4">
                        <h3 className="text-sm font-semibold">
                            {order.payment === 'cajero'
                                ? 'Instrucciones de ingreso'
                                : 'Instrucciones de transferencia'}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#6d6d6d]">
                            {order.payment === 'cajero'
                                ? 'Ingresa el importe en un cajero automático o en la ventanilla de tu banco. Usa el número de pedido como concepto.'
                                : 'Usa el número de pedido como concepto para identificar el pago.'}
                        </p>
                        <div className="mt-3 grid gap-3">
                            <CopyRow
                                label="Titular"
                                value={bank.holder}
                            />
                            {bank.name ? (
                                <CopyRow
                                    label="Banco"
                                    value={bank.name}
                                />
                            ) : null}
                            <CopyRow
                                label="IBAN"
                                value={formatIban(bank.iban)}
                                copyValue={bank.iban}
                            />
                            <CopyRow
                                label="BIC / SWIFT"
                                value={bank.bic}
                            />
                            <CopyRow
                                label="Concepto"
                                value={order.id}
                            />
                            <CopyRow label="Importe" value={amount} />
                        </div>
                    </div>
                </div>
                <label className="flex items-center gap-2 border-t border-[#eee] px-5 py-3 text-sm">
                    <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(event) =>
                            setNewsletter(event.target.checked)
                        }
                        className="h-4 w-4 rounded border-[#bbb]"
                    />
                    Enviadme un e-mail con noticias y ofertas
                </label>
            </section>

            <section className="mt-6 overflow-hidden rounded-lg border border-[#ddd]">
                <h2 className="px-5 py-4 text-lg font-semibold">
                    Detalles del pedido
                </h2>
                <div className="grid gap-8 border-t border-[#eee] px-5 py-5 sm:grid-cols-2">
                    <Detail title="Información de contacto">
                        {order.email}
                    </Detail>
                    <Detail title="Método de pago">
                        <span className="inline-flex items-center gap-2">
                            {paymentLabel(order.payment)} · {amount} EUR
                        </span>
                        <p className="mt-2">
                            IBAN {formatIban(bank.iban)}
                            <br />
                            BIC {bank.bic}
                        </p>
                    </Detail>
                    <Detail title="Dirección de envío">
                        <AddressBlock order={order} />
                    </Detail>
                    <Detail title="Dirección de facturación">
                        {billingSame ? (
                            <AddressBlock order={order} />
                        ) : null}
                    </Detail>
                    <Detail title="Método de envío">
                        {order.shipping?.label || 'Estándar'}
                        <p className="mt-1">
                            Entrega estimada: {deliveryLabel}
                        </p>
                    </Detail>
                </div>
            </section>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm">
                    ¿Necesitas ayuda?{' '}
                    <Link to="/contactos" className="text-[#1773b8]">
                        Contáctanos
                    </Link>
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to={trackTo}
                        className="inline-flex rounded-lg border border-[#1773b8] px-6 py-3 text-sm font-semibold text-[#1773b8]"
                    >
                        Seguir mi pedido
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex rounded-lg bg-[#1773b8] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </div>
            <p className="sr-only">{fullName}</p>
        </CheckoutShell>
    );
}

function CopyRow({ label, value, copyValue }) {
    const [copied, setCopied] = useState(false);
    const text = copyValue || value;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(text).replace(/\s/g, ''));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="flex items-start justify-between gap-3 border-b border-[#ececec] pb-3 last:border-b-0 last:pb-0">
            <div>
                <p className="text-[11px] uppercase tracking-wide text-[#6d6d6d]">
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-medium tracking-wide text-[#1a1a1a]">
                    {value}
                </p>
            </div>
            <button
                type="button"
                onClick={handleCopy}
                className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6d6d6d] hover:bg-white hover:text-[#1a1a1a]"
                aria-label={`Copiar ${label}`}
            >
                {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
        </div>
    );
}

function Detail({ title, children }) {
    return (
        <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                {children}
            </div>
        </div>
    );
}

function AddressBlock({ order }) {
    return (
        <p>
            {order.firstName} {order.lastName}
            {order.company ? (
                <>
                    <br />
                    {order.company}
                </>
            ) : null}
            <br />
            {order.street}
            {order.address2 ? (
                <>
                    <br />
                    {order.address2}
                </>
            ) : null}
            <br />
            {order.postalCode} {order.city}
            <br />
            {order.district}, España
            <br />
            {order.phone}
        </p>
    );
}
