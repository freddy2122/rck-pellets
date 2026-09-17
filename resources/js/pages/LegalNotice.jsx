import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function LegalNotice() {
    const site = useSite();

    return (
        <LegalPage
            kicker="Información legal"
            title="Aviso legal"
            intro="De conformidad con la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), se facilitan los siguientes datos sobre el titular de este sitio web."
        >
            <h2 className="text-xl font-bold text-stone-900">
                Datos identificativos
            </h2>
            <p>
                Denominación social: {site.legalName}
                <br />
                Forma jurídica: Sociedad de Responsabilidad Limitada (S.L.)
                <br />
                CIF: {site.nifFormatted}
                <br />
                Domicilio social: {site.fullAddress()}
                <br />
                Teléfono: {site.phone}
                <br />
                Correo electrónico:{' '}
                <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                </a>
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Objeto y actividad
            </h2>
            <p>
                {site.legalName} se dedica a la venta y distribución de
                pellets de madera y leña de calefacción, para uso doméstico y
                profesional, a través de esta tienda online.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Propiedad intelectual e industrial
            </h2>
            <p>
                Todos los contenidos de este sitio web —textos, imágenes,
                marcas, logotipos y demás elementos— son propiedad de{' '}
                {site.legalName} o de terceros que han autorizado su uso.
                Queda prohibida su reproducción, distribución o modificación,
                total o parcial, sin autorización previa.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Protección de datos personales
            </h2>
            <p>
                El tratamiento de los datos personales facilitados a través
                de este sitio se rige por el Reglamento (UE) 2016/679 (RGPD)
                y la Ley Orgánica 3/2018, de Protección de Datos Personales y
                garantía de los derechos digitales. Los datos recabados se
                utilizan exclusivamente para la gestión de los pedidos y el
                contacto con el cliente, y no se ceden a terceros salvo
                obligación legal. Más información en nuestra{' '}
                <Link to="/privacidade" className="underline">
                    Política de privacidad
                </Link>
                .
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Responsabilidad
            </h2>
            <p>
                {site.legalName} no se responsabiliza de los errores u
                omisiones que pudiera contener este sitio, ni de los daños
                derivados del uso de la información aquí facilitada. Se
                reserva el derecho a modificar en cualquier momento y sin
                previo aviso los contenidos, productos, servicios y precios
                presentados.
            </p>
            <h2 className="text-xl font-bold text-stone-900">
                Legislación aplicable y jurisdicción
            </h2>
            <p>
                Este aviso legal se rige por la legislación española. En caso
                de conflicto derivado del uso de este sitio, y sin perjuicio
                de los derechos que asisten al consumidor, será competente el
                juzgado correspondiente a su domicilio, conforme a la
                normativa de protección de los consumidores y usuarios.
            </p>
            <p className="text-sm text-stone-500">
                Aviso legal actualizado el 17 de septiembre de 2026.
            </p>
        </LegalPage>
    );
}
