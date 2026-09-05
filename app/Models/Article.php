<?php

namespace App\Models;

use App\Support\MerchantCatalog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    /** Vitesse de lecture retenue pour estimer la duree d'un article. */
    private const WORDS_PER_MINUTE = 200;

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'image',
        'meta_title',
        'meta_description',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Articles visibles du public : publies et dont la date est passee.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function url(): string
    {
        return rtrim((string) config('app.url'), '/').'/guias/'.$this->slug;
    }

    public function imageUrl(): ?string
    {
        return $this->image
            ? MerchantCatalog::absoluteUrl($this->image)
            : null;
    }

    public function metaTitle(): string
    {
        return $this->meta_title ?: $this->title;
    }

    public function metaDescription(): string
    {
        return Str::limit(
            $this->meta_description ?: $this->excerpt,
            158,
        );
    }

    public function readingMinutes(): int
    {
        $words = str_word_count(strip_tags((string) $this->body));

        return max(1, (int) ceil($words / self::WORDS_PER_MINUTE));
    }

    public static function makeSlug(string $title): string
    {
        return Str::slug($title);
    }

    /**
     * Version allegee pour la liste.
     */
    public function toListArray(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'image' => $this->image,
            'readingMinutes' => $this->readingMinutes(),
            'publishedAt' => optional($this->published_at)?->toIso8601String(),
        ];
    }

    public function toPublicArray(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'image' => $this->image,
            'readingMinutes' => $this->readingMinutes(),
            'publishedAt' => optional($this->published_at)?->toIso8601String(),
            'updatedAt' => optional($this->updated_at)?->toIso8601String(),
        ];
    }

    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'image' => $this->image,
            'metaTitle' => $this->meta_title,
            'metaDescription' => $this->meta_description,
            'isPublished' => (bool) $this->is_published,
            'publishedAt' => optional($this->published_at)?->toDateString(),
            'readingMinutes' => $this->readingMinutes(),
        ];
    }

    /**
     * Donnees structurees Article, pour l'affichage enrichi de Google.
     */
    public function structuredData(): array
    {
        $base = rtrim((string) config('app.url'), '/');

        $node = [
            '@type' => 'Article',
            'headline' => Str::limit($this->title, 110, ''),
            'description' => $this->metaDescription(),
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $this->url(),
            ],
            'datePublished' => optional($this->published_at)?->toIso8601String(),
            'dateModified' => optional($this->updated_at)?->toIso8601String(),
            'inLanguage' => 'es-ES',
            'publisher' => ['@id' => $base.'/#organization'],
            'author' => ['@id' => $base.'/#organization'],
        ];

        if ($this->imageUrl()) {
            $node['image'] = [$this->imageUrl()];
        }

        return $node;
    }
}
