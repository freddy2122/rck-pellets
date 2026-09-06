<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    public const STATUSES = [
        'pending_payment' => 'Pago pendiente',
        'paid' => 'Pago confirmado',
        'preparing' => 'En preparación',
        'shipped' => 'Enviado',
        'delivered' => 'Entregado',
        'cancelled' => 'Cancelado',
    ];

    protected $fillable = [
        'number',
        'token',
        'email',
        'first_name',
        'last_name',
        'phone',
        'company',
        'street',
        'address2',
        'postal_code',
        'city',
        'district',
        'country',
        'nif',
        'payment',
        'newsletter',
        'items',
        'shipping',
        'subtotal',
        'total',
        'tax',
        'status',
        'pay_by',
    ];

    protected $casts = [
        'items' => 'array',
        'shipping' => 'array',
        'newsletter' => 'boolean',
        'subtotal' => 'decimal:2',
        'total' => 'decimal:2',
        'tax' => 'decimal:2',
        'pay_by' => 'datetime',
    ];

    public static function makeToken(): string
    {
        return Str::lower(Str::random(40));
    }

    public function fullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function viewUrl(): string
    {
        return rtrim((string) config('app.url'), '/').'/encomenda/confirmacao/'.$this->token;
    }

    public function storeUrl(): string
    {
        return rtrim((string) config('app.url'), '/').'/';
    }

    public function paymentLabel(): string
    {
        return match ($this->payment) {
            'transferencia' => 'Transferencia bancaria',
            'cajero' => 'Ingreso en cajero automático',

            // Commandes anterieures au retrait des moyens de paiement
            // portugais, absents du marche espagnol. Conserves pour que
            // l'historique reste lisible dans le back-office.
            'multibanco' => 'Multibanco (retirado)',
            'mbway' => 'MB WAY (retirado)',

            default => 'Transferencia bancaria',
        };
    }

    public function shippingLabel(): string
    {
        return $this->shipping['label'] ?? 'Estándar';
    }

    public static function formatEuro(float|string|null $value): string
    {
        return number_format((float) $value, 2, ',', '.').' €';
    }

    public function absoluteImage(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return rtrim((string) config('app.url'), '/').'/'.ltrim($path, '/');
    }

    public function estimatedDelivery(): \Carbon\Carbon
    {
        $days = ($this->shipping['code'] ?? '') === 'ilhas' ? 10 : 5;

        return static::addBusinessDays($this->created_at ?? now(), $days);
    }

    public static function addBusinessDays(\Carbon\CarbonInterface $from, int $days): \Carbon\Carbon
    {
        $date = \Carbon\Carbon::parse($from)->startOfDay();
        $added = 0;

        while ($added < $days) {
            $date->addDay();

            if (! $date->isWeekend()) {
                $added++;
            }
        }

        return $date;
    }

    public function statusLabel(): string
    {
        return self::STATUSES[$this->status] ?? self::STATUSES['pending_payment'];
    }

    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'email' => $this->email,
            'name' => $this->fullName(),
            'city' => $this->city,
            'total' => (float) $this->total,
            'status' => $this->status,
            'statusLabel' => $this->statusLabel(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
        ];
    }

    /**
     * Fiche complete pour le back-office : tout ce qu'il faut pour
     * preparer, facturer et expedier la commande.
     */
    public function toAdminDetailArray(): array
    {
        $items = collect($this->items ?? [])
            ->map(fn (array $item) => [
                'id' => $item['id'] ?? null,
                'name' => $item['name'] ?? '',
                'price' => (float) ($item['price'] ?? 0),
                'quantity' => (int) ($item['quantity'] ?? 0),
                'image' => isset($item['image'])
                    ? $this->absoluteImage((string) $item['image'])
                    : null,
                'lineTotal' => round(
                    (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 0),
                    2,
                ),
            ])
            ->all();

        return [
            'id' => $this->id,
            'number' => $this->number,
            'status' => $this->status,
            'statusLabel' => $this->statusLabel(),
            'customer' => [
                'name' => $this->fullName(),
                'firstName' => $this->first_name,
                'lastName' => $this->last_name,
                'email' => $this->email,
                'phone' => $this->phone,
                'company' => $this->company,
                'nif' => $this->nif,
            ],
            'address' => [
                'street' => $this->street,
                'address2' => $this->address2,
                'postalCode' => $this->postal_code,
                'city' => $this->city,
                'district' => $this->district,
                'country' => $this->country,
            ],
            'items' => $items,
            'payment' => [
                'code' => $this->payment,
                'label' => $this->paymentLabel(),
                'payBy' => optional($this->pay_by)?->toIso8601String(),
            ],
            'shipping' => [
                'label' => $this->shippingLabel(),
                'price' => (float) ($this->shipping['price'] ?? 0),
                'detail' => $this->shipping['detail'] ?? null,
                'estimatedDelivery' => $this->estimatedDelivery()->toDateString(),
            ],
            'totals' => [
                'subtotal' => (float) $this->subtotal,
                'shipping' => (float) ($this->shipping['price'] ?? 0),
                'tax' => (float) $this->tax,
                'total' => (float) $this->total,
            ],
            'newsletter' => (bool) $this->newsletter,
            'trackingUrl' => $this->viewUrl(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
            'updatedAt' => optional($this->updated_at)?->toIso8601String(),
        ];
    }

    /**
     * @return list<string>
     */
    public static function csvHeader(): array
    {
        return [
            'Numero', 'Fecha', 'Estado', 'Nombre', 'Email', 'Telefono',
            'NIF', 'Empresa', 'Direccion', 'Codigo postal', 'Ciudad',
            'Provincia', 'Pais', 'Pago', 'Envio', 'Articulos',
            'Subtotal', 'Envio (EUR)', 'IVA', 'Total',
        ];
    }

    /**
     * @return list<string>
     */
    public function toCsvRow(): array
    {
        $items = collect($this->items ?? [])
            ->map(fn (array $i) => ($i['quantity'] ?? 0).' x '.($i['name'] ?? ''))
            ->implode(' | ');

        return [
            $this->number,
            optional($this->created_at)?->format('Y-m-d H:i') ?? '',
            $this->statusLabel(),
            $this->fullName(),
            $this->email,
            (string) $this->phone,
            (string) $this->nif,
            (string) $this->company,
            trim($this->street.' '.$this->address2),
            $this->postal_code,
            $this->city,
            $this->district,
            $this->country,
            $this->paymentLabel(),
            $this->shippingLabel(),
            $items,
            number_format((float) $this->subtotal, 2, '.', ''),
            number_format((float) ($this->shipping['price'] ?? 0), 2, '.', ''),
            number_format((float) $this->tax, 2, '.', ''),
            number_format((float) $this->total, 2, '.', ''),
        ];
    }

    public function toStorefrontArray(): array
    {
        $delivery = $this->estimatedDelivery();

        return [
            'id' => $this->number,
            'token' => $this->token,
            'email' => $this->email,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'phone' => $this->phone,
            'company' => $this->company,
            'street' => $this->street,
            'address2' => $this->address2,
            'postalCode' => $this->postal_code,
            'city' => $this->city,
            'district' => $this->district,
            'nif' => $this->nif,
            'payment' => $this->payment,
            'newsletter' => $this->newsletter,
            'items' => $this->items,
            'subtotal' => (float) $this->subtotal,
            'shipping' => $this->shipping,
            'total' => (float) $this->total,
            'tax' => (float) $this->tax,
            'status' => $this->status,
            'statusLabel' => $this->statusLabel(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
            'estimatedDelivery' => $delivery->toDateString(),
            'estimatedDeliveryLabel' => Str::ucfirst(
                $delivery->locale('es')->isoFormat('dddd D [de] MMMM'),
            ),
        ];
    }
}
