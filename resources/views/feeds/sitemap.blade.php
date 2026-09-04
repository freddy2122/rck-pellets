{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach ($urls as $url)
    <url>
        <loc>{{ $url }}</loc>
        <changefreq>weekly</changefreq>
    </url>
@endforeach
@foreach ($products as $product)
    <url>
        <loc>{{ \App\Support\MerchantCatalog::productUrl($product) }}</loc>
        <lastmod>{{ $product->updated_at?->toAtomString() }}</lastmod>
        <changefreq>daily</changefreq>
    </url>
@endforeach
</urlset>
