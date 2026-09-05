<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    private const MAINLAND_SHIPPING = 2.99;

    private const ISLANDS_SHIPPING = 24.90;

    private const ISLAND_DISTRICTS = [
        'Islas Baleares',
        'Las Palmas',
        'Santa Cruz de Tenerife',
        'Ceuta',
        'Melilla',
    ];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'firstName' => ['required', 'string', 'max:120'],
            'lastName' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:180'],
            'street' => ['required', 'string', 'max:255'],
            'address2' => ['nullable', 'string', 'max:255'],
            'postalCode' => ['required', 'string', 'regex:/^\d{5}$/'],
            'city' => ['required', 'string', 'max:120'],
            'district' => ['required', 'string', 'max:120'],
            'nif' => ['nullable', 'string', 'max:20'],
            'payment' => ['required', Rule::in(['multibanco', 'transferencia'])],
            'newsletter' => ['sometimes', 'boolean'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'shipping' => ['nullable', 'array'],
            'subtotal' => ['required', 'numeric'],
            'total' => ['required', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'cartToken' => ['nullable', 'string', 'size:36'],
        ]);

        $items = collect($validated['items'])
            ->map(function (array $item) {
                $product = Product::query()
                    ->where('is_active', true)
                    ->findOrFail((int) $item['id']);

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'quantity' => (int) $item['quantity'],
                    'image' => $product->primaryImageUrl() ?: $product->image,
                ];
            })
            ->values()
            ->all();

        $subtotal = collect($items)->sum(
            fn (array $item) => $item['price'] * $item['quantity'],
        );
        $shipping = $this->shippingForDistrict($validated['district']);
        $total = round($subtotal + $shipping['price'], 2);
        $tax = round($total - ($total / 1.21), 2);

        $order = Order::query()->create([
            'number' => 'tmp',
            'token' => Order::makeToken(),
            'email' => $validated['email'],
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'street' => $validated['street'],
            'address2' => $validated['address2'] ?? null,
            'postal_code' => $validated['postalCode'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'country' => 'España',
            'nif' => $validated['nif'] ?? null,
            'payment' => $validated['payment'],
            'newsletter' => (bool) ($validated['newsletter'] ?? false),
            'items' => $items,
            'shipping' => $shipping,
            'subtotal' => $subtotal,
            'total' => $total,
            'tax' => $tax,
            'pay_by' => now()->addDays(7),
        ]);

        $order->number = (string) (1000 + $order->id);
        $order->save();

        // Le panier correspondant sort de la liste des abandons.
        if (filled($validated['cartToken'] ?? null)) {
            Cart::query()
                ->where('token', $validated['cartToken'])
                ->update([
                    'status' => 'converted',
                    'order_id' => $order->id,
                    'last_activity_at' => now(),
                ]);
        }

        try {
            Mail::to($order->email)->send(new OrderConfirmationMail($order));
        } catch (\Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'message' => 'Pedido registrado. Te hemos enviado las instrucciones de pago.',
            'order' => $order->fresh()->toStorefrontArray(),
        ], 201);
    }

    private function shippingForDistrict(string $district): array
    {
        if (in_array($district, self::ISLAND_DISTRICTS, true)) {
            return [
                'code' => 'ilhas',
                'label' => 'Estándar',
                'price' => self::ISLANDS_SHIPPING,
                'detail' => '5 a 10 días laborables (Baleares, Canarias, Ceuta y Melilla)',
            ];
        }

        return [
            'code' => 'continente',
            'label' => 'Estándar',
            'price' => self::MAINLAND_SHIPPING,
            'detail' => '2 a 5 días laborables (Península)',
        ];
    }

    public function show(string $token)
    {
        $order = Order::query()->where('token', $token)->firstOrFail();

        return response()->json($order->toStorefrontArray());
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'number' => ['required', 'string', 'max:40'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        $order = Order::query()
            ->where('number', ltrim($validated['number'], '#'))
            ->whereRaw('LOWER(email) = ?', [mb_strtolower($validated['email'])])
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'No hemos encontrado un pedido con esos datos.',
            ], 404);
        }

        return response()->json($order->toStorefrontArray());
    }

    public function index(Request $request)
    {
        $orders = $this->adminQuery($request)
            ->get()
            ->map(fn (Order $order) => $order->toAdminArray());

        return response()->json($orders);
    }

    /**
     * Fiche complete d'une commande, pour le back-office.
     */
    public function showAdmin(Order $order)
    {
        return response()->json($order->toAdminDetailArray());
    }

    /**
     * Export CSV des commandes, en respectant recherche et filtre courants.
     */
    public function export(Request $request): StreamedResponse
    {
        $query = $this->adminQuery($request);
        $filename = 'pedidos-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'wb');

            // BOM UTF-8 : sans lui Excel casse les accents et le ñ.
            fwrite($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, Order::csvHeader(), ';');

            $query->chunk(200, function ($orders) use ($handle) {
                foreach ($orders as $order) {
                    fputcsv($handle, $order->toCsvRow(), ';');
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Base commune a la liste et a l'export : recherche libre sur le
     * numero, l'email et le nom, plus un filtre de statut.
     */
    private function adminQuery(Request $request): Builder
    {
        $query = Order::query()->latest();

        $search = trim((string) $request->query('q', ''));

        if ($search !== '') {
            $term = '%'.mb_strtolower($search).'%';

            $query->where(function (Builder $sub) use ($term, $search) {
                $sub->where('number', 'like', '%'.ltrim($search, '#').'%')
                    ->orWhereRaw('LOWER(email) like ?', [$term])
                    ->orWhereRaw('LOWER(first_name) like ?', [$term])
                    ->orWhereRaw('LOWER(last_name) like ?', [$term]);
            });

            // "Juan Garcia" : chaque mot doit se retrouver dans le prenom
            // ou le nom. Evite un CONCAT, dont la syntaxe differe entre
            // MySQL et SQLite.
            $words = preg_split('/\s+/u', mb_strtolower($search), -1, PREG_SPLIT_NO_EMPTY);

            if (count($words) > 1) {
                $query->orWhere(function (Builder $sub) use ($words) {
                    foreach ($words as $word) {
                        $sub->where(function (Builder $part) use ($word) {
                            $part->whereRaw('LOWER(first_name) like ?', ['%'.$word.'%'])
                                ->orWhereRaw('LOWER(last_name) like ?', ['%'.$word.'%']);
                        });
                    }
                });
            }
        }

        $status = (string) $request->query('status', '');

        if ($status !== '' && array_key_exists($status, Order::STATUSES)) {
            $query->where('status', $status);
        }

        return $query;
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', array_keys(Order::STATUSES))],
        ]);

        $order->status = $validated['status'];
        $order->save();

        return response()->json($order->toAdminArray());
    }
}
