<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Public
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $articles = Article::query()
            ->published()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (Article $article) => $article->toListArray());

        return response()->json($articles);
    }

    public function show(string $slug)
    {
        $article = Article::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Deux autres guides, pour garder le lecteur sur le site.
        $related = Article::query()
            ->published()
            ->where('id', '!=', $article->id)
            ->orderByDesc('published_at')
            ->limit(2)
            ->get()
            ->map(fn (Article $other) => $other->toListArray());

        return response()->json([
            'article' => $article->toPublicArray(),
            'related' => $related,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Administration
    |--------------------------------------------------------------------------
    */

    public function adminIndex()
    {
        $articles = Article::query()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Article $article) => $article->toAdminArray());

        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $article = Article::query()->create($this->validated($request));

        return response()->json($article->toAdminArray(), 201);
    }

    public function update(Request $request, Article $article)
    {
        $article->update($this->validated($request, $article));

        return response()->json($article->fresh()->toAdminArray());
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json(['status' => 'deleted']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Article $article = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'slug' => [
                'nullable',
                'string',
                'max:180',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('articles', 'slug')->ignore($article?->id),
            ],
            'excerpt' => ['required', 'string', 'max:300'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'metaTitle' => ['nullable', 'string', 'max:180'],
            'metaDescription' => ['nullable', 'string', 'max:300'],
            'isPublished' => ['sometimes', 'boolean'],
            'publishedAt' => ['nullable', 'date'],
        ]);

        $published = (bool) ($data['isPublished'] ?? false);

        return [
            'title' => $data['title'],
            'slug' => ($data['slug'] ?? null) ?: Article::makeSlug($data['title']),
            'excerpt' => $data['excerpt'],
            'body' => $data['body'],
            'image' => $data['image'] ?? null,
            'meta_title' => $data['metaTitle'] ?? null,
            'meta_description' => $data['metaDescription'] ?? null,
            'is_published' => $published,
            // Publier sans date revient a publier maintenant.
            'published_at' => ($data['publishedAt'] ?? null)
                ?? $article?->published_at
                ?? ($published ? now() : null),
        ];
    }
}
