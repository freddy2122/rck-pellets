<?php

namespace App\Support;

class PageMeta
{
    public const SITE_NAME = 'Jardines leña Shop';

    /**
     * Metadonnees par page.
     *
     * Le titre vise 60 caracteres et la description 155 : au-dela, Google
     * tronque. "canonical" pointe la page de reference quand plusieurs
     * chemins servent le meme contenu.
     *
     * @var array<string, array{title: string, description: string, canonical?: string}>
     */
    private const PAGES = [
        '' => [
            'title' => 'Pellets y leña de calefacción en España',
            'description' => 'Pellets Steampower certificados y leña seca para estufas, calderas y chimeneas. IVA incluido, factura con NIF y entrega en 2-5 días en la Península.',
        ],
        'produtos' => [
            'title' => 'Catálogo de pellets y leña',
            'description' => 'Sacos de 15 kg, medias paletas y paletas completas de pellets Steampower, leña seca y troncos para chimenea. Precios con IVA y envío a toda España.',
        ],
        'sobre-nos' => [
            'title' => 'Quiénes somos',
            'description' => 'Jardines Gerardo distribuye pellets y leña de calefacción en España desde Polinyà, Barcelona. Conoce nuestro origen y nuestro compromiso con la biomasa.',
        ],
        'contactos' => [
            'title' => 'Contacto y atención al cliente',
            'description' => 'Escríbenos o llámanos para pedir presupuesto, resolver dudas sobre tu pedido o consultar disponibilidad de pellets y leña. Respuesta en 24 horas laborables.',
        ],
        'envios' => [
            'title' => 'Envíos, plazos y gastos de entrega',
            'description' => 'Entrega en 2-5 días laborables en la Península por 2,99 € y 5-10 días en Baleares, Canarias, Ceuta y Melilla. Consulta plazos y condiciones de transporte.',
        ],
        'seguir-pedido' => [
            'title' => 'Seguir mi pedido',
            'description' => 'Consulta el estado de tu pedido de pellets o leña con tu número de pedido y tu email: pago, preparación, envío y fecha estimada de entrega.',
        ],
        'resolucao' => [
            'title' => 'Devoluciones y derecho de desistimiento',
            'description' => 'Dispones de 14 días naturales para desistir de tu compra. Consulta cómo solicitar una devolución, los plazos de reembolso y los gastos aplicables.',
        ],
        'termos' => [
            'title' => 'Términos y condiciones de venta',
            'description' => 'Condiciones generales de contratación de Jardines Gerardo: pedidos, precios con IVA, formas de pago, entrega, garantías y resolución de conflictos.',
        ],
        'privacidade' => [
            'title' => 'Política de privacidad',
            'description' => 'Cómo tratamos tus datos personales conforme al RGPD y la Ley Orgánica 3/2018: finalidades, base jurídica, conservación y ejercicio de tus derechos.',
        ],
        'cookies' => [
            'title' => 'Política de cookies',
            'description' => 'Qué cookies utiliza jardinesgerardolienashop.es, para qué sirven, cuánto duran y cómo puedes aceptarlas, rechazarlas o configurarlas en tu navegador.',
        ],
        'aviso-legal' => [
            'title' => 'Aviso legal',
            'description' => 'Datos identificativos del titular del sitio, condiciones de uso, propiedad intelectual y responsabilidad, conforme a la Ley 34/2002 de comercio electrónico.',
        ],

        // Chemins alternatifs : meme contenu, canonique vers la page de reference.
        'collections/all' => [
            'title' => 'Catálogo de pellets y leña',
            'description' => 'Sacos de 15 kg, medias paletas y paletas completas de pellets Steampower, leña seca y troncos para chimenea. Precios con IVA y envío a toda España.',
            'canonical' => 'produtos',
        ],
        'pages/sobre' => [
            'title' => 'Quiénes somos',
            'description' => 'Jardines Gerardo distribuye pellets y leña de calefacción en España desde Polinyà, Barcelona. Conoce nuestro origen y nuestro compromiso con la biomasa.',
            'canonical' => 'sobre-nos',
        ],
        'pages/contato' => [
            'title' => 'Contacto y atención al cliente',
            'description' => 'Escríbenos o llámanos para pedir presupuesto, resolver dudas sobre tu pedido o consultar disponibilidad de pellets y leña. Respuesta en 24 horas laborables.',
            'canonical' => 'contactos',
        ],
    ];

    /**
     * Pages sans valeur pour la recherche, ou qui ne doivent jamais y
     * apparaitre : tunnel d'achat et back-office.
     *
     * @var list<string>
     */
    private const NOINDEX_PREFIXES = [
        'carrinho',
        'cart',
        'encomenda',
        'checkouts',
        'admin',
    ];

    /**
     * @return array{title: string, description: string, canonical: string, noindex: bool}
     */
    public static function forPath(?string $path): array
    {
        $path = trim((string) $path, '/');
        $page = self::PAGES[$path] ?? null;

        if ($page) {
            return [
                'title' => self::decorate($page['title']),
                'description' => $page['description'],
                'canonical' => self::url($page['canonical'] ?? $path),
                'noindex' => false,
            ];
        }

        // Page inconnue ou tunnel d'achat : titre generique et pas d'indexation.
        return [
            'title' => self::decorate(self::PAGES['']['title']),
            'description' => self::PAGES['']['description'],
            'canonical' => self::url($path),
            'noindex' => self::isNoindex($path),
        ];
    }

    public static function isNoindex(?string $path): bool
    {
        $path = trim((string) $path, '/');

        foreach (self::NOINDEX_PREFIXES as $prefix) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Chemins a proposer aux moteurs, hors fiches produit.
     *
     * @return list<string>
     */
    public static function indexablePaths(): array
    {
        return collect(self::PAGES)
            ->reject(fn (array $page) => isset($page['canonical']))
            ->keys()
            ->map(fn (string $path) => self::url($path))
            ->all();
    }

    private static function decorate(string $title): string
    {
        return $title.' | '.self::SITE_NAME;
    }

    private static function url(string $path): string
    {
        $base = rtrim((string) config('app.url'), '/');

        return $path === '' ? $base.'/' : $base.'/'.ltrim($path, '/');
    }
}
