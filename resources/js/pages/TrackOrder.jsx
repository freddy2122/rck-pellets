import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SITE } from '../lib/site';
import { statusClass } from '../lib/orderStatus';
import {
    ORDER_STATUSES,
    formatDeliveryDate,
    trackingStepIndex,
} from '../lib/delivery';

export default function TrackOrder() {
    const [params] = useSearchParams();
    const [number, setNumber] = useState(params.get('n') || '');
    const [email, setEmail] = useState(params.get('email') || '');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const step = trackingStepIndex(order?.status);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);

        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    number: number.trim(),
                    email: email.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'No ha sido posible consultar el pedido.',
                );
            }

            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <section className="px-4 pb-4 pt-10 sm:px-6 md:pt-14">
                <div className="mx-auto max-w-xl">
                    <h1 className="text-4xl font-semibold md:text-5xl">
                        Seguir mi pedido
                    </h1>
                    <p className="mt-4 text-base leading-7 text-ink/75">
                        Introduce el número de pedido y el e-mail usado en la
                        compra. Te mostramos el estado y la fecha estimada de
                        entrega (5 días laborables en Península).
                    </p>
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6">
                <div className="mx-auto max-w-xl">
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-3 rounded-lg border border-ink/10 bg-white p-5"
                    >
                        <label className="block text-sm">
                            <span className="mb-1 block text-[#6d6d6d]">
                                Número de pedido
                            </span>
                            <input
                                value={number}
                                onChange={(event) =>
                                    setNumber(event.target.value)
                                }
                                placeholder="1003"
                                required
                                className="w-full rounded-lg border border-[#d0d0d0] px-3 py-3 outline-none focus:border-[#1773b8]"
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="mb-1 block text-[#6d6d6d]">
                                E-mail
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="tu@email.com"
                                required
                                className="w-full rounded-lg border border-[#d0d0d0] px-3 py-3 outline-none focus:border-[#1773b8]"
                            />
                        </label>
                        {error ? (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        ) : null}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 rounded-lg bg-[#1773b8] py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {loading ? 'Buscando…' : 'Consultar pedido'}
                        </button>
                    </form>

                    {order ? <TrackingResult order={order} step={step} /> : null}

                    <p className="mt-8 text-sm text-ink/65">
                        ¿Necesitas ayuda?{' '}
                        <Link to="/contactos" className="text-[#1773b8] underline">
                            Contáctanos
                        </Link>{' '}
                        en {SITE.phone}.
                    </p>
                </div>
            </section>
        </main>
    );
}

function TrackingResult({ order, step }) {
    const deliveryLabel =
        order.estimatedDeliveryLabel ||
        formatDeliveryDate(order.estimatedDelivery);

    return (
        <div className="mt-8 overflow-hidden rounded-lg border border-[#ddd]">
            <div className="border-b border-[#eee] px-5 py-4">
                <p className="text-sm text-[#6d6d6d]">Pedido #{order.id}</p>
                <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold">
                    <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusClass(
                            order.status,
                            'dot',
                        )}`}
                    />
                    {order.statusLabel || 'Pedido recibido'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4d4d4d]">
                    Entrega estimada:{' '}
                    <strong>{deliveryLabel}</strong> (5 días laborables).
                </p>
            </div>
            <ol className="space-y-4 px-5 py-5">
                {ORDER_STATUSES.map((item, index) => {
                    const done = index <= step;
                    const current = index === step;

                    return (
                        <li key={item.id} className="flex gap-3">
                            <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                                    done
                                        ? 'bg-[#1773b8] text-white'
                                        : 'border border-[#d0d0d0] text-[#8a8a8a]'
                                }`}
                            >
                                {index + 1}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-semibold ${
                                        current ? 'text-[#1773b8]' : ''
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p className="text-sm text-[#6d6d6d]">
                                    {item.detail}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ol>
            {order.token ? (
                <div className="border-t border-[#eee] px-5 py-4">
                    <Link
                        to={`/encomenda/confirmacao/${order.token}`}
                        className="text-sm font-semibold text-[#1773b8] hover:underline"
                    >
                        Ver confirmación e IBAN
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
