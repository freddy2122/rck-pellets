import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import CheckoutShell from '../components/CheckoutShell';
import OrderSummary from '../components/OrderSummary';
import PhoneField from '../components/PhoneField';
import {
    Mastercard,
    Multibanco,
    Visa,
} from '../components/PaymentMethods';
import { useCart } from '../lib/cart';
import {
    PAYMENT_METHODS,
    addressIsComplete,
    makeOrderId,
    readCheckoutDraft,
    saveCheckoutDraft,
    saveLastOrder,
    shippingFor,
    totalsFor,
} from '../lib/checkout';
import { PROVINCES } from '../lib/site';
import { findPhoneCountry } from '../lib/phoneCountries';
import {
    formatCheckoutMoney,
    formatInternationalPhone,
    includedVat,
    isValidNif,
    isValidPhoneForCountry,
} from '../lib/format';
import { useSite } from '../lib/SiteContext';

const inputClass =
    'peer w-full rounded-lg border border-[#d0d0d0] bg-white px-3 pb-2 pt-5 text-sm outline-none placeholder:text-transparent focus:border-[#1773b8] focus:ring-1 focus:ring-[#1773b8]';
const labelClass =
    'pointer-events-none absolute left-3 top-1.5 text-[11px] text-[#737373] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm';

const emptyForm = {
    email: '',
    newsletter: true,
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    address2: '',
    postalCode: '',
    city: '',
    district: '',
    phone: '',
    phoneCountry: 'ES',
    nif: '',
    showNif: false,
    payment: 'multibanco',
    billingSame: true,
    notes: '',
};

function paymentLogos(id) {
    if (id === 'cartao') {
        return (
            <span className="flex items-center gap-1">
                <Visa />
                <Mastercard />
            </span>
        );
    }

    if (id === 'multibanco') {
        return <Multibanco />;
    }

    return null;
}

