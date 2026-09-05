import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

function formatDate(iso) {
    if (!iso) {
        return '';
    }

    return new Date(iso).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function GuideDetail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [related, setRelated] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        fetch(`/api/articles/${slug}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('not-found');
                }

                return response.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setArticle(data.article);
                    setRelated(data.related || []);
                    setStatus('ready');
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus('missing');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (status === 'loading') {
        return (
            <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
                <p className="text-stone-500">Cargando…</p>
            </main>
        );
    }

    if (status === 'missing') {
        return (
            <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
                <h1 className="text-2xl font-bold text-stone-900">
                    Esta guía no existe
                </h1>
                <p className="mt-3 text-stone-600">
                    Es posible que la hayamos retirado o que el enlace sea
                    incorrecto.
                </p>
                <Link
                    to="/guias"
                    className="mt-6 inline-block font-semibold text-moss underline"
                >
                    Ver todas las guías
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
            <nav aria-label="Ruta de navegación" className="text-sm text-stone-500">
                <Link to="/" className="hover:underline">
                    Inicio
                </Link>
                <span className="mx-2">›</span>
                <Link to="/guias" className="hover:underline">
                    Guías
                </Link>
            </nav>

            <header className="mt-6">
                <h1 className="text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
                    {article.title}
                </h1>
                <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-500">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {article.readingMinutes} min de lectura
                    </span>
                </p>
                <p className="mt-5 border-l-4 border-moss/40 pl-4 text-lg leading-7 text-stone-700">
                    {article.excerpt}
                </p>
            </header>

            {article.image ? (
                <img
                    src={article.image}
                    alt=""
                    fetchPriority="high"
                    decoding="async"
                    className="mt-8 w-full rounded-2xl border border-stone-200 bg-stone-50 object-contain p-6"
                />
            ) : null}

            {/*
              Le corps est du HTML redige depuis l'administration du site,
              jamais une saisie de visiteur.
            */}
            <div
                className="guide-body mt-10"
                dangerouslySetInnerHTML={{ __html: article.body }}
            />

            <aside className="mt-14 rounded-2xl bg-stone-50 p-6">
                <h2 className="text-lg font-bold text-stone-900">
                    ¿Listo para pedir?
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                    Pellets certificados y leña seca con entrega en 2 a 5 días
                    laborables en la Península.
                </p>
                <Link
                    to="/produtos"
                    className="mt-4 inline-block rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white"
                >
                    Ver el catálogo
                </Link>
            </aside>

            {related.length > 0 ? (
                <section className="mt-14">
                    <h2 className="text-xl font-bold text-stone-900">
                        Seguir leyendo
                    </h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        {related.map((other) => (
                            <Link
                                key={other.slug}
                                to={`/guias/${other.slug}`}
                                className="rounded-xl border border-stone-200 p-5 transition hover:shadow-sm"
                            >
                                <h3 className="font-semibold leading-6 text-stone-900">
                                    {other.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-stone-600">
                                    {other.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            <Link
                to="/guias"
                className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-moss"
            >
                <ArrowLeft size={16} />
                Todas las guías
            </Link>
        </main>
    );
}
