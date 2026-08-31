<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'sku',
        'brand',
        'gtin',
        'mpn',
        'description',
        'image',
        'price',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $with = [
        'images',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class)
            ->orderByDesc('is_primary')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function skuCode(): string
    {
        return $this->sku ?: 'LCP-P-'.$this->id;
    }

    public function brandName(): string
    {
        return $this->brand ?: 'Jardines leña Shop';
    }

    public function isFirewood(): bool
    {
        return $this->category === 'lenha';
    }

    public function mpnCode(): string
    {
        return $this->mpn ?: $this->skuCode();
    }

    public function primaryImageUrl(): ?string
    {
        $image = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

        return $image?->url;
    }

    /**
     * @return list<string>
     */
    public function imageUrls(): array
    {
        return $this->images
            ->map(fn (ProductImage $image) => $image->url)
            ->filter()
            ->values()
            ->all();
    }
}
