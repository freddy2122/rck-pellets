import { CircleHelp } from 'lucide-react';
import {
    formatCheckoutGrandTotal,
    formatCheckoutMoney,
    imageUrl,
} from '../lib/format';

export default function OrderSummary({
    items,
    subtotal,
    shipping,
    total,
    tax,
    addressComplete,
}) {
    return (
        <div>
            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 rounded-md border border-[#ddd] bg-white">
                            {imageUrl(item.image) ? (
                                <img
                                    loading="lazy"
                                    decoding="async"
                                    src={imageUrl(item.image)}
                                    alt=""
                                    className="h-full w-full rounded-md object-contain p-1"
                                />
                            ) : null}
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[11px] font-semibold text-white">
                                {item.quantity}
                            </span>
                        </div>
                        <p className="min-w-0 flex-1 text-sm leading-5">
                            {item.name}
                        </p>
                        <p className="shrink-0 text-sm">
                            {formatCheckoutMoney(item.price * item.quantity)}
                        </p>
                    </li>
                ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-[#ddd] pt-5 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCheckoutMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1">
                        Envío
                        <CircleHelp size={14} className="text-[#8a8a8a]" />
                    </span>
                    {addressComplete && shipping ? (
                        <span>{formatCheckoutMoney(shipping.price)}</span>
                    ) : (
                        <span className="text-[#6d6d6d]">
                            Introducir la dirección de envío
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-[#ddd] pt-5">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-semibold">
                    {formatCheckoutGrandTotal(total)}
                </span>
            </div>
            <p className="mt-2 text-right text-xs text-[#6d6d6d]">
                Incluye {formatCheckoutMoney(tax)} en impuestos
            </p>
        </div>
    );
}
