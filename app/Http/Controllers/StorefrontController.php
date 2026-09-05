<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Product;
use App\Support\MerchantCatalog;
use App\Support\PageMeta;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class StorefrontController extends Controller
{
    public function app(?string $any = null)
    {
        $page = PageMeta::forPath($any);

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@graph' => [
                self::withoutContext(MerchantCatalog::organizationGraph()),
                self::websiteGraph(),
            ],
        ];

        $meta = [
            'title' => $page['title'],
            'description' => $page['description'],
            'canonical' => $page['canonical'],
            'image' => MerchantCatalog::absoluteUrl('/images/logo.png'),
            'noindex' => $page['noindex'],
        ];

        $product = null;

        if ($any && preg_match('#^produtos/(\d+)$#', $any, $matches)) {
            $product = Product::query()
                ->where('is_active', true)
                ->find($matches[1]);

            if ($product) {
                $jsonLd = MerchantCatalog::productGraph($product);
                $jsonLd['@graph'][] = self::breadcrumbGraph($product);

                $meta = [
                    'title' => self::brandedTitle($product->name),
                    'description' => Str::limit(
                        MerchantCatalog::plainText($product->description),
                        155,
                    ),
                    'canonical' => MerchantCatalog::productUrl($product),
                    'image' => MerchantCatalog::primaryImageUrl($product),
                    'noindex' => false,
                ];
            } else {
                // Fiche supprimee ou desactivee : ne pas l'indexer.
                $meta['noindex'] = true;
            }
        }

        if ($any && preg_match('#^guias/([a-z0-9-]+)$#', $any, $matches)) {
            $article = Article::query()
                ->published()
                ->where('slug', $matches[1])
                ->first();

            if ($article) {
                $jsonLd['@graph'][] = $article->structuredData();
                $jsonLd['@graph'][] = self::articleBreadcrumb($article);

                $meta = [
                    'title' => self::brandedTitle($article->metaTitle()),
                    'description' => $article->metaDescription(),
                    'canonical' => $article->url(),
                    'image' => $article->imageUrl()
                        ?? MerchantCatalog::absoluteUrl('/images/logo.png'),
                    'noindex' => false,
                ];
            } else {
                $meta['noindex'] = true;
            }
        }

        return view('welcome', compact('jsonLd', 'meta', 'product'));
    }

    private static function articleBreadcrumb(Article $article): array
    {
        $url = rtrim((string) config('app.url'), '/');

        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Inicio',
                    'item' => $url.'/',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Guías',
                    'item' => $url.'/guias',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $article->title,
                    'item' => $article->url(),
                ],
            ],
        ];
    }

    /**
     * L'intitule prime sur la marque : si les deux ne tiennent pas, on garde
     * l'intitule seul plutot que de tronquer la marque en plein mot.
     */
    private static function brandedTitle(string $name): string
    {
        $full = $name.' | '.PageMeta::SITE_NAME;

        return mb_strlen($full) <= 65 ? $full : Str::limit($name, 65, '');
    }

    /**
     * Identifie le site aupres des moteurs et declare la recherche interne.
     */
    private static function websiteGraph(): array
    {
        $url = rtrim((string) config('app.url'), '/');

        return [
            '@type' => 'WebSite',
            'name' => PageMeta::SITE_NAME,
            'url' => $url,
            'inLanguage' => 'es-ES',
            'publisher' => ['@id' => $url.'/#organization'],
        ];
    }

    /**
     * Fil d'Ariane : Google l'affiche a la place de l'URL brute.
     */
    private static function breadcrumbGraph(Product $product): array
    {
        $url = rtrim((string) config('app.url'), '/');

        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Inicio',
                    'item' => $url.'/',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Productos',
                    'item' => $url.'/produtos',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $product->name,
                    'item' => MerchantCatalog::productUrl($product),
                ],
            ],
        ];
    }

    private static function withoutContext(array $graph): array
    {
        unset($graph['@context']);
        $graph['@id'] = rtrim((string) config('app.url'), '/').'/#organization';

        return $graph;
    }

    public function robots(): Response
    {
        $sitemap = rtrim((string) config('app.url'), '/').'/sitemap.xml';
        // Le tunnel d'achat et le back-office n'ont rien a faire dans l'index.
        $body = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /carrinho',
            'Disallow: /cart',
            'Disallow: /encomenda',
            'Disallow: /checkouts',
            '',
            'Sitemap: '.$sitemap,
            '',
        ]);

        return response($body, 200)->header('Content-Type', 'text/plain');
    }

    public function sitemap(): Response
    {
        // Toutes les pages indexables, alias exclus.
        $urls = PageMeta::indexablePaths();

        $xml = view('feeds.sitemap', [
            'urls' => $urls,
            'products' => MerchantCatalog::eligibleProducts(),
            'articles' => Article::query()
                ->published()
                ->orderByDesc('published_at')
                ->get(),
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    public function googleMerchantFeed(): Response
    {
        $xml = view('feeds.google-merchant', [
            'products' => MerchantCatalog::eligibleProducts(),
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
