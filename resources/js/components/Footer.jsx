import { Link } from 'react-router-dom';
import { useSite } from '../lib/SiteContext';
import Newsletter from './Newsletter';
import PaymentMethods from './PaymentMethods';

export default function Footer() {
    const site = useSite();

    return (
        <footer className="bg-[linear-gradient(135deg,#d7ff89_0%,#ffe5e5_42%,#fff1d6_100%)] text-ink">
            <Newsletter />

            <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-sm leading-7">
                    <h2 className="text-base font-bold">
                        {site.legalName}
                    </h2>
                    <p className="mt-4">
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

                <div>
                    <h3 className="text-base font-bold">Página</h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                        <Link to="/" className="hover:underline">
                            Inicio
                        </Link>
                        <Link to="/produtos" className="hover:underline">
                            Catálogo
                        </Link>
                        <Link to="/seguir-pedido" className="hover:underline">
                            Seguir mi pedido
                        </Link>
                        <Link to="/contactos" className="hover:underline">
                            Contacto
                        </Link>
                        <Link to="/sobre-nos" className="hover:underline">
                            Sobre nosotros
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-bold">Políticas</h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                        <Link to="/produtos" className="hover:underline">
                            Búsqueda
                        </Link>
                        <Link to="/contactos" className="hover:underline">
                            Información de contacto
                        </Link>
                        <Link to="/aviso-legal" className="hover:underline">
                            Aviso legal
                        </Link>
                        <Link to="/privacidade" className="hover:underline">
                            Política de privacidad
                        </Link>
                        <Link to="/resolucao" className="hover:underline">
                            Política de reembolso
                        </Link>
                        <Link to="/envios" className="hover:underline">
                            Política de envío
                        </Link>
                        <Link to="/termos" className="hover:underline">
                            Términos del servicio
                        </Link>
                    </div>
                </div>

                <div>
                    <div className="inline-flex rounded-md bg-white px-3 py-3">
                        <img
                            src="/images/logo.png"
                            alt={site.name}
                            className="h-12 w-auto"
                        />
                    </div>
                    <h3 className="mt-5 text-base font-bold">
                        {site.legalName}
                    </h3>
                    <p className="mt-3 text-sm leading-6">
                        Pellets de madera premium y leña de calefacción, con
                        entrega rápida en España.
                    </p>
                </div>
            </div>

            <PaymentMethods />

            <div className="border-t border-ink/10">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink/55 sm:px-6 md:flex-row md:justify-between">
                    <p>
                        © {new Date().getFullYear()}, {site.legalName}
                    </p>
                    <p>CIF {site.nif}</p>
                </div>
            </div>
        </footer>
    );
}
