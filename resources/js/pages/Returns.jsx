import LegalPage from '../components/LegalPage';
import { SITE, fullAddress } from '../lib/site';

export default function Returns() {
    return (
        <LegalPage
            kicker="Consumidor"
            title="Derecho de desistimiento"
            intro="Información prevista en el Decreto-Lei n.º 24/2014, de 14 de febrero, para contratos celebrados a distancia."
        >
            <p>
                El consumidor tiene 14 días, a contar desde la recepción de los
                bienes, para desistir del contrato sin indicar motivo y sin
                incurrir en costes distintos de los previstos en la ley
                (especialmente la devolución, salvo que el vendedor los asuma).
            </p>
            <p>
                Para ejercer el derecho, envía una declaración inequívoca a{' '}
                {SITE.email} o a {fullAddress()}, identificando el pedido.
                Puedes usar el modelo de formulario de desistimiento anexo al
                DL n.º 24/2014.
            </p>
            <p>
                El reembolso se efectúa en un plazo de 14 días tras ser
                informados del desistimiento, por el mismo medio de pago, salvo
                acuerdo en contrario. Podemos retener el reembolso hasta la
                recepción de los bienes o la prueba de reenvío.
            </p>
            <p>
                El derecho puede no aplicarse a bienes precintados que no
                puedan devolverse por motivos de higiene o que, tras la
                entrega, queden mezclados de forma inseparable, según la ley.
            </p>
        </LegalPage>
    );
}
