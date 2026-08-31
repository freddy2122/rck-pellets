<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json(
            ContactMessage::query()
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'] ?: 'Contacto',
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'] ?: '(sin comentario)',
        ]);

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data' => $contactMessage,
        ], 201);
    }

    public function update(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'is_read' => ['required', 'boolean'],
        ]);

        $contactMessage->update([
            'is_read' => $validated['is_read'],
        ]);

        return response()->json($contactMessage->fresh());
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message supprimé.',
        ]);
    }
}
