import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function Privacy() {
    const site = useSite();

    return (
        <LegalPage
            kicker="RGPD"
            title="Política de privacidad"
            intro="Información sobre el tratamiento de datos personales conforme al Reglamento (UE) 2016/679 y la Ley Orgánica 3/2018."
        >
            <p>
                Responsable del tratamiento: {site.legalName}, CIF{' '}
                {site.nifFormatted}, {site.fullAddress()}. Email: {site.email}.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Datos que recopilamos
            </h2>
            <p>
                Nombre, email, móvil, NIF/NIE, dirección y contenido de los mensajes
                o pedidos, cuando los facilitas en el formulario o en el pago.
            </p>
            <h2 className="text-xl font-bold text-stone-900">Finalidades</h2>
            <p>
                Gestión de pedidos, facturación, atención al cliente y, si das
                tu consentimiento, comunicaciones comerciales. Base jurídica:
                ejecución del contrato, obligación legal (facturación) y
                consentimiento.
            </p>
            <h2 className="text-xl font-bold text-stone-900">Conservación</h2>
            <p>
                Los datos de facturación se conservan durante los plazos
                fiscales aplicables en España. El resto, el tiempo necesario
                para la finalidad.
            </p>
            <h2 className="text-xl font-bold text-stone-900">Tus derechos</h2>
            <p>
                Acceso, rectificación, supresión, limitación, portabilidad y
                oposición, a través de {site.email}. Puedes presentar una
                reclamación ante la Agencia Española de Protección de Datos
                (aepd.es).
            </p>
        </LegalPage>
    );
}
