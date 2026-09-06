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
                'description' => '<p>Saco de pellets (granulados) de madera maciza concebidos para sistemas de calefacción residencial, como estufas, recuperadores de calor y calderas de pellets. Fabricados a partir de madera natural no tratada, garantizan una combustión constante. Formato individual ensacado de 15 kg para facilitar el manejo y la recarga diaria del equipo.</p><p><strong>Especificaciones técnicas:</strong><br>- Material principal: 100 % madera maciza<br>- Peso neto del producto: 15 kg<br>- Dimensiones del envase (ancho x alto x profundidad): 37 cm x 47 cm x 8 cm<br></p>',
            ],
            [
                'sku' => 'RCK-PEL-450',
                'name' => 'Media paleta de pellets de madera maciza Steampower 450 kg',
                'category' => 'pellets',
                'brand' => 'Steampower',
                'price' => 145.00,
                'image' => '/images/pellets-media-paleta-450kg.jpg',
                'description' => '<p>Media paleta de pellets (granulados) de madera maciza adecuados para el abastecimiento de sistemas de calefacción residencial, como estufas, recuperadores de calor y calderas. Fabricados a partir de madera natural no tratada, ofrecen un rendimiento térmico constante con bajo contenido de residuos. Este formato intermedio se acondiciona en paleta para optimizar el transporte y facilitar el almacenamiento en espacios reducidos, como garajes o anexos.</p><p><strong>Especificaciones técnicas:</strong><br>- Material principal: 100 % madera maciza<br>- Configuración: media paleta (equivalente a 30 sacos de 15 kg)<br>- Peso neto del combustible: 450 kg<br>- Peso bruto (con embalaje): 460 kg<br>- Dimensiones de la paleta (ancho x profundidad): 80 cm x 120 cm<br>- Altura aproximada de la paleta: 90 cm<br></p>',
            ],
            [
                'sku' => 'RCK-PEL-975',
                'name' => 'Paleta de pellets de madera maciza Steampower 975 kg',
                'category' => 'pellets',
                'brand' => 'Steampower',
                'price' => 299.00,
                'image' => '/images/pellets-paleta-975kg.jpg',
                'description' => '<p>Paleta de pellets (granulados) de madera maciza adecuados para sistemas de calefacción doméstica, como estufas y calderas de pellets. Fabricados a partir de madera natural, ofrecen una solución eficiente para la calefacción residencial. El producto se entrega acondicionado en paleta para facilitar un almacenamiento seguro.</p><p>Especificaciones técnicas:<br>- Material principal: 100 % madera maciza<br>- Peso neto del combustible: 975 kg<br>- Peso bruto (con embalaje): 990 kg<br>- Dimensiones de la paleta (ancho x profundidad): 80 cm x 120 cm<br>- Altura total de la paleta: 160 cm<br></p>',
            ],
            [
                'sku' => 'RCK-LEN-25KG',
                'name' => 'Leña de calefacción — Saco 25 kg',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 8.90,
                'image' => '/images/lena-saco-25kg.jpg',
                'description' => '<p>Saco de 25 kg de leña seca para chimenea, estufa y horno de leña. Madera de calefacción lista para quemar, con bajo contenido de humedad.</p><p><strong>Especificaciones técnicas:</strong><br>- Material principal: leña seca<br>- Peso neto: 25 kg<br>- Uso: chimenea, estufa y horno de leña<br></p>',
            ],
            [
                'sku' => 'RCK-LEN-PALETE',
                'name' => 'Paleta de leña seca para calefacción',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 129.00,
                'image' => '/images/lena-paleta-seca.jpg',
                'description' => '<p>Paleta de leña de calefacción, seca y calibrada para uso doméstico. Entrega en la Península.</p><p><strong>Especificaciones técnicas:</strong><br>- Material principal: leña seca<br>- Formato: paleta<br>- Uso: calefacción doméstica<br></p>',
            ],
            [
                'sku' => 'RCK-LEN-TOROS',
                'name' => 'Troncos de madera para chimenea',
                'category' => 'lenha',
                'brand' => 'Jardines leña Shop',
                'price' => 49.90,
                'image' => '/images/lena-troncos-chimenea.jpg',
                'description' => '<p>Troncos de madera para chimenea y estufa de leña. Combustión lenta, calor constante y aroma a madera.</p><p><strong>Especificaciones técnicas:</strong><br>- Material principal: madera en troncos<br>- Uso: chimenea y estufa de leña<br></p>',
            ],
        ];

        foreach ($items as $item) {
            $product = Product::query()->updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'name' => $item['name'],
                    'category' => $item['category'],
                    'brand' => $item['brand'],
                    'description' => $item['description'],
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
}
