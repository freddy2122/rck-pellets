<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@jardineslena.com');
        $password = env('ADMIN_PASSWORD', 'admin123456');
        $name = env('ADMIN_NAME', 'Administrador');

        $user = User::query()->firstOrNew([
            'email' => $email,
        ]);

        $user->name = $name;
        $user->password = $password;
        $user->email_verified_at = now();
        $user->phone = env('ADMIN_PHONE', '');
        $user->address = env('ADMIN_ADDRESS', '');
        $user->city = env('ADMIN_CITY', '');
        $user->province = env('ADMIN_PROVINCE', '');
        $user->country = env('ADMIN_COUNTRY', 'España');
        $user->save();
    }
}
