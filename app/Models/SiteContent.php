<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    public const BANK_KEY = 'bank_details';

    public const CONTACT_KEY = 'contact_details';

    protected $fillable = [
        'key',
        'value',
    ];

    public static function defaultBank(): array
    {
        return [
            'holder' => 'Jardines Gerardo',
            'name' => '',
            'iban' => env('BANK_IBAN', ''),
            'bic' => env('BANK_BIC', ''),
        ];
    }

    public static function bank(): array
    {
        $defaults = self::defaultBank();
        $content = static::query()->where('key', self::BANK_KEY)->first();
        $stored = json_decode((string) ($content?->value ?? ''), true);

        if (! is_array($stored)) {
            return $defaults;
        }

        return [
            'holder' => trim((string) ($stored['holder'] ?? $defaults['holder'])) ?: $defaults['holder'],
            'name' => trim((string) ($stored['name'] ?? '')),
            'iban' => trim((string) ($stored['iban'] ?? $defaults['iban'])) ?: $defaults['iban'],
            'bic' => trim((string) ($stored['bic'] ?? $defaults['bic'])) ?: $defaults['bic'],
        ];
    }

    public static function defaultContact(): array
    {
        return [
            'email' => env('PUBLIC_CONTACT_EMAIL', env('MAIL_FROM_ADDRESS', '')),
            'phone' => '+34 696 10 20 70',
            'street' => 'Carretera C-155, 24',
            'postalCode' => '08213',
            'city' => 'Polinyà',
            'district' => 'Barcelona',
            'country' => 'España',
        ];
    }

    public static function contact(): array
    {
        $defaults = self::defaultContact();
        $content = static::query()->where('key', self::CONTACT_KEY)->first();
        $stored = json_decode((string) ($content?->value ?? ''), true);

        if (! is_array($stored)) {
            $stored = [];
        }

        $email = trim((string) ($stored['email'] ?? $defaults['email'])) ?: $defaults['email'];
        $phone = trim((string) ($stored['phone'] ?? $defaults['phone'])) ?: $defaults['phone'];

        return [
            'email' => $email,
            'phone' => $phone,
            'address' => [
                'street' => trim((string) ($stored['street'] ?? $defaults['street'])) ?: $defaults['street'],
                'postalCode' => trim((string) ($stored['postalCode'] ?? $defaults['postalCode'])) ?: $defaults['postalCode'],
                'city' => trim((string) ($stored['city'] ?? $defaults['city'])) ?: $defaults['city'],
                'district' => trim((string) ($stored['district'] ?? $defaults['district'])) ?: $defaults['district'],
                'country' => trim((string) ($stored['country'] ?? $defaults['country'])) ?: $defaults['country'],
            ],
        ];
    }

    public static function phoneDigits(?string $phone = null): string
    {
        $digits = preg_replace('/\D+/', '', $phone ?? self::contact()['phone']) ?? '';

        if (strlen($digits) === 9 && ! str_starts_with($digits, '34')) {
            return '34'.$digits;
        }

        return $digits;
    }

    public static function fullAddress(?array $address = null): string
    {
        $address ??= self::contact()['address'];

        return trim(sprintf(
            '%s, %s %s, %s, %s',
            $address['street'] ?? '',
            $address['postalCode'] ?? '',
            $address['city'] ?? '',
            $address['district'] ?? '',
            $address['country'] ?? '',
        ));
    }
}
