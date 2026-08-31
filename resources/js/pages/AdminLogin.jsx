import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, LoaderCircle, LogIn } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    throw new Error(firstError);
                }

                throw new Error(
                    data.message || 'Identifiants incorrects.'
                );
            }

            localStorage.setItem('admin_token', data.token);
            localStorage.setItem(
                'admin_user',
                JSON.stringify(data.user)
            );

            navigate('/admin');
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    'Impossible de se connecter.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-800 text-white">
                        <LockKeyhole size={30} />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        Administration
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Connectez-vous à votre espace administrateur.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-lg">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-900"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="admin@rckpellets.com"
                                required
                                autoComplete="email"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-900"
                            >
                                Mot de passe
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Votre mot de passe"
                                required
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Connexion...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />

                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    LEÑAS CASTOR — Administration
                </p>
            </div>
        </main>
    );
}