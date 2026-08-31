<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteContentController extends Controller
{
    /**
     * Clé utilisée en base de données pour l'image
     * de la section "Qualidade e sustentabilidade".
     */
    private const QUALITY_IMAGE_KEY = 'qualidade_sustentabilidade_image';


    /**
     * Récupérer l'image de la section
     * "Qualidade e sustentabilidade".
     *
     * GET /api/site-content/qualidade-sustentabilidade
     */
    public function qualidadeImage()
    {
        $content = SiteContent::where(
            'key',
            self::QUALITY_IMAGE_KEY
        )->first();

        /*
         * Aucune image enregistrée.
         */
        if (!$content || !$content->value) {
            return response()->json([
                'data' => null,
            ]);
        }

        return response()->json([
            'data' => [
                'key' => $content->key,
                'value' => $content->value,
                'image_url' => '/storage/'.ltrim((string) $content->value, '/'),
            ],
        ]);
    }


    /**
     * Ajouter ou remplacer l'image.
     *
     * POST /api/site-content/qualidade-sustentabilidade
     */
    public function updateQualidadeImage(Request $request)
    {
        /*
         * Validation de l'image.
         */
        $request->validate(
            [
                'image' => [
                    'required',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:5120',
                ],
            ],
            [
                'image.required' =>
                    'Veuillez sélectionner une image.',

                'image.image' =>
                    'Le fichier sélectionné doit être une image.',

                'image.mimes' =>
                    'L’image doit être au format JPG, PNG ou WEBP.',

                'image.max' =>
                    'L’image ne doit pas dépasser 5 Mo.',
            ]
        );


        /*
         * Chercher l'image actuellement enregistrée.
         */
        $content = SiteContent::where(
            'key',
            self::QUALITY_IMAGE_KEY
        )->first();


        /*
         * Supprimer l'ancienne image du stockage
         * avant d'enregistrer la nouvelle.
         */
        if ($content && $content->value) {
            Storage::disk('public')->delete(
                $content->value
            );
        }


        /*
         * Enregistrer la nouvelle image dans :
         *
         * storage/app/public/site/
         */
        $path = $request->file('image')->store(
            'site',
            'public'
        );


        /*
         * Créer l'enregistrement s'il n'existe pas.
         */
        if (!$content) {
            $content = SiteContent::create([
                'key' => self::QUALITY_IMAGE_KEY,
                'value' => $path,
            ]);
        } else {
            /*
             * Sinon remplacer le chemin de l'ancienne image.
             */
            $content->update([
                'value' => $path,
            ]);
        }


        /*
         * Retourner les informations au dashboard.
         */
        return response()->json([
            'message' => 'Image enregistrée avec succès.',

            'data' => [
                'key' => $content->key,

                'value' => $content->value,

                'image_url' => '/storage/'.ltrim((string) $content->value, '/'),
            ],
        ]);
    }


    /**
     * Supprimer l'image.
     *
     * DELETE /api/site-content/qualidade-sustentabilidade
     */
    public function deleteQualidadeImage()
    {
        /*
         * Chercher l'image.
         */
        $content = SiteContent::where(
            'key',
            self::QUALITY_IMAGE_KEY
        )->first();


        /*
         * Aucun contenu trouvé.
         */
        if (!$content) {
            return response()->json([
                'message' => 'Aucune image à supprimer.',
            ], 404);
        }


        /*
         * Supprimer le fichier physique.
         */
        if ($content->value) {
            Storage::disk('public')->delete(
                $content->value
            );
        }


        /*
         * Supprimer l'enregistrement en BDD.
         */
        $content->delete();


        return response()->json([
            'message' => 'Image supprimée avec succès.',
        ]);
    }

    public function bank()
    {
        return response()->json(SiteContent::bank());
    }

    public function updateBank(Request $request)
    {
        $validated = $request->validate([
            'holder' => ['required', 'string', 'max:180'],
            'name' => ['nullable', 'string', 'max:180'],
            'iban' => ['required', 'string', 'max:42'],
            'bic' => ['required', 'string', 'max:16'],
        ]);

        $payload = [
            'holder' => trim($validated['holder']),
            'name' => trim((string) ($validated['name'] ?? '')),
            'iban' => strtoupper(preg_replace('/\s+/', '', $validated['iban'])),
            'bic' => strtoupper(trim($validated['bic'])),
        ];

        SiteContent::query()->updateOrCreate(
            ['key' => SiteContent::BANK_KEY],
            ['value' => json_encode($payload)],
        );

        return response()->json(SiteContent::bank());
    }

    public function contact()
    {
        return response()->json(SiteContent::contact());
    }

    public function updateContact(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['required', 'string', 'max:40'],
            'street' => ['required', 'string', 'max:180'],
            'postalCode' => ['required', 'string', 'max:16'],
            'city' => ['required', 'string', 'max:80'],
            'district' => ['required', 'string', 'max:80'],
            'country' => ['required', 'string', 'max:80'],
        ]);

        $payload = [
            'email' => mb_strtolower(trim($validated['email'])),
            'phone' => trim($validated['phone']),
            'street' => trim($validated['street']),
            'postalCode' => trim($validated['postalCode']),
            'city' => trim($validated['city']),
            'district' => trim($validated['district']),
            'country' => trim($validated['country']),
        ];

        SiteContent::query()->updateOrCreate(
            ['key' => SiteContent::CONTACT_KEY],
            ['value' => json_encode($payload)],
        );

        return response()->json(SiteContent::contact());
    }
}
