<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $meta['title'] ?? 'Jardines leña Shop · Pellets y leña de calefacción en España' }}</title>
    <meta name="description" content="{{ $meta['description'] ?? 'Tienda online de pellets Steampower y leña de calefacción en España. IVA incluido, factura con NIF/NIE y entrega en la Península a 2,99 €.' }}">
    @if (!empty($meta['noindex']))
        <meta name="robots" content="noindex, nofollow">
    @else
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    @endif
    @if (!empty($meta['canonical']))
        <link rel="canonical" href="{{ $meta['canonical'] }}">
        <meta property="og:url" content="{{ $meta['canonical'] }}">
    @endif
        <meta property="og:locale" content="es_ES">
    <meta property="og:site_name" content="Jardines leña Shop">
    <meta property="og:type" content="{{ !empty($product) ? 'product' : 'website' }}">
    <meta property="og:title" content="{{ $meta['title'] ?? 'Jardines leña Shop' }}">
    <meta property="og:description" content="{{ $meta['description'] ?? '' }}">
    @if (!empty($meta['image']))
        <meta property="og:image" content="{{ $meta['image'] }}">
        <meta name="twitter:image" content="{{ $meta['image'] }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $meta['title'] ?? 'Jardines leña Shop' }}">
    <meta name="twitter:description" content="{{ $meta['description'] ?? '' }}">
    @if (!empty($product))
        <meta property="product:price:amount" content="{{ number_format((float) $product->price, 2, '.', '') }}">
        <meta property="product:price:currency" content="EUR">
        <meta property="product:availability" content="in stock">
        <meta property="product:condition" content="new">
        <meta property="product:retailer_item_id" content="{{ $product->skuCode() }}">
        <meta property="product:brand" content="{{ $product->brandName() }}">
    @endif
    @if (!empty($jsonLd))
        <script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>
    @endif
    <link rel="icon" href="/images/logo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="root"></div>
    @if (!empty($product))
        <noscript>
            <h1>{{ $product->name }}</h1>
            <p>{{ $product->description }}</p>
            <p>{{ number_format((float) $product->price, 2, '.', '') }} EUR · IVA incluido</p>
        </noscript>
    @endif
</body>
</html>
