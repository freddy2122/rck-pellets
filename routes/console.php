<?php

use App\Models\Cart;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('carts:purge', function () {
    $deleted = Cart::purgeExpired();

    $this->info("Paniers supprimes : {$deleted}");
})->purpose('Supprime les paniers au-dela de la duree de conservation RGPD');

// Filet de securite si un cron est configure sur l'hebergement.
Schedule::command('carts:purge')->dailyAt('03:30');
