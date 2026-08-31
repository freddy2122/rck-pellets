import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function LegalNotice() {
    const site = useSite();

    return (
        <LegalPage
            kicker="Información legal"
            title="Aviso legal"
            intro="Información societaria e identificación del titular de la tienda online."
        >
            <p>
                El sitio es titularidad de {site.legalName}, CIF {site.nif}, con
                sede en {site.fullAddress()}.
            </p>
            <p>
                Contactos: {site.phone} · {site.email}
            </p>
            <p>
                Los contenidos de este sitio informan sobre los productos y
                servicios de la empresa. Queda prohibida la reproducción no
                autorizada.
            </p>
        </LegalPage>
    );
}
