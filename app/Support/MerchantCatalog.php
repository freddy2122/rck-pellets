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

    public static function productUrl(Product $product): string
    {
        return rtrim((string) config('app.url'), '/').'/produtos/'.$product->id;
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
        $images = $product->imageUrls();
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
            'description' => $product->description,
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
