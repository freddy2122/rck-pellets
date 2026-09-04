{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title>Jardines Gerardo</title>
        <link>{{ \App\Support\MerchantCatalog::baseUrl() }}</link>
        <description>Pellets de madera y biomasa en España. Precios con IVA incluido.</description>
        @foreach ($products as $product)
            <item>
                <g:id>{{ $product->id }}</g:id>
                <g:title>{{ \Illuminate\Support\Str::limit($product->name, 150, '') }}</g:title>
                <g:description>{{ \App\Support\MerchantCatalog::plainText($product->description) }}</g:description>
                <g:link>{{ \App\Support\MerchantCatalog::productUrl($product) }}</g:link>
                <g:image_link>{{ \App\Support\MerchantCatalog::primaryImageUrl($product) }}</g:image_link>
                @foreach (\App\Support\MerchantCatalog::additionalImageUrls($product) as $imageUrl)
                    <g:additional_image_link>{{ $imageUrl }}</g:additional_image_link>
                @endforeach
                <g:availability>in_stock</g:availability>
                <g:price>{{ number_format((float) $product->price, 2, '.', '') }} EUR</g:price>
                <g:brand>{{ $product->brandName() }}</g:brand>
                <g:condition>new</g:condition>
                @if ($product->gtin)
                    <g:gtin>{{ $product->gtin }}</g:gtin>
                @endif
                <g:mpn>{{ $product->mpnCode() }}</g:mpn>
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
