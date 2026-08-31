import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoaderCircle, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { formatShopifyPrice } from '../lib/format';

const featuredOrder = [
    'RCK-PEL-450',
    'RCK-PEL-975',
    'RCK-PEL-15KG',
    'RCK-LEN-25KG',
    'RCK-LEN-PALETE',
    'RCK-LEN-TOROS',
];

const sortOptions = [
    { id: 'featured', label: 'Destacados' },
    { id: 'best', label: 'Más relevantes' },
    { id: 'sold', label: 'Más vendidos' },
    { id: 'az', label: 'Alfabéticamente, A-Z' },
    { id: 'za', label: 'Alfabéticamente, Z-A' },
    { id: 'price-asc', label: 'Precio, más baratos' },
    { id: 'price-desc', label: 'Precio, más caros' },
    { id: 'old', label: 'Fecha, más antiguos' },
    { id: 'new', label: 'Fecha, más recientes' },
];

export default function Products() {
    const [params, setParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [inStock, setInStock] = useState(false);
    const [soldOut, setSoldOut] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const cat = params.get('cat') || 'all';
    const query = (params.get('q') || '').trim().toLowerCase();
    const sort = params.get('sort') || 'featured';

    useEffect(() => {
        fetch('/api/products')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No ha sido posible cargar los productos.');
                }

                return response.json();
            })
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const maxCatalogPrice = useMemo(() => {
        const prices = products.map((product) => Number(product.price || 0));

        return prices.length ? Math.max(...prices) : 299;
    }, [products]);

    const inStockCount = products.length;
    const soldOutCount = 0;

    const updateParam = (patch) => {
        const next = new URLSearchParams(params);

        Object.entries(patch).forEach(([key, value]) => {
            if (!value || value === 'all' || value === 'featured') {
                if (key === 'sort' && value === 'featured') {
                    next.delete(key);
                    return;
                }

                if (key === 'cat' && value === 'all') {
                    next.delete(key);
                    return;
                }
            }

            if (!value) {
                next.delete(key);
            } else {
                next.set(key, value);
            }
        });

        setParams(next);
    };

    const resetFilters = () => {
        setInStock(false);
        setSoldOut(false);
        setMinPrice('');
        setMaxPrice('');
        setParams(query ? { q: params.get('q') } : {});
    };

    const filtered = products.filter((product) => {
        const price = Number(product.price || 0);
        const matchesCategory =
            cat === 'all' || product.category === cat;

        if (!matchesCategory) {
            return false;
        }

        if (inStock && !soldOut && !product.is_active) {
            return false;
        }

        if (soldOut && !inStock) {
            return false;
        }

        if (minPrice !== '' && price < Number(minPrice)) {
            return false;
        }

        if (maxPrice !== '' && price > Number(maxPrice)) {
            return false;
        }

        if (!query) {
            return true;
        }

        return `${product.name} ${product.description || ''}`
            .toLowerCase()
            .includes(query);
    });

    const visible = [...filtered].sort((a, b) => {
        if (sort === 'za') {
            return String(b.name).localeCompare(a.name, 'es');
        }

        if (sort === 'price-asc') {
            return Number(a.price || 0) - Number(b.price || 0);
        }

        if (sort === 'price-desc') {
            return Number(b.price || 0) - Number(a.price || 0);
        }

        if (sort === 'old') {
            return Number(a.id) - Number(b.id);
        }

        if (sort === 'new') {
            return Number(b.id) - Number(a.id);
        }

        if (sort === 'az') {
            return String(a.name).localeCompare(b.name, 'es');
        }

        const rank = (product) => {
            const index = featuredOrder.indexOf(product.sku);

            return index === -1 ? featuredOrder.length + product.id : index;
        };

        return rank(a) - rank(b);
    });

    const selectedCount =
        Number(inStock) +
        Number(soldOut) +
        Number(cat !== 'all') +
        Number(minPrice !== '' || maxPrice !== '');

    const filterPanel = (
        <div className="space-y-1 text-sm">
            <p className="pb-3 text-[13px] tracking-wide text-ink/70">
                Filtrar:
            </p>

            <details open className="border-b border-ink/10 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                    Disponibilidad
                    <span className="text-xs font-normal text-ink/50">
                        {Number(inStock) + Number(soldOut)} seleccionada
                    </span>
                </summary>
                <div className="mt-4 space-y-3">
                    <label className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(event) =>
                                    setInStock(event.target.checked)
                                }
                            />
                            En stock
                        </span>
                        <span className="text-ink/45">({inStockCount})</span>
                    </label>
                    <label className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={soldOut}
                                onChange={(event) =>
                                    setSoldOut(event.target.checked)
                                }
                            />
                            Agotado
                        </span>
                        <span className="text-ink/45">({soldOutCount})</span>
                    </label>
                </div>
            </details>

            <details open className="border-b border-ink/10 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                    Precio
                </summary>
                <div className="mt-4 space-y-3">
                    <p className="text-xs text-ink/55">
                        El precio más alto es {formatShopifyPrice(maxCatalogPrice)}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-xs text-ink/60">
                            Desde
                            <span className="mt-1 flex items-center border border-ink/20 bg-white px-2">
                                €
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={minPrice}
                                    onChange={(event) =>
                                        setMinPrice(event.target.value)
                                    }
                                    className="w-full bg-transparent py-2 pl-1 outline-none"
                                />
                            </span>
                        </label>
                        <label className="text-xs text-ink/60">
                            Hasta
                            <span className="mt-1 flex items-center border border-ink/20 bg-white px-2">
                                €
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={maxPrice}
                                    onChange={(event) =>
                                        setMaxPrice(event.target.value)
                                    }
                                    className="w-full bg-transparent py-2 pl-1 outline-none"
                                />
                            </span>
                        </label>
                    </div>
                </div>
            </details>

            <details open className="border-b border-ink/10 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                    Tipo
                </summary>
                <div className="mt-4 space-y-2">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'pellets', label: 'Pellets' },
                        { id: 'lenha', label: 'Leña' },
                    ].map((item) => (
                        <label key={item.id} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="cat"
                                checked={cat === item.id}
                                onChange={() => updateParam({ cat: item.id })}
                            />
                            {item.label}
                        </label>
                    ))}
                </div>
            </details>

            {selectedCount > 0 && (
                <button
                    type="button"
                    onClick={resetFilters}
                    className="pt-4 text-sm underline underline-offset-4"
                >
                    Quitar todo
                </button>
            )}
        </div>
    );

    return (
        <main>
            <section className="px-4 pb-4 pt-10 sm:px-6 md:pt-14">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-semibold md:text-5xl">
                        <span className="sr-only">Colección: </span>
                        Productos
                    </h1>
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6">
                <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
                    <aside className="hidden lg:block">{filterPanel}</aside>

                    <div>
                        <div className="flex items-center justify-between gap-4 border-b border-ink/10 py-4">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(true)}
                                className="inline-flex items-center gap-2 text-sm font-medium lg:hidden"
                            >
                                <SlidersHorizontal size={16} />
                                Filtrar y ordenar
                            </button>
                            <p className="text-sm text-ink/70">
                                {loading
                                    ? 'Cargando…'
                                    : `${visible.length} producto${
                                          visible.length === 1 ? '' : 's'
                                      }`}
                            </p>
                            <label className="hidden items-center gap-2 text-sm lg:flex">
                                <span className="text-ink/60">Ordenar por:</span>
                                <select
                                    value={sort}
                                    onChange={(event) =>
                                        updateParam({ sort: event.target.value })
                                    }
                                    className="border-0 bg-transparent py-1 outline-none"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                    </div>

                    {loading && (
                            <div className="mt-16 flex justify-center gap-2 text-ink">
                                <LoaderCircle className="animate-spin" />
                                Cargando la tienda…
                        </div>
                    )}

                    {!loading && error && (
                            <p className="mt-10 border border-red-200 bg-red-50 p-6 text-red-700">
                                {error}
                            </p>
                        )}

                        {!loading && !error && visible.length === 0 && (
                            <p className="mt-16 text-center text-ink/70">
                                No se han encontrado productos que coincidan
                                con tu selección.
                            </p>
                        )}

                        {!loading && !error && visible.length > 0 && (
                            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                                {visible.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                        </div>
                    )}
                    </div>
                </div>
            </section>

            {filtersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-ink/40"
                        aria-label="Cerrar filtros"
                        onClick={() => setFiltersOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 flex w-[min(100%,360px)] flex-col bg-cream">
                        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
                            <p className="font-semibold">Filtrar y ordenar</p>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                aria-label="Cerrar"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <label className="mb-6 block text-sm">
                                <span className="text-ink/60">Ordenar por:</span>
                                <select
                                    value={sort}
                                    onChange={(event) =>
                                        updateParam({
                                            sort: event.target.value,
                                        })
                                    }
                                    className="mt-2 w-full border border-ink/20 bg-white px-3 py-2"
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {filterPanel}
                        </div>
                        <div className="grid grid-cols-2 gap-3 border-t border-ink/10 p-4">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="border border-ink px-4 py-3 text-sm font-semibold"
                            >
                                Quitar todo
                            </button>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="bg-ink px-4 py-3 text-sm font-semibold text-cream"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
