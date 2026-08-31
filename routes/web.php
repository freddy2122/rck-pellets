<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/robots.txt', [StorefrontController::class, 'robots']);
Route::get('/sitemap.xml', [StorefrontController::class, 'sitemap']);
Route::get('/merchant/google.xml', [StorefrontController::class, 'googleMerchantFeed']);

Route::get('/{any?}', [StorefrontController::class, 'app'])->where('any', '.*');
