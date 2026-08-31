{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title>Jardines Gerardo</title>
        <link>{{ rtrim(config('app.url'), '/') }}</link>
        <description>Pellets de madera y biomasa en España. Precios con IVA incluido.</description>
        @foreach ($products as $product)
            <item>
                <g:id>{{ $product->id }}</g:id>
                <g:title>{{ $product->name }}</g:title>
                <g:description>{{ $product->description }}</g:description>
                <g:link>{{ \App\Support\MerchantCatalog::productUrl($product) }}</g:link>
                <g:image_link>{{ $product->primaryImageUrl() }}</g:image_link>
                @foreach ($product->images as $image)
                    @if (! $image->is_primary)
                        <g:additional_image_link>{{ $image->url }}</g:additional_image_link>
                    @endif
                @endforeach
                <g:availability>in_stock</g:availability>
                <g:price>{{ number_format((float) $product->price, 2, '.', '') }} EUR</g:price>
                <g:brand>{{ $product->brandName() }}</g:brand>
                <g:condition>new</g:condition>
                <g:sku>{{ $product->skuCode() }}</g:sku>
                <g:mpn>{{ $product->mpnCode() }}</g:mpn>
                @if ($product->gtin)
                    <g:gtin>{{ $product->gtin }}</g:gtin>
                @else
                    <g:identifier_exists>no</g:identifier_exists>
                @endif
                <g:google_product_category>{{ \App\Support\MerchantCatalog::googleProductCategory() }}</g:google_product_category>
                <g:adult>no</g:adult>
                <g:shipping>
                    <g:country>ES</g:country>
                    <g:service>Península</g:service>
                    <g:price>{{ \App\Support\MerchantCatalog::shippingMainlandPrice() }} EUR</g:price>
                </g:shipping>
            </item>
        @endforeach
    </channel>
</rss>