export default function Checkout() {
    const { items, subtotal, clearCart, note, token: cartToken, identify } = useCart();
    const site = useSite();
    const navigate = useNavigate();
    const [form, setForm] = useState(() => {
        const draft = typeof window === 'undefined' ? null : readCheckoutDraft();

        const merged = {
            ...emptyForm,
            ...draft,
            notes: draft?.notes || note || '',
        };

        if (!PROVINCES.includes(merged.district)) {
            merged.district = '';
        }

        merged.phoneCountry = findPhoneCountry(merged.phoneCountry).iso;

        if (merged.payment === 'mbway') {
            merged.payment = 'transferencia';
        }

        return merged;
    });
    const [loading, setLoading] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    const complete = addressIsComplete(form);
    const shipping = shippingFor(form);
    const totals = totalsFor(subtotal, shipping);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setSaved(false);
        setError('');
    };

    const handleSaveDraft = () => {
        saveCheckoutDraft(form);
        setSaved(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!form.email.trim()) {
            setError('Indica un e-mail de contacto.');
            return;
        }

        if (!form.firstName.trim() || !form.lastName.trim()) {
            setError('Indica el nombre y los apellidos.');
            return;
        }

        if (!complete) {
            setError(
                'Completa la dirección, incluido el código postal de 5 dígitos.',
            );
            return;
        }

        const phoneCountry = findPhoneCountry(form.phoneCountry);

        if (!isValidPhoneForCountry(form.phone, phoneCountry)) {
            setError('Indica un teléfono válido.');
            return;
        }

        if (form.showNif && form.nif && !isValidNif(form.nif)) {
            setError('El NIF/NIE indicado no es válido.');
            return;
        }

        const phone = formatInternationalPhone(form.phone, phoneCountry);
        const payload = {
            email: form.email,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone,
            company: form.company,
            street: form.street,
            address2: form.address2,
            postalCode: form.postalCode,
            city: form.city,
            district: form.district,
            nif: form.nif,
            payment: form.payment,
            newsletter: form.newsletter,
            items: items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            shipping,
            subtotal: totals.subtotal,
            total: totals.total,
            tax: totals.tax,
            cartToken,
        };

        setLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'No ha sido posible enviar el pedido.',
                );
            }

            const placedOrder = data.order || {
                ...payload,
                id: makeOrderId(),
            };

            saveLastOrder(placedOrder);

            setPlaced(true);
            clearCart();
            navigate(
                placedOrder.token
                    ? `/encomenda/confirmacao/${placedOrder.token}`
                    : '/encomenda/confirmacao',
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && !placed) {
        return <Navigate to="/carrinho" replace />;
    }

    return (
        <CheckoutShell
            summary={
                <OrderSummary
                    items={items}
                    subtotal={totals.subtotal}
                    shipping={shipping}
                    total={complete ? totals.total : totals.subtotal}
                    tax={complete ? totals.tax : includedVat(totals.subtotal)}
                    addressComplete={complete}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <section>
                    <h2 className="text-lg font-semibold">
                        Información de contacto
                    </h2>
                    <div className="relative mt-3">
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="E-mail"
                            className={inputClass}
                            autoComplete="email"
                            onBlur={() =>
                                identify({
                                    email: form.email,
                                    firstName: form.firstName,
                                    lastName: form.lastName,
                                })
                            }
                        />
                        <span className={labelClass}>E-mail</span>
                    </div>
                    <label className="mt-3 flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="newsletter"
                            checked={form.newsletter}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-[#bbb]"
                        />
                        Quiero recibir un e-mail con noticias y ofertas
                    </label>
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Dirección de envío</h2>
                    <div className="mt-3 grid gap-3">
                        <label className="relative block">
                            <select
                                name="country"
                                value="España"
                                disabled
                                className={`${inputClass} appearance-none bg-[#fafafa] text-[#1a1a1a]`}
                            >
                                <option>España</option>
                            </select>
                            <span className="absolute left-3 top-1.5 text-[11px] text-[#737373]">
                                País/región
                            </span>
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <FloatingField
                                name="firstName"
                                label="Nombre"
                                value={form.firstName}
                                onChange={handleChange}
                                autoComplete="given-name"
                                required
                            />
                            <FloatingField
                                name="lastName"
                                label="Apellidos"
                                value={form.lastName}
                                onChange={handleChange}
                                autoComplete="family-name"
                                required
                            />
                        </div>
                        <FloatingField
                            name="company"
                            label="Empresa (opcional)"
                            value={form.company}
                            onChange={handleChange}
                            autoComplete="organization"
                        />
                        <FloatingField
                            name="street"
                            label="Dirección"
                            value={form.street}
                            onChange={handleChange}
                            autoComplete="street-address"
                            required
                        />
                        <FloatingField
                            name="address2"
                            label="Piso, portal, etc. (opcional)"
                            value={form.address2}
                            onChange={handleChange}
                            autoComplete="address-line2"
                        />
                        <div className="grid gap-3 sm:grid-cols-3">
                            <FloatingField
                                name="postalCode"
                                label="Código postal"
                                value={form.postalCode}
                                onChange={handleChange}
                                autoComplete="postal-code"
                                inputMode="numeric"
                                maxLength={5}
                                required
                            />
                            <FloatingField
                                name="city"
                                label="Ciudad"
                                value={form.city}
                                onChange={handleChange}
                                autoComplete="address-level2"
                                required
                            />
                            <label className="relative block">
                                <select
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    required
                                    autoComplete="address-level1"
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" disabled>
                                        Provincia
                                    </option>
                                    {PROVINCES.map((province) => (
                                        <option key={province} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute left-3 top-1.5 text-[11px] text-[#737373]">
                                    Provincia
                                </span>
                            </label>
                        </div>
                        <PhoneField
                            value={form.phone}
                            country={form.phoneCountry}
                            required
                            onChange={handleChange}
                            onCountryChange={(iso) => {
                                setForm((current) => ({
                                    ...current,
                                    phoneCountry: iso,
                                }));
                                setSaved(false);
                                setError('');
                            }}
                        />
                    </div>

                    {form.showNif ? (
                        <div className="mt-3">
                            <FloatingField
                                name="nif"
                                label="NIF/NIE"
                                value={form.nif}
                                onChange={handleChange}
                            />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                setForm((current) => ({
                                    ...current,
                                    showNif: true,
                                }))
                            }
                            className="mt-3 text-sm text-[#1773b8] hover:underline"
                        >
                            + Añadir número de identificación fiscal
                        </button>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Envío</h2>
                    {complete && shipping ? (
                        <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-[#1773b8] bg-[#f0f5ff] px-4 py-3">
                            <span className="flex items-center gap-3 text-sm">
                                <span className="h-4 w-4 rounded-full border-[5px] border-[#1773b8]" />
                                {shipping.label}
                                <span className="text-[#6d6d6d]">
                                    {shipping.detail}
                                </span>
                            </span>
                            <span className="text-sm font-medium">
                                {formatCheckoutMoney(shipping.price)}
                            </span>
                        </label>
                    ) : (
                        <p className="mt-3 rounded-lg bg-[#f5f5f5] px-4 py-3 text-sm text-[#6d6d6d]">
                            Introduce la dirección de entrega para ver los
                            métodos de envío disponibles
                        </p>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Pago</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#6d6d6d]">
                        Todas las transacciones son seguras y están cifradas.
                        <Lock size={12} />
                    </p>

                    <div className="mt-3 overflow-hidden rounded-lg border border-[#d0d0d0]">
                        {PAYMENT_METHODS.map((method, index) => {
                            const selected = form.payment === method.id;

                            return (
                                <div
                                    key={method.id}
                                    className={
                                        index > 0
                                            ? 'border-t border-[#d0d0d0]'
                                            : ''
                                    }
                                >
                                    <label
                                        className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-3 ${
                                            selected
                                                ? 'bg-[#f0f5ff]'
                                                : 'bg-white'
                                        }`}
                                    >
                                        <span className="flex items-center gap-3 text-sm">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={selected}
                                                onChange={handleChange}
                                                className="accent-[#1773b8]"
                                            />
                                            {method.label}
                                        </span>
                                        {paymentLogos(method.id)}
                                    </label>
                                    {selected && (
                                        <div className="border-t border-[#d0d0d0] bg-[#f5f5f5] px-4 py-4 text-sm leading-6 text-[#4d4d4d]">
                                            {method.hint}
                                            <label className="mt-3 flex items-center gap-2 text-sm text-[#1a1a1a]">
                                                <input
                                                    type="checkbox"
                                                    name="billingSame"
                                                    checked={
                                                        form.billingSame
                                                    }
                                                    onChange={handleChange}
                                                    className="h-4 w-4 rounded border-[#bbb]"
                                                />
                                                Usar la dirección de envío
                                                como dirección de facturación
                                            </label>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {(note || form.notes) && (
                        <p className="mt-3 text-xs text-[#6d6d6d]">
                            Instrucciones del carrito: {form.notes || note}
                        </p>
                    )}
                </section>

                <section className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-[#e6e6e6] px-4 py-4">
                    <p className="text-sm">
                        Guardar mis datos para un pago más rápido
                    </p>
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="shrink-0 rounded-md border border-[#d0d0d0] bg-white px-4 py-2 text-sm"
                    >
                        {saved ? 'Guardado' : 'Guardar'}
                    </button>
                </section>

                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#1773b8] py-4 text-[15px] font-semibold text-white hover:bg-[#145ea0] disabled:opacity-60"
                >
                    {loading ? (
                        <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                        'Pagar ahora'
                    )}
                </button>
                <p className="mt-3 text-center text-xs leading-5 text-[#6d6d6d]">
                    Al continuar, aceptas los{' '}
                    <Link to="/termos" className="text-[#1773b8]">
                        Términos del servicio
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacidade" className="text-[#1773b8]">
                        Política de privacidad
                    </Link>
                    . El pedido se registra; enviamos las instrucciones de pago
                    ({site.phone}).
                </p>
            </form>
        </CheckoutShell>
    );
}

function FloatingField({
    name,
    label,
    value,
    onChange,
    type = 'text',
    required,
    autoComplete,
    inputMode,
    maxLength,
}) {
    return (
        <label className="relative block">
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                placeholder={label}
                className={inputClass}
            />
            <span className={labelClass}>{label}</span>
        </label>
    );
}
