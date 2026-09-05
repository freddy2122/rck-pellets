<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Enregistre l'etat courant du panier d'un visiteur.
     *
     * Le token est genere par le navigateur : aucune identification n'est
     * faite tant que le client n'a pas saisi son email au checkout.
     */
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'size:36'],
            'items' => ['present', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
            'email' => ['nullable', 'email', 'max:255'],
            'firstName' => ['nullable', 'string', 'max:120'],
            'lastName' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $cart = Cart::query()->firstOrNew(['token' => $validated['token']]);

        // Un panier deja converti ne doit plus etre reecrit : la commande
        // fait foi.
        if ($cart->exists && $cart->status === 'converted') {
            return response()->json(['status' => 'converted']);
        }

        // Les prix viennent de la base, jamais du client.
        $items = collect($validated['items'])
            ->map(function (array $item) {
                $product = Product::query()
                    ->where('is_active', true)
                    ->find((int) $item['id']);

                if (! $product) {
                    return null;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'quantity' => (int) $item['quantity'],
                    'image' => $product->primaryImageUrl(),
                ];
            })
            ->filter()
            ->values()
            ->all();

        $cart->fill([
            'items' => $items,
            'item_count' => collect($items)->sum('quantity'),
            'subtotal' => collect($items)->sum(
                fn (array $i) => $i['price'] * $i['quantity'],
            ),
            'status' => 'active',
            'last_activity_at' => now(),
        ]);

        // Les coordonnees ne sont ecrites que si le client les fournit ;
        // on n'efface jamais une valeur deja connue.
        foreach ([
            'email' => 'email',
            'firstName' => 'first_name',
            'lastName' => 'last_name',
            'phone' => 'phone',
        ] as $input => $column) {
            if (filled($validated[$input] ?? null)) {
                $cart->{$column} = $validated[$input];
            }
        }

        $cart->save();

        return response()->json(['status' => 'ok']);
    }

    /**
     * Paniers abandonnes, les plus recents d'abord.
     */
    public function index(Request $request)
    {
        // Le cron n'est pas garanti sur un hebergement mutualise : on
        // applique aussi la retention a chaque consultation du back-office.
        Cart::purgeExpired();

        $carts = Cart::query()
            ->abandoned()
            ->when(
                $request->boolean('contactable'),
                fn ($query) => $query->whereNotNull('email'),
            )
            ->orderByDesc('last_activity_at')
            ->limit(200)
            ->get()
            ->map(fn (Cart $cart) => $cart->toAdminArray());

        return response()->json([
            'carts' => $carts,
            'abandonedAfterMinutes' => Cart::ABANDONED_AFTER_MINUTES,
        ]);
    }

    /**
     * Suppression definitive d'un panier : sert au droit a l'effacement.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();

        return response()->json(['status' => 'deleted']);
    }
}
