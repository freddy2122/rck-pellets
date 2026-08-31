import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatShopifyAmount, formatShopifyPrice, imageUrl } from '../lib/format';

export default function Cart() {
    const { items, subtotal, updateQuantity, removeItem, note, setNote } =
        useCart();
    const empty = items.length === 0;

    return (
        <main className="px-4 py-10 sm:px-8 md:py-14 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-end justify-between gap-4">
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                        Tu carrito
                    </h1>
                    <Link
                        to="/produtos"
                        className="mb-1 text-sm underline underline-offset-4"
                    >
                        Seguir comprando
                    </Link>
                </div>

                {empty ? (
                    <div className="mt-10 border-t border-ink/10 pt-10">
                        <h2 className="text-2xl font-semibold">
                            Tu carrito está vacío
                        </h2>
                        <Link
                            to="/produtos"
                            className="mt-6 inline-flex rounded-md bg-brand px-8 py-3.5 text-sm font-semibold text-white"
                        >
                            Seguir comprando
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8">
                        <div className="hidden border-b border-ink/10 pb-2 text-[11px] uppercase tracking-[0.16em] text-ink/45 md:grid md:grid-cols-[minmax(0,1fr)_220px_120px]">
                            <p>Produto</p>
                            <p className="text-center">Cantidad</p>
                            <p className="text-right">Total</p>
                        </div>

                        <ul>
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-ink/10 py-8 md:grid-cols-[minmax(0,1fr)_220px_120px] md:items-start"
                                >
                                    <div className="flex gap-4 md:col-start-1">
                                        <Link
                                            to={`/produtos/${item.id}`}
                                            className="h-[88px] w-[88px] shrink-0 overflow-hidden bg-white"
                                        >
                                            {imageUrl(item.image) ? (
                                                <img
                                                    src={imageUrl(item.image)}
                                                    alt=""
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="h-full bg-cream" />
                                            )}
                                        </Link>
                                        <div className="min-w-0 pt-0.5">
                                            <Link
                                                to={`/produtos/${item.id}`}
                                                className="text-[15px] font-medium leading-6"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-ink/55">
                                                {formatShopifyAmount(
                                                    item.price,
                                                )}
                                            </p>
                                            <div className="mt-4 flex items-center gap-3 md:hidden">
                                                <QuantityControl
                                                    item={item}
                                                    updateQuantity={
                                                        updateQuantity
                                                    }
                                                />
                                                <RemoveButton
                                                    item={item}
                                                    removeItem={removeItem}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden items-center justify-center gap-3 pt-2 md:flex">
                                        <QuantityControl
                                            item={item}
                                            updateQuantity={updateQuantity}
                                        />
                                        <RemoveButton
                                            item={item}
                                            removeItem={removeItem}
                                        />
                                    </div>

                                    <p className="hidden pt-2 text-right text-[15px] md:block">
                                        {formatShopifyAmount(
                                            item.price * item.quantity,
                                        )}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-10 grid gap-10 pt-2 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                    <label className="block max-w-xl">
                        <span className="text-[15px]">
                            Instrucciones especiales del pedido
                        </span>
                        <textarea
                            rows="5"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            className="mt-3 w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                        />
                    </label>

                    <div className="lg:pt-1">
                        <div className="flex items-baseline justify-end gap-6">
                            <h2 className="text-xl font-semibold">
                                Total estimado
                            </h2>
                            <p className="text-xl font-semibold">
                                {formatShopifyPrice(subtotal)}
                            </p>
                        </div>
                        <p className="mt-3 text-right text-sm leading-6 text-ink/65">
                            Impuestos incluidos. Descuentos y{' '}
                            <Link to="/envios" className="underline">
                                envío
                            </Link>{' '}
                            calculados al finalizar la compra.
                        </p>

                        {empty ? (
                            <button
                                type="button"
                                disabled
                                className="mt-6 w-full rounded-lg bg-brand/40 py-3.5 text-sm font-semibold text-white"
                            >
                                Finalizar la compra
                            </button>
                        ) : (
                            <Link
                                to="/encomenda"
                                className="mt-6 flex w-full justify-center rounded-lg bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand/90"
                            >
                                Finalizar la compra
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function QuantityControl({ item, updateQuantity }) {
    return (
        <div className="inline-flex items-center rounded-md border border-ink/25">
            <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-11 w-11 items-center justify-center text-ink/70"
                aria-label="Disminuir cantidad"
            >
                <Minus size={14} />
            </button>
            <span className="min-w-8 text-center text-sm tabular-nums">
                {item.quantity}
            </span>
            <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-ink/70"
                aria-label="Aumentar cantidad"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

function RemoveButton({ item, removeItem }) {
    return (
        <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex h-10 w-10 items-center justify-center text-ink/45 hover:text-ink"
            aria-label={`Quitar ${item.name}`}
        >
            <Trash2 size={16} strokeWidth={1.6} />
        </button>
    );
}
