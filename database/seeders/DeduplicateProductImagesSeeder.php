<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DeduplicateProductImagesSeeder extends Seeder
{
    /**
     * Supprime les visuels en double d'un meme produit.
     *
     * La comparaison porte sur le contenu du fichier, jamais sur son nom :
     * un televersement repete depuis le back-office produit des noms
     * differents pour des octets identiques.
     */
    public function run(): void
    {
        $supprimees = 0;

        foreach (Product::query()->with('images')->get() as $product) {
            $parEmpreinte = [];

            foreach ($product->images as $image) {
                $empreinte = $this->empreinte($image);

                // Fichier absent ou illisible : on n'y touche pas.
                if ($empreinte === null) {
                    continue;
                }

                if (! isset($parEmpreinte[$empreinte])) {
                    $parEmpreinte[$empreinte] = $image;

                    continue;
                }

                // On conserve l'image principale ; a defaut, la plus ancienne.
                $gardee = $parEmpreinte[$empreinte];

                if ($image->is_primary && ! $gardee->is_primary) {
                    [$gardee, $image] = [$image, $gardee];
                    $parEmpreinte[$empreinte] = $gardee;
                }

                $this->supprimerFichierSiOrphelin($image);
                $image->delete();
                $supprimees++;
            }
        }

        $this->command?->info("Visuels en double supprimes : {$supprimees}");
    }

    /**
     * Empreinte du fichier, ou null s'il est introuvable.
     */
    private function empreinte(ProductImage $image): ?string
    {
        $chemin = (string) $image->path;

        // Visuel televerse depuis le back-office.
        if (! str_starts_with($chemin, '/') && ! str_starts_with($chemin, 'http')) {
            return Storage::disk('public')->exists($chemin)
                ? md5(Storage::disk('public')->get($chemin))
                : null;
        }

        // Visuel statique livre avec le projet.
        $absolu = public_path(ltrim($chemin, '/'));

        return is_file($absolu) ? md5_file($absolu) : null;
    }

    /**
     * Retire le fichier televerse s'il n'est plus reference nulle part.
     *
     * Les visuels statiques de public/ ne sont jamais supprimes : ils sont
     * versionnes avec le projet et peuvent servir ailleurs.
     */
    private function supprimerFichierSiOrphelin(ProductImage $image): void
    {
        $chemin = (string) $image->path;

        if (str_starts_with($chemin, '/') || str_starts_with($chemin, 'http')) {
            return;
        }

        $encoreUtilise = ProductImage::query()
            ->where('path', $chemin)
            ->where('id', '!=', $image->id)
            ->exists();

        if (! $encoreUtilise) {
            Storage::disk('public')->delete($chemin);
        }
    }
}
