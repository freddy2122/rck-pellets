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
                Las cookies de análisis y publicidad —incluido el Meta Pixel
                de Facebook/Instagram y la etiqueta de Google Ads, que nos
                ayudan a medir el rendimiento de nuestras campañas
                publicitarias— solo se activan si eliges «Aceptar todas» en
                el banner. Puedes cambiar tu elección borrando los datos del
                navegador y recargando la página.
            </p>
            <p>
                También puedes gestionar las cookies en la configuración de tu
                navegador (Chrome, Safari, Firefox o Edge).
            </p>
        </LegalPage>
    );
}
