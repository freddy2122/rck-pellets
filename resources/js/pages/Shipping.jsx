import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function Shipping() {
    const site = useSite();

    return (
        <LegalPage
            kicker="Envíos"
            title="Envíos y portes"
            intro="Información de entrega para la Península, Baleares, Canarias, Ceuta y Melilla."
        >
            <h2 className="text-xl font-bold text-stone-900">
                1. Información general
            </h2>
            <p>
                En {site.legalName} nos comprometemos a garantizar una
                entrega rápida, fiable y segura de tus pellets y leña de
                calefacción en toda España. Tratamos cada pedido con el
                máximo cuidado para que llegue en perfectas condiciones y
                dentro del plazo acordado.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                2. Zona de entrega
            </h2>
            <p>
                Entregamos en toda la Península, Baleares, Canarias, Ceuta y
                Melilla.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                3. Costes de envío
            </h2>
            <p>
                Península:{' '}
                {site.shipping.mainlandPrice.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })}
                . Baleares, Canarias, Ceuta y Melilla:{' '}
                {site.shipping.islandsPrice.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })}
                . Esta tarifa cubre el transporte desde nuestro almacén hasta
                la dirección de entrega indicada.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                4. Plazo de entrega
            </h2>
            <p>
                Península: {site.shipping.mainland}. Baleares, Canarias, Ceuta
                y Melilla: {site.shipping.islands}. Los plazos se cuentan
                desde la confirmación del pago y son estimados, sujetos a
                stock y al transportista.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                5. Seguimiento del pedido
            </h2>
            <p>
                Tras confirmar tu pedido, recibirás un email con los detalles
                de la entrega. Nuestro equipo está disponible para
                resolverte cualquier duda y ayudarte a seguir tu envío.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                6. Recogida en almacén
            </h2>
            <p>
                También puedes recoger tu pedido en {site.address.street},{' '}
                {site.address.postalCode} {site.address.city}, previa cita en
                el {site.phone}.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                7. Contacto
            </h2>
            <p>
                Para dudas sobre envíos:
                <br />
                Email:{' '}
                <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                </a>
                <br />
                Teléfono: {site.phone}
            </p>
            <p>
                En caso de rechazo del pedido o dirección incompleta, los
                costes de reenvío pueden repercutirse al cliente.
            </p>
        </LegalPage>
    );
}
