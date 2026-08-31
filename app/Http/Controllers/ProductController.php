<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::query()
                ->where('is_active', true)
                ->latest()
                ->get()
        );
    }

    public function adminIndex()
    {
        return response()->json(
            Product::query()
                ->latest()
                ->get()
        );
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'in:pellets,lenha,carbon'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sku' => ['nullable', 'string', 'max:64'],
            'brand' => ['nullable', 'string', 'max:100'],
            'gtin' => ['nullable', 'string', 'max:14'],
            'mpn' => ['nullable', 'string', 'max:64'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'primary_new_index' => ['nullable', 'integer', 'min:0'],
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? 'lenha',
            'sku' => ! empty($validated['sku']) ? $validated['sku'] : null,
            'brand' => ! empty($validated['brand']) ? $validated['brand'] : null,
            'gtin' => ! empty($validated['gtin']) ? $validated['gtin'] : null,
            'mpn' => ! empty($validated['mpn']) ? $validated['mpn'] : null,
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        $this->storeUploadedImages(
            $product,
            $this->uploadedFiles($request),
            (int) $request->input('primary_new_index', 0),
        );

        return response()->json([
            'message' => 'Produit créé avec succès.',
            'data' => $product->fresh(),
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['nullable', 'in:pellets,lenha,carbon'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sku' => ['nullable', 'string', 'max:64'],
            'brand' => ['nullable', 'string', 'max:100'],
            'gtin' => ['nullable', 'string', 'max:14'],
            'mpn' => ['nullable', 'string', 'max:64'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'delete_image_ids' => ['nullable', 'array'],
            'delete_image_ids.*' => ['integer'],
            'primary_image_id' => ['nullable', 'integer'],
            'primary_new_index' => ['nullable', 'integer', 'min:0'],
        ]);

        $product->update([
            'name' => $validated['name'] ?? $product->name,
            'category' => array_key_exists('category', $validated)
                ? ($validated['category'] ?: $product->category)
                : $product->category,
            'sku' => array_key_exists('sku', $validated) ? $validated['sku'] : $product->sku,
            'brand' => array_key_exists('brand', $validated) ? $validated['brand'] : $product->brand,
            'gtin' => array_key_exists('gtin', $validated) ? $validated['gtin'] : $product->gtin,
            'mpn' => array_key_exists('mpn', $validated) ? $validated['mpn'] : $product->mpn,
            'description' => array_key_exists('description', $validated)
                ? $validated['description']
                : $product->description,
            'price' => array_key_exists('price', $validated)
                ? $validated['price']
                : $product->price,
            'is_active' => $request->has('is_active')
                ? $request->boolean('is_active')
                : $product->is_active,
        ]);

        $deleteIds = collect($request->input('delete_image_ids', []))
            ->map(fn ($id) => (int) $id)
            ->all();

        if ($deleteIds) {
            $product->images()
                ->whereIn('id', $deleteIds)
                ->get()
                ->each(function (ProductImage $image) {
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                });
        }

        $newImages = $this->storeUploadedImages(
            $product,
            $this->uploadedFiles($request),
            null,
        );

        $this->setPrimaryImage(
            $product,
            $request->input('primary_image_id'),
            $request->input('primary_new_index'),
            $newImages,
        );

        return response()->json([
            'message' => 'Produit modifié avec succès.',
            'data' => $product->fresh(),
        ]);
    }

    public function destroy(Product $product)
    {
        $product->images->each(function (ProductImage $image) {
            Storage::disk('public')->delete($image->path);
        });

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.',
        ]);
    }

    /**
     * @return array<int, \Illuminate\Http\UploadedFile>
     */
    private function uploadedFiles(Request $request): array
    {
        $files = $request->file('images', []);

        if (! is_array($files)) {
            $files = $files ? [$files] : [];
        }

        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }

        return array_values(array_filter($files));
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>  $files
     * @return array<int, ProductImage>
     */
    private function storeUploadedImages(Product $product, array $files, ?int $primaryNewIndex): array
    {
        $created = [];
        $sort = (int) $product->images()->max('sort_order');

        foreach ($files as $index => $file) {
            $sort++;

            $created[] = $product->images()->create([
                'path' => $file->store('products', 'public'),
                'is_primary' => false,
                'sort_order' => $sort,
            ]);
        }

        if ($created === []) {
            $this->syncPrimaryColumn($product);

            return $created;
        }

        if ($primaryNewIndex !== null && isset($created[$primaryNewIndex])) {
            $this->markPrimary($product, $created[$primaryNewIndex]);
        } elseif (! $product->images()->where('is_primary', true)->exists()) {
            $this->markPrimary($product, $created[0]);
        } else {
            $this->syncPrimaryColumn($product);
        }

        return $created;
    }

    private function setPrimaryImage(
        Product $product,
        mixed $primaryImageId,
        mixed $primaryNewIndex,
        array $newImages,
    ): void {
        if ($primaryNewIndex !== null && $primaryNewIndex !== '' && isset($newImages[(int) $primaryNewIndex])) {
            $this->markPrimary($product, $newImages[(int) $primaryNewIndex]);

            return;
        }

        if ($primaryImageId) {
            $image = $product->images()->whereKey((int) $primaryImageId)->first();

            if ($image) {
                $this->markPrimary($product, $image);

                return;
            }
        }

        $current = $product->images()->where('is_primary', true)->first()
            ?: $product->images()->first();

        if ($current) {
            $this->markPrimary($product, $current);
        } else {
            $product->update(['image' => null]);
        }
    }

    private function markPrimary(Product $product, ProductImage $image): void
    {
        $product->images()->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);
        $product->update(['image' => $image->path]);
    }

    private function syncPrimaryColumn(Product $product): void
    {
        $primary = $product->images()->where('is_primary', true)->first()
            ?: $product->images()->first();

        if ($primary && ! $primary->is_primary) {
            $this->markPrimary($product, $primary);

            return;
        }

        $product->update(['image' => $primary?->path]);
    }
}
