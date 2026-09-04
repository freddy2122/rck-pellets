<?php

namespace App\Support;

use App\Models\Product;
use App\Models\SiteContent;
use Illuminate\Support\Collection;

class MerchantCatalog
{
    public static function googleProductCategory(): string
    {
        return '1239';
    }

    public static function shippingMainlandPrice(): string
    {
        return '2.99';
    }

    public static function shippingIslandsPrice(): string
    {
        return '24.90';
    }

    public static function eligibleProducts(): Collection
    {
        return Product::query()
            ->where('is_active', true)
            ->whereNotNull('price')
            ->where('price', '>', 0)
            ->whereNotNull('description')
            ->where('description', '!=', '')
            ->with('images')
            ->latest()
            ->get()
            ->filter(fn (Product $product) => (bool) $product->primaryImageUrl());
    }

    public static function baseUrl(): string
    {
        return rtrim((string) config('app.url'), '/');
    }

    public static function productUrl(Product $product): string
    {
        return self::baseUrl().'/produtos/'.$product->id;
    }

    /**
     * Google Merchant et schema.org exigent des URL absolues.
     */
    public static function absoluteUrl(?string $path): ?string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return self::baseUrl().'/'.ltrim($path, '/');
    }

    /**
     * @return list<string>
     */
    public static function imageUrls(Product $product): array
    {
        return collect($product->imageUrls())
            ->map(fn (string $url) => self::absoluteUrl($url))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public static function primaryImageUrl(Product $product): ?string
    {
        return self::imageUrls($product)[0] ?? null;
    }

    /**
     * @return list<string>
     */
    public static function additionalImageUrls(Product $product): array
    {
        return array_slice(self::imageUrls($product), 1, 10);
    }

    /**
     * Google Merchant refuse le HTML dans g:description (5000 caracteres max).
     */
    public static function plainText(?string $html, int $limit = 5000): string
    {
        $text = preg_replace('#<(br|/p|/div|/li)[^>]*>#i', ' ', (string) $html);
        $text = html_entity_decode(strip_tags((string) $text), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\s+/u', ' ', $text);
        $text = trim((string) $text);

        return mb_substr($text, 0, $limit);
    }

    public static function organizationGraph(): array
    {
        $url = rtrim((string) config('app.url'), '/');
        $contact = SiteContent::contact();
        $address = $contact['address'];
        $digits = SiteContent::phoneDigits($contact['phone']);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Jardines Gerardo',
            'alternateName' => 'Jardines leña Shop',
            'url' => $url,
            'logo' => $url.'/images/logo.png',
            'email' => $contact['email'],
            'telephone' => '+'.$digits,
            'vatID' => 'ESB45617404',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $address['street'],
                'postalCode' => $address['postalCode'],
                'addressLocality' => $address['city'],
                'addressRegion' => $address['district'],
                'addressCountry' => 'ES',
            ],
            'areaServed' => [
                ['@type' => 'Country', 'name' => 'España'],
            ],
            'hasMerchantReturnPolicy' => self::returnPolicy(),
        ];
    }

    public static function productGraph(Product $product): array
    {
        $images = self::imageUrls($product);
        $offer = [
            '@type' => 'Offer',
            'url' => self::productUrl($product),
            'priceCurrency' => 'EUR',
            'price' => number_format((float) $product->price, 2, '.', ''),
            'priceValidUntil' => now()->addYear()->toDateString(),
            'availability' => 'https://schema.org/InStock',
            'itemCondition' => 'https://schema.org/NewCondition',
            'hasMerchantReturnPolicy' => self::returnPolicy(),
            'shippingDetails' => [
                self::shippingDetails('ES', self::shippingMainlandPrice(), 2, 5),
            ],
        ];

        $productNode = [
            '@type' => 'Product',
            'name' => $product->name,
            'description' => self::plainText($product->description),
            'sku' => $product->skuCode(),
            'brand' => [
                '@type' => 'Brand',
                'name' => $product->brandName(),
            ],
            'image' => $images,
            'offers' => $offer,
        ];

        if ($product->gtin) {
            $productNode['gtin'] = $product->gtin;
        } else {
            $productNode['mpn'] = $product->mpnCode();
        }

        $organization = self::organizationGraph();
        unset($organization['@context']);

        return [
            '@context' => 'https://schema.org',
            '@graph' => [$organization, $productNode],
        ];
    }

    public static function returnPolicy(): array
    {
        return [
            '@type' => 'MerchantReturnPolicy',
            'applicableCountry' => 'ES',
            'returnPolicyCategory' => 'https://schema.org/MerchantReturnFiniteReturnWindow',
            'merchantReturnDays' => 14,
            'returnMethod' => 'https://schema.org/ReturnByMail',
            'returnFees' => 'https://schema.org/ReturnShippingFees',
            'returnPolicyCountry' => 'ES',
        ];
    }

    public static function shippingDetails(
        string $country,
        string $price,
        int $minDays,
        int $maxDays,
    ): array {
        return [
            '@type' => 'OfferShippingDetails',
            'shippingRate' => [
                '@type' => 'MonetaryAmount',
                'value' => $price,
                'currency' => 'EUR',
            ],
            'shippingDestination' => [
                '@type' => 'DefinedRegion',
                'addressCountry' => $country,
            ],
            'deliveryTime' => [
                '@type' => 'ShippingDeliveryTime',
                'handlingTime' => [
                    '@type' => 'QuantitativeValue',
                    'minValue' => 0,
                    'maxValue' => 1,
                    'unitCode' => 'DAY',
                ],
                'transitTime' => [
                    '@type' => 'QuantitativeValue',
                    'minValue' => $minDays,
                    'maxValue' => $maxDays,
                    'unitCode' => 'DAY',
                ],
            ],
        ];
    }
}
