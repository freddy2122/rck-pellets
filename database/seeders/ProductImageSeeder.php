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
        'RCK-LEN-25KG' => '/images/lena-saco-25kg.jpg',
        'RCK-LEN-PALETE' => '/images/lena-paleta-seca.jpg',
        'RCK-LEN-TOROS' => '/images/lena-troncos-chimenea.jpg',
    ];

    /**
     * Visuels d'origine, remplaces par les nouveaux. Certains etaient
     * partages par plusieurs references : les laisser en images
     * secondaires reviendrait a envoyer a Google la meme photo pour deux
     * produits differents.
     *
     * Seules les lignes en base sont supprimees, les fichiers restent.
     *
     * @var list<string>
     */
    private const REMPLACEES = [
        '/images/pellets.jpg',
        '/images/pellets2.jpg',
        '/images/lenha.jpg',
        '/images/lenha-palete.jpg',
        '/images/toros.jpg',
    ];

    public function run(): void
    {
        foreach (self::IMAGES as $sku => $chemin) {
            $product = Product::query()->where('sku', $sku)->first();

            if (! $product) {
                $this->command?->warn("SKU introuvable : {$sku}");

                continue;
            }

            // Les visuels d'origine sortent du catalogue ; ceux televerses
            // depuis le back-office sont conserves en secondaires.
            $product->images()->whereIn('path', self::REMPLACEES)->delete();
            $product->images()->update(['is_primary' => false]);

            $product->images()->updateOrCreate(
                ['path' => $chemin],
                ['is_primary' => true, 'sort_order' => 0],
            );

            $this->command?->info("{$sku} : {$chemin}");
        }
    }
}
