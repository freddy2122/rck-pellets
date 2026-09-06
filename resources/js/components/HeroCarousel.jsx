import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        title: 'Pellets de madera premium para una calefacción eficiente',
        cta: 'Comprar ahora',
        to: '/produtos?cat=pellets',
        image: '/images/pellets-saco-15kg.jpg',
        alt: 'Saco de pellets Steampower de 15 kg',
    },
    {
        title: 'Leña seca para chimenea, estufa y horno',
        cta: 'Comprar leña',
        to: '/produtos?cat=lenha',
        image: '/images/lena-paleta-seca.jpg',
        alt: 'Paleta de leña seca para calefacción',
    },
    {
        title: 'Palets de pellets y madera para todo el invierno',
        cta: 'Ver catálogo',
        to: '/produtos',
        image: '/images/pellets-paleta-975kg.jpg',
        alt: 'Paleta de pellets Steampower de 975 kg',
    },
];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback((next) => {
        setIndex((current) => (next + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        if (paused) {
            return undefined;
        }

        const timer = window.setInterval(() => goTo(index + 1), 6000);

        return () => window.clearInterval(timer);
    }, [index, paused, goTo]);

    const slide = slides[index];

    return (
        <section
            className="bg-cream"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Pellets y leña de calefacción"
        >
            <div className="relative mx-auto max-w-6xl">
                <div className="grid overflow-hidden md:grid-cols-2">
                    <div className="flex flex-col justify-center bg-[radial-gradient(circle_at_top_left,#ffe5e5,#ffe0da_25%,#d7ff89)] px-6 py-14 sm:px-10 md:py-20">
                        <h1 className="max-w-md text-3xl font-semibold leading-tight text-ink md:text-5xl">
                            {slide.title}
                        </h1>
                        <Link
                            to={slide.to}
                            className="mt-8 inline-flex w-fit items-center bg-ink px-7 py-3 text-sm font-semibold text-lime"
                        >
                            {slide.cta}
                        </Link>
                    </div>
                    <div className="relative min-h-[340px] bg-white md:min-h-[520px]">
                        {slides.map((item, slideIndex) => (
                            <img
                                key={item.title}
                                src={item.image}
                                alt={item.alt}
                                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                                fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                                decoding="async"
                                className={`absolute inset-0 h-full w-full object-contain p-6 transition-opacity duration-500 md:p-10 ${
                                    slideIndex === index
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/80 text-ink md:flex"
                    aria-label="Diapositiva anterior"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/80 text-ink md:flex"
                    aria-label="Diapositiva siguiente"
                >
                    <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {slides.map((item, slideIndex) => (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => setIndex(slideIndex)}
                            className={`h-2.5 rounded-full ${
                                slideIndex === index
                                    ? 'w-7 bg-ink'
                                    : 'w-2.5 bg-ink/30'
                            }`}
                            aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
                            aria-current={slideIndex === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
