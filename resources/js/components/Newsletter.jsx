import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const subscribe = async (event) => {
        event.preventDefault();
        setStatus('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: 'Newsletter',
                    email,
                    message: 'Solicitud de suscripción a la newsletter.',
                }),
            });

            if (!response.ok) {
                throw new Error('No ha sido posible suscribirse.');
            }

            setEmail('');
            setStatus(
                'Gracias. Te contactaremos con las próximas ofertas.',
            );
        } catch (error) {
            setStatus(error.message);
        }
    };

    return (
        <div className="px-4 py-14 text-center sm:px-6 md:py-16">
            <div className="mx-auto max-w-xl">
                <h2 className="text-3xl font-bold text-ink md:text-4xl">
                    Suscríbete a nuestra newsletter
                </h2>
                <p className="mt-4 text-ink/80">
                    Regístrate en nuestra lista de correo para recibir ofertas
                    exclusivas y las últimas novedades.
                </p>
                <form onSubmit={subscribe} className="relative mx-auto mt-8 max-w-md">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="E-mail"
                        className="w-full rounded-full border border-ink/40 bg-[#f3fbe4] py-3 pl-5 pr-12 text-sm outline-none placeholder:text-ink/50 focus:border-ink"
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-ink"
                        aria-label="Suscribirse"
                    >
                        <ArrowRight size={18} />
                    </button>
                </form>
                {status && (
                    <p className="mt-4 text-sm text-ink/70">{status}</p>
                )}
            </div>
        </div>
    );
}
