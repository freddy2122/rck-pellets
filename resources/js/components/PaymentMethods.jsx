function Badge({ label, className, children }) {
    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className={`inline-flex h-8 w-[52px] items-center justify-center overflow-hidden rounded-[4px] ${className}`}
        >
            {children}
        </span>
    );
}

function Amex() {
    return (
        <Badge label="American Express" className="bg-[#2E77BB]">
            <span className="text-[9px] font-black tracking-tight text-white">
                AMEX
            </span>
        </Badge>
    );
}

function ApplePay() {
    return (
        <Badge label="Apple Pay" className="border border-stone-300 bg-white">
            <svg viewBox="0 0 48 24" className="h-5 w-10" aria-hidden="true">
                <path
                    fill="#111"
                    d="M11.2 6.4c.5-1.3 1.5-2.2 2.4-2.6-.1 1.1.3 2.2 1.1 3-.8.5-1.8 1-2.8.9-.2-.4-.5-.8-.7-1.3zm2.6 1.3c1.6 0 3.7 2.2 3.7 5 0 3.4-2.5 6.3-3.7 6.3-1.1 0-1.5-.7-2.9-.7s-1.9.8-2.9.8C5.9 19.1 4 15.4 4 12.1 4 8.2 6.5 6.1 8.8 6.1c1.1 0 2 .7 2.7.7.6 0 1.6-.8 2.3-.8z"
                />
                <text
                    x="22"
                    y="16"
                    fill="#111"
                    fontSize="9"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    fontWeight="600"
                >
                    Pay
                </text>
            </svg>
        </Badge>
    );
}

function GooglePay() {
    return (
        <Badge label="Google Pay" className="border border-stone-300 bg-white">
            <span className="flex items-center gap-0.5 text-[10px] font-semibold">
                <span className="text-[#4285F4]">G</span>
                <span className="text-stone-600">Pay</span>
            </span>
        </Badge>
    );
}

export function Klarna() {
    return (
        <Badge label="Klarna" className="bg-[#FFB3C7]">
            <span className="text-[10px] font-bold tracking-tight text-stone-900">
                Klarna
            </span>
        </Badge>
    );
}

function Maestro() {
    return (
        <Badge label="Maestro" className="border border-stone-300 bg-white">
            <span className="relative h-5 w-8">
                <span className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-[#EB001B]" />
                <span className="absolute right-0 top-0.5 h-4 w-4 rounded-full bg-[#0099DF]" />
            </span>
        </Badge>
    );
}

export function Mastercard() {
    return (
        <Badge label="Mastercard" className="bg-[#111]">
            <span className="relative h-5 w-8">
                <span className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-[#EB001B]" />
                <span className="absolute right-0 top-0.5 h-4 w-4 rounded-full bg-[#F79E1B]" />
            </span>
        </Badge>
    );
}

export function Multibanco() {
    return (
        <Badge label="Multibanco" className="border border-stone-300 bg-white">
            <span className="flex flex-col items-center leading-none">
                <span className="text-[11px] font-black">
                    <span className="text-[#003399]">M</span>
                    <span className="text-stone-800">B</span>
                </span>
                <span className="text-[5px] font-bold tracking-widest text-stone-500">
                    MULTIBANCO
                </span>
            </span>
        </Badge>
    );
}

export function Visa() {
    return (
        <Badge label="Visa" className="bg-[#1A1F71]">
            <span className="text-[11px] font-black italic tracking-wide text-white">
                VISA
            </span>
        </Badge>
    );
}

const methods = [
    Amex,
    ApplePay,
    GooglePay,
    Klarna,
    Maestro,
    Mastercard,
    Multibanco,
    Visa,
];

export default function PaymentMethods() {
    return (
        <div className="border-t border-ink/10 bg-transparent">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Métodos de pago
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {methods.map((Method) => (
                        <Method key={Method.name} />
                    ))}
                </div>
            </div>
        </div>
    );
}
