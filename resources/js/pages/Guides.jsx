import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';

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

export default function Guides() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        fetch('/api/articles')
            .then((response) => response.json())
            .then((data) => {
                if (!cancelled) {
                    setArticles(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
            <header className="max-w-2xl">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-moss">
                    <BookOpen size={16} />
                    Guías
                </p>
                <h1 className="mt-3 text-3xl font-bold text-stone-900 md:text-4xl">
                    Todo sobre pellets y leña de calefacción
                </h1>
                <p className="mt-4 text-lg leading-7 text-stone-600">
                    Consejos prácticos sobre consumo, calidad y almacenamiento,
                    escritos a partir de las preguntas que más nos hacen
                    nuestros clientes.
                </p>
            </header>

            {loading ? (
                <p className="mt-12 text-stone-500">Cargando guías…</p>
            ) : articles.length === 0 ? (
                <p className="mt-12 text-stone-500">
                    Todavía no hemos publicado ninguna guía.
                </p>
            ) : (
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    {articles.map((article) => (
                        <article
                            key={article.slug}
                            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-md"
                        >
                            <Link to={`/guias/${article.slug}`}>
                                {article.image ? (
                                    <div className="aspect-[16/9] overflow-hidden bg-stone-50">
                                        <img
                                            src={article.image}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                ) : null}

                                <div className="p-6">
                                    <p className="flex items-center gap-3 text-xs text-stone-500">
                                        <span>{formatDate(article.publishedAt)}</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={13} />
                                            {article.readingMinutes} min
                                        </span>
                                    </p>
                                    <h2 className="mt-2 text-xl font-bold leading-7 text-stone-900">
                                        {article.title}
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-stone-600">
                                        {article.excerpt}
                                    </p>
                                    <span className="mt-4 inline-block text-sm font-semibold text-moss underline">
                                        Leer la guía
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
