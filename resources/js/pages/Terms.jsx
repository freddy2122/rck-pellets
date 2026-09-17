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
                Al utilizar esta tienda online aceptas los presentes Términos
                y nuestra{' '}
                <Link to="/privacidade" className="text-pine underline">
                    Política de privacidad
                </Link>
                . Si no estás de acuerdo, no debes utilizar el sitio.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                1. Nuestros productos
            </h2>
            <p>
                Procuramos que las fotografías y descripciones de los
                productos sean lo más fieles posible, pero el color o el
                aspecto real puede variar ligeramente según tu pantalla. Las
                descripciones, precios y disponibilidad pueden cambiar en
                cualquier momento sin previo aviso, y podemos limitar las
                cantidades disponibles de un producto.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                2. Pedidos
            </h2>
            <p>
                Al realizar un pedido, haces una oferta de compra. Nos
                reservamos el derecho de aceptar o rechazar cualquier pedido;
                este solo se considera aceptado tras la confirmación de stock
                y el envío de las instrucciones de pago. Si no podemos
                aceptar, modificamos o cancelamos un pedido, te lo
                comunicaremos por email o teléfono. Las compras se entienden
                para uso personal o doméstico, no para reventa.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                3. Precios y facturación
            </h2>
            <p>
                Los precios incluyen IVA a la tasa legal vigente y pueden
                cambiar sin previo aviso; el precio aplicable es el vigente en
                el momento del pedido, indicado en el email de confirmación.
                Salvo indicación expresa, los precios no incluyen los gastos
                de envío, que se muestran antes de confirmar el pedido.
            </p>

            <h2 className="text-xl font-bold text-stone-900">4. Pago</h2>
            <p>
                Ingreso o transferencia bancaria a la cuenta indicada en la
                confirmación del pedido. No almacenamos datos de tarjeta en
                esta tienda.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                5. Envío y entrega
            </h2>
            <p>
                Península: {site.shipping.mainland}. Baleares, Canarias, Ceuta
                y Melilla: {site.shipping.islands}. Los plazos son estimados y
                están sujetos a stock y al transportista; consulta nuestra{' '}
                <Link to="/envios" className="text-pine underline">
                    Política de envíos
                </Link>
                . El riesgo de pérdida se transmite al transportista en el
                momento de la entrega del pedido para su envío.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                6. Propiedad intelectual
            </h2>
            <p>
                Los textos, imágenes, logotipos y demás contenidos de este
                sitio son propiedad de {site.legalName} o de terceros que han
                autorizado su uso. Solo puedes utilizarlos para tu uso
                personal y no comercial; queda prohibida su reproducción o
                distribución sin autorización previa.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                7. Enlaces a terceros
            </h2>
            <p>
                Este sitio puede incluir enlaces a plataformas de terceros
                (por ejemplo, WhatsApp). No somos responsables del contenido
                ni de las prácticas de esos sitios.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                8. Limitación de responsabilidad
            </h2>
            <p>
                En la medida permitida por la ley, no seremos responsables de
                daños indirectos derivados del uso de este sitio o de los
                productos adquiridos, sin perjuicio de los derechos que, como
                consumidor, te reconoce la normativa española y europea de
                protección al consumidor.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                9. Derecho de desistimiento
            </h2>
            <p>
                El consumidor dispone de 14 días para desistir del contrato
                celebrado a distancia, conforme a la normativa española de
                consumo. Consulta la página{' '}
                <Link to="/resolucao" className="text-pine underline">
                    Política de reembolso
                </Link>
                .
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                10. Modificaciones
            </h2>
            <p>
                Podemos actualizar estos Términos en cualquier momento;
                publicaremos la versión revisada en esta página. El uso
                continuado del sitio tras una modificación implica su
                aceptación.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                11. Ley aplicable y reclamaciones
            </h2>
            <p>
                Estos Términos se rigen por la legislación española.
                Reclamaciones de consumo:{' '}
                <a
                    href="https://www.consumo.gob.es/"
                    className="text-pine underline"
                >
                    consumo.gob.es
                </a>
                . Para litigios de consumo transfronterizos, puedes acudir a
                la plataforma europea de resolución de litigios en línea.
            </p>
            <p className="text-sm text-stone-500">
                Texto informativo para esta tienda. No sustituye el
                asesoramiento jurídico.
            </p>
        </LegalPage>
    );
}
