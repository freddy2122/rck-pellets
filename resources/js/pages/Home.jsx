import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Award,
    Flame,
    Headphones,
    Leaf,
    Package,
    Truck,
} from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { useSite } from '../lib/SiteContext';

const reasons = [
    {
        icon: Award,
        title: 'Calidad certificada',
        text: 'Leña y carbón seleccionados para un rendimiento óptimo y un sabor inigualable.',
    },
    {
        icon: Leaf,
        title: 'Solución sostenible',
        text: 'Biomasa ecológica con bajo impacto ambiental y combustión eficiente.',
    },
    {
        icon: Flame,
        title: 'Alto rendimiento',
        text: 'Leña de encina, haya, roble, olivo y pino; carbón vegetal para brasa y horno.',
    },
    {
        icon: Truck,
        title: 'Entrega en España',
        text: 'Distribución rápida en la Península.',
    },
    {
        icon: Package,
        title: 'Stock disponible',
        text: 'Disponibilidad regular para particulares y profesionales.',
    },
    {
        icon: Headphones,
        title: 'Atención profesional',
        text: 'Asistencia dedicada para pedidos y presupuestos.',
    },
];

const testimonials = [
    {
        name: 'Ana M. – Madrid',
        text: 'Leña de excelente calidad y entrega rápida. Ideal para chimenea y para el horno.',
    },
    {
        name: 'Carla R. – Valencia',
        text: 'Servicio profesional y atención muy eficiente. Producto conforme a la descripción y entrega en plazo.',
    },
    {
        name: 'Miguel F. – Sevilla',
        text: 'Buena relación calidad/precio y suministro fiable. Lo recomiendo para quien busca leña de calidad en España.',
    },
];

const featuredOrder = [
    'RCK-PEL-450',
    'RCK-PEL-975',
    'RCK-PEL-15KG',
    'RCK-LEN-25KG',
    'RCK-LEN-PALETE',
    'RCK-LEN-TOROS',
];

export default function Home() {
    const site = useSite();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
    }, []);

    const featured = useMemo(() => {
        const bySku = new Map(products.map((product) => [product.sku, product]));
        const ordered = featuredOrder
            .map((sku) => bySku.get(sku))
            .filter(Boolean);

        if (ordered.length > 0) {
            return ordered;
        }

        return products.slice(0, 6);
    }, [products]);

    const faqs = [
        {
            q: '¿Cuál es el número de registro de la tienda y dónde se encuentra?',
            a: `${site.legalName}, con sede en ${site.fullAddress()}, está registrada con el CIF ${site.nif}.`,
        },
        {
            q: '¿Cuál es el plazo de entrega?',
            a: 'Las entregas en la Península se realizan en un plazo estimado de 2 a 5 días laborables, según la ubicación y el stock. Los gastos de envío son de 2,99 €. Baleares, Canarias, Ceuta y Melilla: 5 a 10 días laborables, portes 24,90 €.',
        },
        {
            q: '¿Qué tipos de leña y carbón vendéis?',
            a: 'Leña de haya, encina, roble, olivo y pino, y carbón vegetal profesional y doméstico (marabú, encina, olivo, quebracho). Formatos big bag, saco y palet, para hostelería y particulares.',
        },
        {
            q: '¿Vendéis a particulares y empresas?',
            a: 'Sí. Ofrecemos soluciones tanto para particulares como para profesionales, revendedores y empresas.',
        },
        {
            q: '¿También vendéis para pizzerías y restaurantes?',
            a: 'Sí. Suministramos leña de haya para pizzerías y hornos, y carbón para braserías, con entrega y formatos adaptados a hostelería.',
        },
        {
            q: '¿Cómo puedo pedir un presupuesto?',
            a: 'Puedes solicitar un presupuesto a través del formulario de contacto, WhatsApp o directamente por teléfono y correo electrónico.',
        },
        {
            q: '¿Cuáles son las ventajas de la leña de encina y de olivo?',
            a: 'Son maderas duras, densas y de larga duración. Mantienen el fuego, dan buen calor y son ideales para barbacoa, estufa y caldera. El haya y el pino aportan más llama, muy útiles en pizzería.',
        },
        {
            q: '¿Ofrecéis servicio posventa?',
            a: `Sí, nuestro servicio posventa responde a preguntas sobre pedidos, entrega o uso. Teléfono: ${site.phone}. E-mail: ${site.email}.`,
        },
    ];

    return (
        <main>
            <HeroCarousel />

            <section className="px-4 py-16 sm:px-6 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-center text-3xl font-semibold md:text-4xl">
                        Productos destacados
                    </h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-6 sm:px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-semibold md:text-4xl">
                        {site.legalName}
                    </h2>
                    <p className="mt-6 text-base leading-8 text-ink/80">
                        {site.legalName}, con sede en{' '}
                        <strong>{site.fullAddress()}</strong>{' '}
                        y registrada con el <strong>CIF {site.nif}</strong>, está
                        especializada en pellets de madera y leña de
                        calefacción para particulares y profesionales.
                    </p>
                    <Link
                        to="/contactos"
                        className="mt-8 inline-flex bg-ink px-7 py-3 text-sm font-semibold text-cream"
                    >
                        Contacto
                    </Link>
                </div>
            </section>

            <section className="px-4 py-16 sm:px-6 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-center text-3xl font-semibold uppercase tracking-wide md:text-4xl">
                        Por qué elegir {site.name}
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-center leading-8 text-ink/75">
                        {site.name} ofrece pellets de madera y leña de alta
                        calidad para calefacción doméstica y profesional.
                    </p>
                    <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {reasons.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.title}
                                    className="text-center"
                                >
                                    <Icon
                                        className="mx-auto text-ink"
                                        size={28}
                                        strokeWidth={1.6}
                                    />
                                    <h3 className="mt-4 text-lg font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-ink/70">
                                        {item.text}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 py-16 sm:px-6 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-center text-3xl font-semibold md:text-4xl">
                        Algunos testimonios de clientes
                    </h2>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {testimonials.map((item) => (
                            <blockquote
                                key={item.name}
                                className="border border-ink/10 bg-cream px-6 py-8"
                            >
                                <p className="font-semibold">{item.name}</p>
                                <p className="mt-4 text-sm leading-7 text-ink/75">
                                    “{item.text}”
                                </p>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 sm:px-6 md:py-20">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-center text-3xl font-semibold md:text-4xl">
                        Preguntas frecuentes
                    </h2>
                    <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                        {faqs.map((item) => (
                            <details key={item.q} className="group py-4">
                                <summary className="cursor-pointer list-none font-medium">
                                    {item.q}
                                </summary>
                                <p className="mt-3 text-sm leading-7 text-ink/75">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                    <div className="mt-8 text-center text-sm text-ink/70">
                        <p>
                            <strong>Número de teléfono:</strong> {site.phone}
                        </p>
                        <p className="mt-1">
                            <strong>E-mail:</strong> {site.email}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
