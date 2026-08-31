import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { formatShopifyPrice, productMainImage } from '../lib/format';
import { useCart } from '../lib/cart';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const photo = productMainImage(product);
    const price = formatShopifyPrice(product.price);

    return (
        <article className="group flex h-full flex-col text-center">
            <Link
                to={`/produtos/${product.id}`}
                className="relative block bg-white"
            >
                <div className="relative aspect-square overflow-hidden">
                    {photo ? (
                        <img
                            src={photo}
                            alt={product.name}
                            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-moss">
                            <Package size={48} />
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex flex-1 flex-col px-1 pb-8 pt-4">
                <Link to={`/produtos/${product.id}`}>
                    <h3 className="text-[15px] font-medium leading-6 text-ink underline-offset-4 group-hover:underline">
                        {product.name}
                    </h3>
                </Link>
                {price && (
                    <div className="mt-3 text-sm text-ink">
                        <p className="text-[11px] tracking-wide text-ink/55">
                            Precio normal
                        </p>
                        <p className="mt-0.5">{price}</p>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="mx-auto mt-4 w-full max-w-[220px] rounded-full border border-ink bg-white px-4 py-2.5 text-sm font-medium text-ink"
                >
                    Añadir al carrito
                </button>
            </div>
        </article>
    );
}
