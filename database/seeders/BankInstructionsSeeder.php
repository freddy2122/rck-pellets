<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

/**
 * Mise a jour ponctuelle du texte des instructions de paiement (calque sur
 * la formulation de bhtbiocombustiveis-lda.pt, en espagnol, avec nos
 * coordonnees). A executer une seule fois puis a retirer de deploy.sh :
 * un admin peut ensuite modifier ce texte depuis le tableau de bord, et on
 * ne veut pas que le futur contenu soit ecrase a chaque deploiement.
 */
class BankInstructionsSeeder extends Seeder
{
    public function run(): void
    {
        $instructions = <<<'TEXT'
Realiza tu pago por transferencia bancaria o depósito directo en nuestra cuenta. Indica tu número de pedido como referencia de la transferencia o depósito. Tu pedido no será enviado hasta que confirmemos el ingreso en nuestra cuenta.

VERONICA PEREZAGUA GONZALEZ (imaginBank)

IBAN: ES15 2100 6095 5002 0031 4230
BIC: CAIXESBBXXX
Tipo de transferencia: Inmediato

Por favor, realiza el pago y envíanos el justificante por WhatsApp o e-mail.
TEXT;

        SiteContent::query()->updateOrCreate(
            ['key' => SiteContent::BANK_KEY],
            ['value' => json_encode(['instructions' => $instructions])],
        );
    }
}
