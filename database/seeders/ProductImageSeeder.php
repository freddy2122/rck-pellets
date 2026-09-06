<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Associe a chaque reference son visuel principal.
     *
     * Les images precedentes ne sont pas supprimees : elles sont
     * retrogradees en images secondaires. Rien de ce qui a ete televerse
     * depuis le back-office n'est perdu.
     *
     * @var array<string, string>
     */
    private const IMAGES = [
        'RCK-PEL-15KG' => '/images/pellets-saco-15kg.jpg',
        'RCK-PEL-450' => '/images/pellets-media-paleta-450kg.jpg',
        'RCK-PEL-975' => '/images/pellets-paleta-975kg.jpg',
    ];

    public function run(): void
    {
        foreach (self::IMAGES as $sku => $chemin) {
            $product = Product::query()->where('sku', $sku)->first();

            if (! $product) {
                $this->command?->warn("SKU introuvable : {$sku}");

                continue;
            }

            // Les autres visuels reculent d'un rang.
            $product->images()->update(['is_primary' => false]);

            $product->images()->updateOrCreate(
                ['path' => $chemin],
                ['is_primary' => true, 'sort_order' => 0],
            );

            $this->command?->info("{$sku} : {$chemin}");
        }
    }
}
