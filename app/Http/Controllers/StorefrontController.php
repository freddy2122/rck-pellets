<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\MerchantCatalog;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class StorefrontController extends Controller
{
    public function app(?string $any = null)
    {
        $jsonLd = MerchantCatalog::organizationGraph();
        $meta = [
            'title' => 'Jardines leña Shop · Pellets y leña de calefacción en España',
            'description' => 'Tienda online de pellets Steampower y leña de calefacción en España. IVA incluido, factura con NIF/NIE y entrega en la Península.',
            'canonical' => rtrim((string) config('app.url'), '/').'/'.ltrim((string) $any, '/'),
            'image' => null,
        ];

        $product = null;

        if ($any && preg_match('#^produtos/(\d+)$#', $any, $matches)) {
            $product = Product::query()
                ->where('is_active', true)
                ->find($matches[1]);

            if ($product) {
                $jsonLd = MerchantCatalog::productGraph($product);
                $meta = [
                    'title' => $product->name.' · Jardines leña Shop',
                    'description' => Str::limit(
                        strip_tags((string) $product->description),
                        160,
                    ),
                    'canonical' => MerchantCatalog::productUrl($product),
                    'image' => $product->primaryImageUrl(),
                ];
            }
        }

        if ($any === '' || $any === null) {
            $meta['canonical'] = rtrim((string) config('app.url'), '/');
        }

        return view('welcome', compact('jsonLd', 'meta', 'product'));
    }

    public function robots(): Response
    {
        $sitemap = rtrim((string) config('app.url'), '/').'/sitemap.xml';
        $body = "User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nSitemap: {$sitemap}\n";

        return response($body, 200)->header('Content-Type', 'text/plain');
    }

    public function sitemap(): Response
    {
        $base = rtrim((string) config('app.url'), '/');
        $urls = [
            $base.'/',
            $base.'/produtos',
            $base.'/sobre-nos',
            $base.'/contactos',
            $base.'/envios',
            $base.'/termos',
            $base.'/privacidade',
            $base.'/resolucao',
        ];

        $xml = view('feeds.sitemap', [
            'urls' => $urls,
            'products' => MerchantCatalog::eligibleProducts(),
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
