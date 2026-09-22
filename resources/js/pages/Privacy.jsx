import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function Privacy() {
    const site = useSite();

    return (
        <LegalPage
            kicker="RGPD"
            title="Política de privacidad"
            intro="Última actualización: 17 de septiembre de 2026. Información sobre el tratamiento de datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)."
        >
            <p>
                {site.legalName}, CIF {site.nifFormatted}, con domicilio en{' '}
                {site.fullAddress()}, es responsable del tratamiento de los
                datos personales que recopilamos a través de esta tienda
                online (los «Servicios»). Al utilizar los Servicios, aceptas
                las prácticas descritas en esta Política de privacidad.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Datos que recopilamos
            </h2>
            <p>Según cómo interactúes con los Servicios, podemos tratar:</p>
            <ul className="list-disc space-y-1 pl-5">
                <li>
                    Datos de contacto: nombre, dirección de envío y
                    facturación, teléfono y email.
                </li>
                <li>
                    Datos de pedido: productos consultados, añadidos al
                    carrito o comprados, importe, método de pago elegido
                    (transferencia bancaria o ingreso en cajero) e historial
                    de pedidos.
                </li>
                <li>
                    Comunicaciones: el contenido de tus mensajes cuando nos
                    escribes (email, WhatsApp o formulario de contacto).
                </li>
                <li>
                    Datos técnicos: dirección IP, tipo de dispositivo y
                    navegador, recogidos mediante cookies (ver nuestra{' '}
                    <Link to="/cookies" className="underline">
                        Política de cookies
                    </Link>
                    ).
                </li>
            </ul>
            <p>
                No recopilamos ni almacenamos datos de tarjetas de pago: el
                pago se realiza mediante transferencia bancaria o ingreso en
                cajero automático, indicando el número de pedido como
                concepto.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Origen de los datos
            </h2>
            <p>
                Directamente de ti, al crear un pedido, escribirnos o
                navegar por el sitio; automáticamente mediante cookies
                técnicas; y a través de los proveedores que utilizamos para
                prestar el servicio (alojamiento web y envío de emails
                transaccionales).
            </p>

            <h2 className="text-xl font-bold text-stone-900">Finalidades</h2>
            <p>
                Gestión de pedidos, facturación, atención al cliente y, si
                das tu consentimiento, comunicaciones comerciales. Base
                jurídica: ejecución del contrato, obligación legal
                (facturación) y consentimiento.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Cómo compartimos tus datos
            </h2>
            <p>
                Compartimos tus datos personales con proveedores que actúan
                en nuestro nombre (alojamiento web y envío de correo
                transaccional), con las autoridades competentes cuando la
                ley lo exige y, únicamente si aceptas las cookies de
                análisis en el banner de este sitio, con Meta (Meta Pixel) y
                con Google (etiqueta de Google Ads), para medir el
                rendimiento de nuestras campañas publicitarias en Facebook,
                Instagram y Google. Puedes retirar este consentimiento en
                cualquier momento borrando los datos de navegación de tu
                navegador y volviendo a elegir «Solo esenciales» en el
                banner. No vendemos tus datos a terceros.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Enlaces a sitios de terceros
            </h2>
            <p>
                Nuestro sitio puede incluir enlaces a plataformas de
                terceros (por ejemplo, WhatsApp). No somos responsables de
                las prácticas de privacidad de esos sitios; te recomendamos
                consultar sus propias políticas.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Cestas abandonadas
            </h2>
            <p>
                Si añades productos a la cesta y facilitas tu email en el
                proceso de pago sin llegar a finalizar el pedido, conservamos el
                contenido de esa cesta junto con tu nombre, email y teléfono.
                Finalidad: recordarte el pedido pendiente y ofrecerte ayuda para
                completarlo. Base jurídica: interés legítimo del responsable en
                recuperar ventas no finalizadas, conforme al artículo 6.1.f del
                RGPD. Mientras no facilites tu email, la cesta se guarda de
                forma anónima mediante un identificador técnico que no permite
                identificarte. Estos datos se conservan un máximo de 90 días y
                se eliminan automáticamente después. Puedes solicitar su
                supresión inmediata escribiendo a {site.email}, y oponerte en
                cualquier momento a este tratamiento.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Datos de menores
            </h2>
            <p>
                Los Servicios no están dirigidos a menores de edad y no
                recopilamos intencionadamente datos personales de menores.
                Si eres padre, madre o tutor y crees que tu hijo/a nos ha
                facilitado datos personales, contacta con nosotros para
                solicitar su eliminación.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Seguridad y conservación
            </h2>
            <p>
                Aplicamos medidas técnicas y organizativas razonables para
                proteger tus datos, aunque ningún sistema es completamente
                seguro. Los datos de facturación se conservan durante los
                plazos fiscales aplicables en España. El resto, el tiempo
                necesario para la finalidad para la que se recopilaron.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Transferencias internacionales
            </h2>
            <p>
                Nuestro proveedor de alojamiento puede procesar datos dentro
                del Espacio Económico Europeo. Si en algún caso fuera
                necesaria una transferencia fuera del EEE, se realizaría
                mediante mecanismos reconocidos, como las Cláusulas
                Contractuales Tipo de la Comisión Europea.
            </p>

            <h2 className="text-xl font-bold text-stone-900">Tus derechos</h2>
            <p>
                Acceso, rectificación, supresión, limitación, portabilidad y
                oposición, a través de {site.email}. Puedes presentar una
                reclamación ante la Agencia Española de Protección de Datos
                (aepd.es).
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                Cambios a esta política
            </h2>
            <p>
                Podemos actualizar esta Política de privacidad periódicamente.
                Publicaremos la versión revisada en esta página y
                actualizaremos la fecha de «Última actualización».
            </p>

            <h2 className="text-xl font-bold text-stone-900">Contacto</h2>
            <p>
                Para cualquier duda sobre esta política o para ejercer tus
                derechos, escríbenos a{' '}
                <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                </a>{' '}
                o llámanos al {site.phone}.
            </p>
        </LegalPage>
    );
}
