import LegalPage from '../components/LegalPage';
import { useSite } from '../lib/SiteContext';

export default function Returns() {
    const site = useSite();

    return (
        <LegalPage
            kicker="Consumidor"
            title="Política de reembolso"
            intro="Información prevista en el Real Decreto Legislativo 1/2007, de 16 de noviembre (texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios) y la Ley 3/2014, para contratos celebrados a distancia."
        >
            <h2 className="text-xl font-bold text-stone-900">
                1. Derecho de desistimiento
            </h2>
            <p>
                Dispones de 14 días naturales desde la recepción del pedido
                para desistir del contrato sin indicar motivo, siempre que el
                producto no haya sido utilizado y se encuentre en perfecto
                estado. Para ejercer este derecho, comunícanoslo a través de
                los datos de contacto indicados al final de esta página.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                2. Condiciones de la devolución
            </h2>
            <p>Para que aceptemos una devolución:</p>
            <ul className="list-disc space-y-1 pl-5">
                <li>
                    El producto debe estar sin usar, en su embalaje original y
                    en perfecto estado.
                </li>
                <li>
                    No se aceptan devoluciones de productos manipulados,
                    abiertos o utilizados.
                </li>
                <li>
                    El producto debe devolverse con todos sus accesorios,
                    documentación y embalaje original.
                </li>
            </ul>

            <h2 className="text-xl font-bold text-stone-900">
                3. Productos excluidos de la devolución
            </h2>
            <p>
                Por motivos de higiene, seguridad y por la naturaleza del
                producto, no se aceptan devoluciones de:
            </p>
            <ul className="list-disc space-y-1 pl-5">
                <li>Sacos de pellets o leña abiertos, usados o manipulados.</li>
                <li>Productos a granel o consumibles tras la entrega.</li>
                <li>Productos personalizados o fabricados por encargo.</li>
            </ul>

            <h2 className="text-xl font-bold text-stone-900">
                4. Procedimiento de devolución
            </h2>
            <p>
                Tras solicitar la devolución y recibir nuestra aprobación,
                deberás enviar el producto a la dirección que te indiquemos.
                Los gastos de envío de la devolución corren por tu cuenta,
                salvo en caso de producto defectuoso o error de envío
                imputable a nosotros.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                5. Reembolsos
            </h2>
            <p>
                Tras recibir el producto y verificar su estado, te
                reembolsaremos el importe correspondiente por el mismo medio
                de pago utilizado en la compra, en un plazo máximo de 14 días
                naturales desde la recepción de la devolución. El reembolso
                no incluye los gastos de envío iniciales, salvo en los casos
                previstos por la ley.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                6. Productos defectuosos o errores en el pedido
            </h2>
            <p>
                Si el producto recibido presenta algún defecto o no
                corresponde al pedido realizado, notifícanoslo en un plazo
                razonable tras su recepción. En estos casos, asumimos los
                gastos de envío de la devolución y, según corresponda, te
                enviaremos un producto de sustitución o tramitaremos el
                reembolso correspondiente.
            </p>

            <h2 className="text-xl font-bold text-stone-900">
                7. Contacto
            </h2>
            <p>
                Para cualquier consulta sobre devoluciones o reembolsos,
                puedes contactarnos en:
                <br />
                Teléfono: {site.phone}
                <br />
                Email:{' '}
                <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                </a>
            </p>
        </LegalPage>
    );
}
