import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LoaderCircle, Minus, Package, Plus } from 'lucide-react';
import { formatShopifyPrice, productImages, productMainImage } from '../lib/format';
import { useCart } from '../lib/cart';
import { SITE } from '../lib/site';

export default function ProductDetail() {
    const { id } = useParams();
    const { addItem, items } = useCart();
    const [product, setProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [catalog, setCatalog] = useState([]);

    useEffect(() => {
        setQuantity(1);
        setCopied(false);
        setError('');
        setProduct(null);

        fetch(`/api/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Producto no encontrado.');
                }

                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setActiveIndex(0);
            })
            .catch((err) => setError(err.message));

        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => setCatalog(Array.isArray(data) ? data : []))
            .catch(() => setCatalog([]));
    }, [id]);

    if (error) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-20 text-center">
                <p className="text-lg">{error}</p>
                <Link to="/produtos" className="mt-4 inline-block underline">
                    Volver al catálogo
                </Link>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="flex justify-center py-24 text-ink">
                <LoaderCircle className="animate-spin" />
            </main>
        );
    }

    const gallery = productImages(product);
    const photo = gallery[activeIndex] || productMainImage(product);
    const price = formatShopifyPrice(product.price);
    const inCart =
        items.find((item) => item.id === product.id)?.quantity || 0;
    const related = catalog
        .filter((item) => item.id !== product.id)
        .sort((a, b) => {
            const sameA = a.category === product.category ? 0 : 1;
            const sameB = b.category === product.category ? 0 : 1;

            return sameA - sameB;
        })
        .slice(0, 4);

    const goTo = (next) => {
        if (gallery.length === 0) {
            return;
        }

        setActiveIndex((next + gallery.length) % gallery.length);
    };

    const share = async () => {
        const url = window.location.href;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    return (
        <main>
            <section className="px-4 py-8 sm:px-6 md:py-12">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <div className="relative bg-white">
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={product.name}
                                    fetchPriority="high"
                                    decoding="async"
                                    className="aspect-square w-full object-contain p-4 md:p-8"
                                />
                            ) : (
                                <div className="flex aspect-square items-center justify-center text-moss">
                                    <Package size={72} />
                                </div>
                            )}

                            {gallery.length > 0 && (
                                <p className="absolute bottom-3 left-3 text-xs text-ink/60">
                                    {activeIndex + 1} de {gallery.length}
                                </p>
                            )}

                            {gallery.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => goTo(activeIndex - 1)}
                                        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goTo(activeIndex + 1)}
                                        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {gallery.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {gallery.map((src, index) => (
                                    <button
                                        key={src + index}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden border ${
                                            index === activeIndex
                                                ? 'border-ink'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            className="h-full w-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                            {product.name}
                        </h1>

                        {price && (
                            <div className="mt-5">
                                <p className="text-xs text-ink/55">
                                    Precio normal
                                </p>
                                <p className="mt-1 text-xl">{price}</p>
                            </div>
                        )}

                        <p className="mt-3 text-sm text-ink/70">
                            Impuestos incluidos.{' '}
                            <Link to="/envios" className="underline">
                                Envío
                            </Link>{' '}
                            calculado al finalizar la compra.
                        </p>

                        <div className="mt-8">
                            <div className="flex items-end justify-between text-sm">
                                <p>Cantidad</p>
                                <p className="text-ink/55">
                                    ({inCart} en el carrito)
                                </p>
                            </div>
                            <div className="mt-2 inline-flex items-center border border-ink/20">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((value) =>
                                            Math.max(1, value - 1),
                                        )
                                    }
                                    className="flex h-11 w-11 items-center justify-center"
                                    aria-label={`Disminuir la cantidad de ${product.name}`}
                                >
                                    <Minus size={14} />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                Number(event.target.value) || 1,
                                            ),
                                        )
                                    }
                                    className="h-11 w-14 border-x border-ink/20 bg-transparent text-center outline-none"
                                    aria-label="Cantidad"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((value) => value + 1)
                                    }
                                    className="flex h-11 w-11 items-center justify-center"
                                    aria-label={`Aumentar la cantidad de ${product.name}`}
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => addItem(product, quantity)}
                            className="mt-5 w-full rounded-full border border-ink bg-white py-3.5 text-sm font-medium text-ink"
                        >
                            Añadir al carrito
                        </button>

                        <div className="mt-8 space-y-1 text-sm leading-7">
                            <p>
                                <strong>Plazo de entrega:</strong> 2 a 5 días
                                laborables
                            </p>
                            <p>
                                <strong>Devoluciones:</strong> 14 días laborables
                            </p>
                            <p>
                                <strong>Gastos de envío:</strong>{' '}
                                {SITE.shipping.mainlandPrice
                                    .toFixed(2)
                                    .replace('.', ',')}
                                €
                            </p>
                        </div>

                        <div className="product-description mt-8 space-y-4 text-sm leading-7 text-ink/80">
                            {product.description?.includes('<') ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.description,
                                    }}
                                />
                            ) : (
                                <p className="whitespace-pre-line">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 border-t border-ink/10 pt-5">
                            <button
                                type="button"
                                onClick={share}
                                className="text-sm underline underline-offset-4"
                            >
                                {copied
                                    ? 'Enlace copiado'
                                    : 'Compartir · Copiar enlace'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="px-4 py-10 sm:px-6 md:py-14">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="text-2xl font-bold text-ink md:text-3xl">
                            También te puede gustar
                        </h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <RelatedCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

function RelatedCard({ product }) {
    const photo = productMainImage(product);

    return (
        <Link
            to={`/produtos/${product.id}`}
            className="overflow-hidden rounded-2xl"
        >
            <div className="bg-white">
                <div className="aspect-square">
                    {photo ? (
                        <img
                            src={photo}
                            alt={product.name}
                            className="h-full w-full object-contain p-4"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-moss">
                            <Package size={40} />
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-[#eadfce] px-4 py-5 text-center">
                <h3 className="line-clamp-2 text-sm font-bold leading-5 text-ink">
                    {product.name}
                </h3>
            </div>
        </Link>
    );
}
