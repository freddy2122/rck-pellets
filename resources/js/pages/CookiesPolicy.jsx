import LegalPage from '../components/LegalPage';

export default function CookiesPolicy() {
    return (
        <LegalPage
            kicker="Cookies"
            title="Política de cookies"
            intro="Información sobre las cookies utilizadas en este sitio, conforme a la normativa sobre comunicaciones electrónicas."
        >
            <p>
                Las cookies esenciales son necesarias para el carrito, la
                sesión y la seguridad. Sin ellas, la tienda puede no funcionar.
            </p>
            <p>
                Las cookies de análisis solo se usan si eliges «Aceptar todas»
                en el banner. Puedes cambiar la elección borrando los datos del
                navegador y recargando la página.
            </p>
            <p>
                También puedes gestionar las cookies en la configuración de tu
                navegador (Chrome, Safari, Firefox o Edge).
            </p>
        </LegalPage>
    );
}
