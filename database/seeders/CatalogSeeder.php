<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'sku' => 'RCK-PEL-15KG',
                'name' => 'Pellets de madera maciza Steampower - Saco de 15 kg',
                'category' => 'pellets',
                'brand' => 'Steampower',
                'price' => 4.99,
                'image' => '/images/pellets-saco-15kg.jpg',
                'description' => '<h3>🔥 Alto rendimiento para una calefacción eficiente</h3><p>Saco de pellets (granulados) de madera maciza concebidos para sistemas de calefacción residencial, como estufas, recuperadores de calor y calderas de pellets. Fabricados a partir de madera natural no tratada, garantizan una combustión constante y estable.</p><h3>📦 Composición del Saco</h3><p>- Formato: saco individual<br>- Peso neto: 15 kg</p><h3>⚙️ Características Técnicas</h3><p>- Certificado ENplus A1<br>- Materia prima: madera maciza sin aditivos químicos<br>- Diámetro: 6 mm<br>- Alto poder calorífico<br>- Bajo contenido de humedad<br>- Combustión eficiente y estable<br>- Producción reducida de cenizas<br>- Dimensiones del envase (ancho x alto x profundidad): 37 cm x 47 cm x 8 cm</p><h3>✅ Ventajas del Producto</h3><p>- Formato práctico para la recarga diaria<br>- Excelente rendimiento energético<br>- Combustión limpia<br>- Apto para uso doméstico</p><h3>ℹ️ Utilización</h3><p>Compatible con estufas y calderas de pellets que utilicen pellets de 6 mm.</p>',
            ],
            [
                'sku' => 'RCK-PEL-450',
                'name' => 'Media paleta de pellets de madera maciza Steampower 450 kg',
                'category' => 'pellets',
                'brand' => 'Steampower',
                'price' => 145.00,
                'image' => '/images/pellets-media-paleta-450kg.jpg',
                'description' => '<h3>🔥 Alto rendimiento para una calefacción eficiente</h3><p>Media paleta de pellets (granulados) de madera maciza adecuados para el abastecimiento de sistemas de calefacción residencial, como estufas, recuperadores de calor y calderas. Fabricados a partir de madera natural no tratada, ofrecen un rendimiento térmico constante con bajo contenido de residuos.</p><h3>📦 Composición de la Paleta</h3><p>- Configuración: media paleta (equivalente a 30 sacos de 15 kg)<br>- Peso neto del combustible: 450 kg<br>- Peso bruto (con embalaje): 460 kg</p><h3>⚙️ Características Técnicas</h3><p>- Certificado ENplus A1<br>- Materia prima: madera maciza sin aditivos químicos<br>- Diámetro: 6 mm<br>- Alto poder calorífico<br>- Bajo contenido de humedad<br>- Combustión eficiente y estable<br>- Dimensiones de la paleta (ancho x profundidad): 80 cm x 120 cm<br>- Altura aproximada de la paleta: 90 cm</p><h3>✅ Ventajas del Producto</h3><p>- Suministro en volumen intermedio para un consumo prolongado<br>- Paleta pensada para optimizar el transporte y el almacenamiento en espacios reducidos (garajes, anexos)<br>- Excelente rendimiento energético<br>- Combustión limpia</p><h3>ℹ️ Utilización</h3><p>Compatible con estufas y calderas de pellets que utilicen pellets de 6 mm.</p>',
            ],
            [
                'sku' => 'RCK-PEL-975',
                'name' => 'Paleta de pellets de madera maciza Steampower 975 kg',
                'category' => 'pellets',
                'brand' => 'Steampower',
                'price' => 299.00,
                'image' => '/images/pellets-paleta-975kg.jpg',
                'description' => '<h3>🔥 Alto rendimiento para una calefacción eficiente</h3><p>Paleta de pellets (granulados) de madera maciza adecuados para sistemas de calefacción doméstica, como estufas y calderas de pellets. Fabricados a partir de madera natural, ofrecen una solución eficiente y estable para la calefacción residencial durante toda la temporada de invierno.</p><h3>📦 Composición de la Paleta</h3><p>- Peso neto del combustible: 975 kg<br>- Peso bruto (con embalaje): 990 kg</p><h3>⚙️ Características Técnicas</h3><p>- Certificado ENplus A1<br>- Materia prima: madera maciza sin aditivos químicos<br>- Diámetro: 6 mm<br>- Alto poder calorífico<br>- Bajo contenido de humedad<br>- Combustión eficiente y estable<br>- Producción reducida de cenizas<br>- Dimensiones de la paleta (ancho x profundidad): 80 cm x 120 cm<br>- Altura total de la paleta: 160 cm</p><h3>✅ Ventajas del Producto</h3><p>- Suministro en gran volumen para un consumo prolongado<br>- Excelente rendimiento energético<br>- Combustión limpia<br>- Apto para uso doméstico y profesional</p><h3>ℹ️ Utilización</h3><p>Compatible con estufas y calderas de pellets que utilicen pellets de 6 mm.</p>',
            ],
            [
                'sku' => 'RCK-LEN-25KG',
                'name' => 'Leña de calefacción — Saco 25 kg',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 8.90,
                'image' => '/images/lena-saco-25kg.jpg',
                'description' => '<h3>🔥 Calor constante para tu chimenea o estufa</h3><p>Saco de 25 kg de leña seca lista para quemar, ideal para chimenea, estufa y horno de leña. Madera de calefacción con bajo contenido de humedad para una combustión limpia desde el primer uso.</p><h3>📦 Composición del Saco</h3><p>- Formato: saco individual<br>- Peso neto: 25 kg</p><h3>⚙️ Características Técnicas</h3><p>- Materia prima: leña natural seca<br>- Bajo contenido de humedad<br>- Combustión lenta y calor constante<br>- Producción reducida de cenizas</p><h3>✅ Ventajas del Producto</h3><p>- Lista para quemar, sin necesidad de secado adicional<br>- Formato práctico para uso diario<br>- Combustión limpia y aroma natural a madera</p><h3>ℹ️ Utilización</h3><p>Compatible con chimeneas, estufas y hornos de leña.</p>',
            ],
            [
                'sku' => 'RCK-LEN-PALETE',
                'name' => 'Paleta de leña seca para calefacción',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 129.00,
                'image' => '/images/lena-paleta-seca.jpg',
                'description' => '<h3>🔥 Calor constante para toda la temporada</h3><p>Paleta de leña de calefacción, seca y calibrada para uso doméstico, pensada para quienes buscan autonomía durante todo el invierno. Entrega en la Península.</p><h3>📦 Composición de la Paleta</h3><p>- Formato: paleta<br>- Leña seca y calibrada</p><h3>⚙️ Características Técnicas</h3><p>- Materia prima: leña natural seca<br>- Bajo contenido de humedad<br>- Combustión lenta y calor constante</p><h3>✅ Ventajas del Producto</h3><p>- Suministro en gran volumen para consumo prolongado<br>- Leña calibrada para una combustión homogénea<br>- Apto para uso doméstico</p><h3>ℹ️ Utilización</h3><p>Compatible con chimeneas, estufas de leña y hornos.</p>',
            ],
            [
                'sku' => 'RCK-LEN-TOROS',
                'name' => 'Troncos de madera para chimenea',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 49.90,
                'image' => '/images/lena-troncos-chimenea.jpg',
                'description' => '<h3>🔥 Calor constante y aroma natural a madera</h3><p>Troncos de madera para chimenea y estufa de leña. Combustión lenta y calor constante, ideales para las veladas de invierno.</p><h3>📦 Composición</h3><p>- Formato: troncos de madera</p><h3>⚙️ Características Técnicas</h3><p>- Materia prima: madera natural en troncos<br>- Combustión lenta<br>- Bajo contenido de humedad</p><h3>✅ Ventajas del Producto</h3><p>- Calor constante y duradero<br>- Aroma natural a madera<br>- Apto para uso doméstico</p><h3>ℹ️ Utilización</h3><p>Compatible con chimeneas y estufas de leña.</p>',
            ],
        ];

        foreach ($items as $item) {
            $product = Product::query()->updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'name' => $item['name'],
                    'category' => $item['category'],
                    'brand' => $item['brand'],
                    'description' => strtr($item['description'], self::sectionIcons()),
                    'price' => $item['price'],
                    'image' => $item['image'],
                    'is_active' => true,
                ],
            );

            $product->images()->delete();
            $product->images()->create([
                'path' => $item['image'],
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        Product::query()
            ->where('sku', 'like', 'LCP-%')
            ->update(['is_active' => false]);

        Product::query()
            ->where(function ($query) {
                $query->whereNull('sku')->orWhere('sku', '');
            })
            ->update(['is_active' => false]);
    }

    /**
     * Emoji utilises comme repere lisible dans les descriptions ci-dessus,
     * remplaces ici par de vraies icones SVG (memes traces que lucide-react,
     * deja utilise cote front) avant l'enregistrement en base.
     */
    private static function sectionIcons(): array
    {
        $svg = fn (string $paths) => '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" '
            .'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            .'stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;'
            .'vertical-align:-3px;margin-right:6px;color:#3d6b4f">'.$paths.'</svg>';

        return [
            '🔥' => $svg('<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>'),
            '📦' => $svg('<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>'),
            '⚙️' => $svg('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>'),
            '✅' => $svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
            'ℹ️' => $svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
        ];
    }
}
