import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useSite } from '../lib/SiteContext';

export default function Contact() {
    const site = useSite();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    throw new Error(Object.values(data.errors)[0][0]);
                }

                throw new Error(
                    data.message || 'No ha sido posible enviar el mensaje.',
                );
            }

            setSuccess('Mensaje enviado correctamente. Te contactaremos.');
            setForm({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
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
                        Contacto
                    </h1>
                </div>
            </section>

            <section className="px-4 py-8 sm:px-6 md:py-10">
                <div className="mx-auto max-w-xl">
                    <h2 className="sr-only">Formulario de contacto</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Nombre"
                                name="name"
                                autoComplete="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            <Field
                                label="E-mail"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <Field
                            label="Número de teléfono"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={handleChange}
                        />
                        <Field
                            as="textarea"
                            label="Comentario"
                            name="message"
                            rows="8"
                            value={form.message}
                            onChange={handleChange}
                        />

                        {success && (
                            <p className="bg-green-50 p-3 text-sm text-green-800">
                                {success}
                            </p>
                        )}
                        {error && (
                            <p className="bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-ink px-8 py-3 text-sm font-semibold text-cream disabled:opacity-60"
                        >
                            {loading ? (
                                <LoaderCircle
                                    className="inline animate-spin"
                                    size={18}
                                />
                            ) : (
                                'Enviar'
                            )}
                        </button>
                    </form>
                </div>
            </section>

            <section className="px-4 py-12 text-center sm:px-6 md:py-16">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-3xl font-semibold md:text-4xl">
                        Información de contacto
                    </h2>
                    <div className="mt-8 space-y-3 text-sm leading-7 text-ink/80">
                        <h3 className="text-xl font-semibold text-ink">
                            {site.legalName}
                        </h3>
                        <p>
                            <strong>Número de teléfono:</strong> {site.phone}
                        </p>
                        <p>
                            <strong>E-mail:</strong>{' '}
                            <a
                                href={`mailto:${site.email}`}
                                className="underline underline-offset-4"
                            >
                                {site.email}
                            </a>
                        </p>
                        <p>
                            <strong>Dirección física:</strong> {site.legalName},{' '}
                            {site.fullAddress()}
                        </p>
                        <p>
                            <strong>CIF/NIF:</strong> {site.nif}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Field({ as = 'input', label, required, ...props }) {
    const Control = as === 'textarea' ? 'textarea' : 'input';

    return (
        <label className="relative block border border-ink/20 bg-white">
            <span className="sr-only">
                {label}
                {required ? ' (obligatorio)' : ''}
            </span>
            <Control
                {...props}
                required={required}
                placeholder={`${label}${required ? '*' : ''}`}
                className={`w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/55 ${
                    as === 'textarea' ? 'min-h-[180px] resize-y' : ''
                }`}
            />
        </label>
    );
}
