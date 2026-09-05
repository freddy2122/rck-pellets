<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();

            // Identifiant genere cote navigateur, conserve en localStorage.
            $table->string('token', 64)->unique();

            // Renseignes uniquement si le client les saisit au checkout.
            $table->string('email')->nullable()->index();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();

            $table->json('items');
            $table->unsignedInteger('item_count')->default(0);
            $table->decimal('subtotal', 10, 2)->default(0);

            // active : panier en cours ; converted : commande passee.
            $table->string('status')->default('active')->index();
            // Pas de contrainte de cle etrangere : orders.id est un int(11)
            // signe en production, issu d'un import SQL et non des migrations,
            // alors que foreignId() genere un bigint non signe. MySQL refuse
            // l'association. La colonne reste indexee, ce qui suffit ici :
            // un panier converti n'apparait jamais dans la liste des abandons.
            $table->unsignedBigInteger('order_id')->nullable()->index();

            $table->timestamp('last_activity_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
