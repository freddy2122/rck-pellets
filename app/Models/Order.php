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
            'mbway' => 'MB WAY',
            'transferencia' => 'Ingreso bancario',
            'cartao' => 'Tarjeta de crédito',
            'klarna' => 'Klarna',
            default => 'Multibanco',
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
