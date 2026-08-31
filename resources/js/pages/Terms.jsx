import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function Terms() {
    const site = useSite();

    return (
        <LegalPage
            kicker="Información legal"
            title="Términos y condiciones"
            intro={`Condiciones de venta a distancia de la tienda online ${site.name}, aplicables a consumidores y empresas en España.`}
        >
            <p>
                El vendedor es {site.legalName}, CIF {site.nifFormatted}, con
                sede en {site.fullAddress()}. Contacto: {site.email}, {site.phone}.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                1. Objeto y precios
            </h2>
            <p>
                Los precios incluyen IVA a la tasa legal vigente. Los gastos de
                envío, cuando correspondan, se indican antes de confirmar el
                pedido. El pedido solo se considera aceptado tras la
                confirmación de stock y el envío de las instrucciones de pago.
            </p>
            <h2 className="text-xl font-bold text-stone-900">2. Pago</h2>
            <p>
                Transferencia bancaria o referencia Multibanco. No almacenamos
                datos de tarjeta en esta tienda.
            </p>
            <h2 className="text-xl font-bold text-stone-900">3. Entrega</h2>
            <p>
                Península: {site.shipping.mainland}. Baleares, Canarias, Ceuta y
                Melilla: {site.shipping.islands}. Plazos sujetos a stock y
                transportista.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                4. Derecho de desistimiento
            </h2>
            <p>
                El consumidor dispone de 14 días para desistir del contrato
                celebrado a distancia, conforme a la normativa española de
                consumo. Consulta la página{' '}
                <Link to="/resolucao" className="text-pine underline">
                    Derecho de desistimiento
                </Link>
                .
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                5. Reclamaciones
            </h2>
            <p>
                Reclamaciones de consumo:{' '}
                <a
                    href="https://www.consumo.gob.es/"
                    className="text-pine underline"
                >
                    consumo.gob.es
                </a>
                . Litigios: plataforma europea de resolución de litigios en
                línea.
            </p>
            <p className="text-sm text-stone-500">
                Texto informativo para esta tienda. No sustituye el
                asesoramiento jurídico.
            </p>
        </LegalPage>
    );
}
