import { useSite } from '../lib/SiteContext';

export default function About() {
    const site = useSite();

    return (
        <main>
            <section className="px-4 pb-4 pt-10 sm:px-6 md:pt-14">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-4xl font-semibold md:text-5xl">
                        Sobre nosotros
                    </h1>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 md:py-14">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-3xl font-semibold md:text-4xl">
                        {site.legalName}
                    </h2>
                    <div className="mt-8 space-y-6 text-base leading-8 text-ink/80">
                        <p>
                            {site.legalName}, con sede en{' '}
                            <strong>{site.fullAddress()}</strong>
                            , es una empresa española especializada en pellets
                            de madera y leña de calefacción para uso doméstico y
                            profesional. Registrada con el{' '}
                            <strong>CIF {site.nif}</strong>.
                        </p>
                        <p>
                            Con foco en la calidad, la sostenibilidad y la
                            eficiencia logística, {site.name} ofrece soluciones
                            adaptadas a las necesidades de sus clientes, con un
                            servicio profesional y distribución en España. La
                            empresa trabaja según elevados estándares de
                            calidad, ofreciendo una alternativa energética
                            moderna, económica y ecológica para calefacción y
                            biomasa.
                        </p>
                        <p>
                            {site.legalName} — Pellets y leña de calefacción en
                            España.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
