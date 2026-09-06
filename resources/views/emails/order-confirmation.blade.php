@php
    $bank = \App\Models\SiteContent::bank();
    $iban = $bank['iban'];
    $bic = $bank['bic'];
    $holder = $bank['holder'];
    $payBy = $order->pay_by
        ? $order->pay_by->copy()->locale('es')->isoFormat('D [de] MMMM [de] YYYY')
        : null;
    $shippingPrice = (float) ($order->shipping['price'] ?? 0);
    $deliveryLabel = \Illuminate\Support\Str::ucfirst(
        $order->estimatedDelivery()->locale('es')->isoFormat('dddd D [de] MMMM'),
    );
    $trackUrl = $order->storeUrl().'seguir-pedido?n='.urlencode($order->number).'&email='.urlencode($order->email);
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido #{{ $order->number }} confirmado</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
            <td align="center" style="padding:28px 16px 48px;">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;">
                    <tr>
                        <td style="padding-bottom:28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-size:22px;font-weight:700;color:#111;">
                                        Jardines leña Shop
                                    </td>
                                    <td align="right" style="font-size:12px;letter-spacing:0.04em;color:#8a8a8a;text-transform:uppercase;">
                                        Pedido #{{ $order->number }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="font-size:28px;line-height:1.25;font-weight:700;padding-bottom:12px;">
                            ¡Gracias por tu pedido!
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:15px;line-height:1.6;color:#4d4d4d;padding-bottom:8px;">
                            Recibirás un e-mail de confirmación tras completar el pago.
                            Entrega estimada: <strong>{{ $deliveryLabel }}</strong>
                            (5 días laborables).
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:15px;line-height:1.6;color:#4d4d4d;padding-bottom:22px;">
                            @if ($order->payment === 'cajero')
                                Ingresa el importe en un cajero automático o en la
                                ventanilla de tu banco antes del
                                <strong>{{ $payBy }}</strong>, utilizando los datos
                                siguientes.
                            @else
                                Realiza el pago por transferencia SEPA antes del
                                <strong>{{ $payBy }}</strong>, utilizando los datos
                                siguientes.
                            @endif
                            Concepto: <strong>{{ $order->number }}</strong>.
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-bottom:28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="33%" valign="top" style="padding-right:8px;">
                                        <div style="font-size:12px;color:#6d6d6d;margin-bottom:4px;">IBAN</div>
                                        <div style="font-size:14px;font-weight:600;letter-spacing:0.02em;">{{ $iban }}</div>
                                    </td>
                                    <td width="33%" valign="top" style="padding-right:8px;">
                                        <div style="font-size:12px;color:#6d6d6d;margin-bottom:4px;">BIC / SWIFT</div>
                                        <div style="font-size:14px;font-weight:600;">{{ $bic }}</div>
                                    </td>
                                    <td width="33%" valign="top">
                                        <div style="font-size:12px;color:#6d6d6d;margin-bottom:4px;">Importe</div>
                                        <div style="font-size:14px;font-weight:600;">{{ \App\Models\Order::formatEuro($order->total) }}</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size:12px;color:#6d6d6d;margin-top:10px;">
                                Titular: {{ $holder }}
                                @if (!empty($bank['name']))
                                    · Banco: {{ $bank['name'] }}
                                @endif
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-bottom:18px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" style="padding-right:8px;">
                                        <a href="{{ $order->viewUrl() }}" style="display:block;background:#1773b8;color:#ffffff;text-decoration:none;text-align:center;padding:14px 12px;font-size:14px;font-weight:600;border-radius:4px;">
                                            Ver tu pedido
                                        </a>
                                    </td>
                                    <td width="50%" style="padding-left:8px;">
                                        <a href="{{ $trackUrl }}" style="display:block;background:#5a31f4;color:#ffffff;text-decoration:none;text-align:center;padding:14px 12px;font-size:14px;font-weight:600;border-radius:4px;">
                                            Seguir mi pedido
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom:36px;font-size:13px;color:#6d6d6d;">
                            o <a href="{{ $order->storeUrl() }}" style="color:#1773b8;font-weight:600;text-decoration:underline;">Visita nuestra tienda</a>
                        </td>
                    </tr>

                    <tr>
                        <td style="font-size:20px;font-weight:700;padding-bottom:18px;">
                            Resumen del pedido
                        </td>
                    </tr>
                    @foreach ($order->items as $item)
                        @php
                            $image = $order->absoluteImage($item['image'] ?? '/images/pellets.jpg');
                            $qty = (int) ($item['quantity'] ?? 1);
                            $line = ((float) ($item['price'] ?? 0)) * $qty;
                        @endphp
                        <tr>
                            <td style="padding-bottom:16px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="64" valign="top">
                                            <img src="{{ $image }}" alt="" width="56" height="56" style="display:block;width:56px;height:56px;object-fit:cover;border:1px solid #eee;border-radius:6px;">
                                        </td>
                                        <td valign="middle" style="padding-left:12px;font-size:14px;line-height:1.45;">
                                            {{ $item['name'] ?? 'Producto' }} × {{ $qty }}
                                        </td>
                                        <td width="90" align="right" valign="middle" style="font-size:14px;white-space:nowrap;">
                                            {{ \App\Models\Order::formatEuro($line) }}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endforeach

                    <tr>
                        <td style="padding-top:8px;border-top:1px solid #e6e6e6;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="right" style="padding-top:12px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:4px 24px 4px 0;color:#6d6d6d;font-size:14px;">Subtotal</td>
                                                <td align="right" style="padding:4px 0;font-size:14px;">{{ \App\Models\Order::formatEuro($order->subtotal) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 24px 4px 0;color:#6d6d6d;font-size:14px;">Envío</td>
                                                <td align="right" style="padding:4px 0;font-size:14px;">{{ \App\Models\Order::formatEuro($shippingPrice) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 24px 4px 0;color:#6d6d6d;font-size:14px;">Impuestos</td>
                                                <td align="right" style="padding:4px 0;font-size:14px;">{{ \App\Models\Order::formatEuro($order->tax) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:14px 24px 4px 0;font-size:16px;font-weight:700;">Total</td>
                                                <td align="right" style="padding:14px 0 4px;font-size:20px;font-weight:700;">{{ \App\Models\Order::formatEuro($order->total) }} EUR</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 24px 0 0;color:#6d6d6d;font-size:14px;">Total pagado hoy</td>
                                                <td align="right" style="padding:8px 0 0;font-size:14px;">0,00 € EUR</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="font-size:20px;font-weight:700;padding:36px 0 18px;">
                            Información del cliente
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" valign="top" style="padding-right:16px;">
                                        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Dirección de envío</div>
                                        <div style="font-size:14px;line-height:1.6;color:#4d4d4d;">
                                            {{ $order->fullName() }}<br>
                                            @if ($order->company){{ $order->company }}<br>@endif
                                            {{ $order->street }}<br>
                                            @if ($order->address2){{ $order->address2 }}<br>@endif
                                            {{ $order->city }}<br>
                                            {{ $order->postal_code }} {{ $order->city }}<br>
                                            {{ $order->country }}
                                        </div>
                                    </td>
                                    <td width="50%" valign="top">
                                        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Dirección de facturación</div>
                                        <div style="font-size:14px;line-height:1.6;color:#4d4d4d;">
                                            {{ $order->fullName() }}<br>
                                            @if ($order->company){{ $order->company }}<br>@endif
                                            {{ $order->street }}<br>
                                            @if ($order->address2){{ $order->address2 }}<br>@endif
                                            {{ $order->city }}<br>
                                            {{ $order->postal_code }} {{ $order->city }}<br>
                                            {{ $order->country }}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top:22px;">
                            <div style="font-size:14px;font-weight:700;margin-bottom:6px;">Pago</div>
                            <div style="font-size:14px;color:#4d4d4d;">{{ $order->paymentLabel() }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top:18px;">
                            <div style="font-size:14px;font-weight:700;margin-bottom:6px;">Método de envío</div>
                            <div style="font-size:14px;color:#4d4d4d;">{{ $order->shippingLabel() }}</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
