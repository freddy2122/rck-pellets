<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    /**
     * Delai sans activite au-dela duquel un panier non converti est
     * considere comme abandonne.
     */
    public const ABANDONED_AFTER_MINUTES = 60;

    protected $fillable = [
        'token',
        'email',
        'first_name',
        'last_name',
        'phone',
        'items',
        'item_count',
        'subtotal',
        'status',
        'order_id',
        'last_activity_at',
    ];

    protected $casts = [
        'items' => 'array',
        'item_count' => 'integer',
        'subtotal' => 'decimal:2',
        'last_activity_at' => 'datetime',
    ];

    /**
     * Duree de conservation annoncee dans la politique de confidentialite.
     */
    public const RETENTION_DAYS = 90;

    /**
     * Supprime les paniers au-dela de la duree de conservation.
     *
     * @return int nombre de paniers supprimes
     */
    public static function purgeExpired(): int
    {
        return static::query()
            ->where('created_at', '<', now()->subDays(self::RETENTION_DAYS))
            ->delete();
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Paniers non convertis, non vides et inactifs depuis assez longtemps.
     */
    public function scopeAbandoned(Builder $query): Builder
    {
        return $query
            ->where('status', 'active')
            ->where('item_count', '>', 0)
            ->where(
                'last_activity_at',
                '<',
                now()->subMinutes(self::ABANDONED_AFTER_MINUTES),
            );
    }

    public function fullName(): ?string
    {
        $name = trim($this->first_name.' '.$this->last_name);

        return $name !== '' ? $name : null;
    }

    /**
     * Un panier n'est relançable que si le client a laisse un moyen de contact.
     */
    public function isContactable(): bool
    {
        return filled($this->email);
    }

    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->fullName(),
            'phone' => $this->phone,
            'items' => $this->items ?? [],
            'itemCount' => (int) $this->item_count,
            'subtotal' => (float) $this->subtotal,
            'contactable' => $this->isContactable(),
            'lastActivityAt' => optional($this->last_activity_at)?->toIso8601String(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
        ];
    }
}
