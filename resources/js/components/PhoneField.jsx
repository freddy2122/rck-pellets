import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, CircleHelp, Search } from 'lucide-react';
import {
    PHONE_COUNTRIES,
    findPhoneCountry,
    flagUrl,
} from '../lib/phoneCountries';

const inputClass =
    'peer w-full rounded-lg border border-[#d0d0d0] bg-white py-2 pl-[3.35rem] pr-10 pt-5 text-sm outline-none placeholder:text-transparent focus:border-[#1773b8] focus:ring-1 focus:ring-[#1773b8]';

export default function PhoneField({
    value,
    country = 'ES',
    onChange,
    onCountryChange,
    required,
}) {
    const rootRef = useRef(null);
    const selectedRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [help, setHelp] = useState(false);
    const [query, setQuery] = useState('');
    const selected = findPhoneCountry(country);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) {
            return PHONE_COUNTRIES;
        }

        return PHONE_COUNTRIES.filter(
            (item) =>
                item.name.toLowerCase().includes(needle) ||
                item.dial.includes(needle.replace(/^\+/, '')) ||
                item.iso.toLowerCase() === needle,
        );
    }, [query]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        selectedRef.current?.scrollIntoView({ block: 'nearest' });

        const handleClick = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
                setHelp(false);
            }
        };

        const handleKey = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                setHelp(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded px-0.5 py-1 hover:bg-[#f5f5f5]"
                aria-label="Seleccionar país del teléfono"
                aria-expanded={open}
                onClick={() => {
                    setOpen((current) => !current);
                    setHelp(false);
                    setQuery('');
                }}
            >
                <CountryFlag iso={selected.iso} />
                <ChevronDown
                    size={12}
                    className={`text-[#6d6d6d] transition ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <input
                name="phone"
                type="tel"
                required={required}
                value={value}
                onChange={onChange}
                placeholder="Teléfono"
                className={inputClass}
                autoComplete="tel"
                inputMode="tel"
            />
            <span className="pointer-events-none absolute left-[3.35rem] top-1.5 text-[11px] text-[#737373] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[11px]">
                Teléfono
            </span>
            <button
                type="button"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a]"
                aria-label="Información sobre el teléfono"
                onClick={() => {
                    setHelp((current) => !current);
                    setOpen(false);
                }}
            >
                <CircleHelp size={16} />
            </button>

            {help && (
                <p className="absolute right-0 top-[calc(100%+6px)] z-30 max-w-[220px] rounded-md bg-[#303030] px-3 py-2 text-xs leading-5 text-white shadow-lg">
                    En caso de que tengamos que contactarte sobre tu pedido
                </p>
            )}

            {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-lg border border-[#d0d0d0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:w-[320px]">
                    <label className="flex items-center gap-2 border-b border-[#eee] px-3 py-2">
                        <Search size={14} className="shrink-0 text-[#8a8a8a]" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="País"
                            className="w-full bg-transparent text-sm outline-none"
                            autoFocus
                        />
                    </label>
                    <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-3 text-sm text-[#6d6d6d]">
                                Sin resultados
                            </li>
                        ) : (
                            filtered.map((item) => {
                                const active = item.iso === selected.iso;

                                return (
                                    <li key={item.iso}>
                                        <button
                                            type="button"
                                            ref={active ? selectedRef : null}
                                            role="option"
                                            aria-selected={active}
                                            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[#f0f5ff] ${
                                                active ? 'bg-[#f0f5ff]' : ''
                                            }`}
                                            onClick={() => {
                                                onCountryChange(item.iso);
                                                setOpen(false);
                                                setQuery('');
                                            }}
                                        >
                                            <CountryFlag iso={item.iso} />
                                            <span className="flex-1">
                                                {item.name}
                                            </span>
                                            <span className="text-[#6d6d6d]">
                                                +{item.dial}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

function CountryFlag({ iso }) {
    return (
        <span className="inline-block h-[14px] w-[20px] overflow-hidden rounded-[2px] bg-[#e8e8e8] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]">
            <img
                src={flagUrl(iso, 40)}
                srcSet={`${flagUrl(iso, 80)} 2x`}
                alt=""
                width={20}
                height={14}
                className="h-full w-full object-cover"
                loading="lazy"
            />
        </span>
    );
}
