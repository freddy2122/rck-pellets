<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SiteContentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
});


/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

/*
 * Routes publiques
 */

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{product}', [ProductController::class, 'show']);


/*
 * Routes administrateur
 */

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/admin/products', [ProductController::class, 'adminIndex']);

    Route::post('/products', [ProductController::class, 'store']);

    Route::put('/products/{product}', [ProductController::class, 'update']);

    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

});


/*
|--------------------------------------------------------------------------
| Site Content
|--------------------------------------------------------------------------
|
| Image de la section :
| "Qualidade e sustentabilidade"
|
*/

/*
 * Route publique
 *
 * Utilisée par la page /produtos pour récupérer
 * l'image actuellement enregistrée.
 */

Route::get(
    '/site-content/qualidade-sustentabilidade',
    [SiteContentController::class, 'qualidadeImage']
);

Route::get('/site-content/bank', [SiteContentController::class, 'bank']);
Route::get('/site-content/contact', [SiteContentController::class, 'contact']);


/*
 * Routes administrateur
 *
 * Seul un utilisateur connecté peut modifier
 * ou supprimer l'image.
 */

Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/site-content/qualidade-sustentabilidade',
        [SiteContentController::class, 'updateQualidadeImage']
    );

    Route::delete(
        '/site-content/qualidade-sustentabilidade',
        [SiteContentController::class, 'deleteQualidadeImage']
    );

    Route::put('/site-content/bank', [SiteContentController::class, 'updateBank']);
    Route::put('/site-content/contact', [SiteContentController::class, 'updateContact']);

});


/*
|--------------------------------------------------------------------------
| Contact
|--------------------------------------------------------------------------
*/

Route::post('/contact', [ContactController::class, 'store']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/cart/sync', [CartController::class, 'sync']);
Route::post('/orders/track', [OrderController::class, 'track']);
Route::get('/orders/{token}', [OrderController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::get('/admin/orders/export', [OrderController::class, 'export']);
    Route::get('/admin/orders/{order}', [OrderController::class, 'showAdmin']);
    Route::patch('/admin/orders/{order}', [OrderController::class, 'updateStatus']);
    Route::get('/admin/carts', [CartController::class, 'index']);
    Route::delete('/admin/carts/{cart}', [CartController::class, 'destroy']);
    Route::get('/admin/contact-messages', [ContactController::class, 'index']);
    Route::patch('/admin/contact-messages/{contactMessage}', [ContactController::class, 'update']);
    Route::delete('/admin/contact-messages/{contactMessage}', [ContactController::class, 'destroy']);
});
