<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            $table->string('slug')->unique();
            $table->string('title');

            // Sert de chapeau sur la liste et de meta description par defaut.
            $table->string('excerpt', 300);
            $table->longText('body');

            $table->string('image')->nullable();

            // Renseignes seulement si l'on veut s'ecarter du titre ou du chapeau.
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 300)->nullable();

            $table->boolean('is_published')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
