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
            <p>
                Expedición desde {site.address.city}. Plazos orientativos:
                continente {site.shipping.mainland}; islas{' '}
                {site.shipping.islands}.
            </p>
            <p>
                Portes estándar para la Península:{' '}
                {site.shipping.mainlandPrice.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })}
                , plazo {site.shipping.mainland}. Baleares, Canarias, Ceuta y
                Melilla:{' '}
                {site.shipping.islandsPrice.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                })}
                , plazo {site.shipping.islands}.
            </p>
            <p>
                Recogida en almacén: {site.address.street},{' '}
                {site.address.postalCode} {site.address.city}, previa cita en{' '}
                {site.phone}.
            </p>
            <p>
                En caso de rechazo del pedido o dirección incompleta, los
                costes de reenvío pueden repercutirse al cliente.
            </p>
        </LegalPage>
    );
}
