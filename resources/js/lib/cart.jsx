import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { productMainImage } from './format';

const STORAGE_KEY = 'rck_cart';
const NOTE_KEY = 'rck_cart_note';
const TOKEN_KEY = 'rck_cart_token';
const SYNC_DEBOUNCE_MS = 1500;
const CartContext = createContext(null);

/**
 * Identifiant de panier propre au navigateur. Il ne dit rien du visiteur :
 * tant qu'aucun email n'est saisi au checkout, le panier reste anonyme.
 */
function readToken() {
    try {
        let token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            token =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`.padEnd(
                          36,
                          '0',
                      ).slice(0, 36);
            localStorage.setItem(TOKEN_KEY, token);
        }

        return token;
    } catch {
        return null;
    }
}

function readCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function readNote() {
    try {
        return localStorage.getItem(NOTE_KEY) || '';
    } catch {
        return '';
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(() =>
        typeof window === 'undefined' ? [] : readCart(),
    );
    const [note, setNote] = useState(() =>
        typeof window === 'undefined' ? '' : readNote(),
    );
    const [lastAdded, setLastAdded] = useState(null);
    const [token] = useState(() =>
        typeof window === 'undefined' ? null : readToken(),
    );
    // Coordonnees saisies au checkout, pour rattacher un panier abandonne.
    const contactRef = useRef({});
    const syncedRef = useRef('');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    /**
     * Envoie l'etat du panier au serveur, avec un delai pour ne pas
     * declencher une requete a chaque clic sur "+".
     */
    useEffect(() => {
        if (!token) {
            return undefined;
        }

        const payload = JSON.stringify(
            items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
        );

        // Rien de nouveau, ou panier vide jamais rempli : on n'envoie rien.
        if (payload === syncedRef.current || (items.length === 0 && !syncedRef.current)) {
            return undefined;
        }

        const timer = setTimeout(() => {
            fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    token,
                    items: JSON.parse(payload),
                    ...contactRef.current,
                }),
            })
                .then(() => {
                    syncedRef.current = payload;
                })
                .catch(() => {});
        }, SYNC_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [items, token]);

    useEffect(() => {
        localStorage.setItem(NOTE_KEY, note);
    }, [note]);

    useEffect(() => {
        let cancelled = false;

        fetch('/api/products')
            .then((response) => response.json())
            .then((products) => {
                if (cancelled || !Array.isArray(products)) {
                    return;
                }

                setItems((current) => {
                    let changed = false;
                    const next = current.map((item) => {
                        const match = products.find(
                            (product) => product.id === item.id,
                        );

                        if (!match) {
                            return item;
                        }

                        const name = match.name;
                        const image =
                            productMainImage(match) || item.image || null;
                        const price = Number(match.price || item.price);

                        if (
                            item.name === name &&
                            item.image === image &&
                            Number(item.price) === price
                        ) {
                            return item;
                        }

                        changed = true;

                        return { ...item, name, image, price };
                    });

                    return changed ? next : current;
                });
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo(() => {
        const count = items.reduce(
            (total, item) => total + item.quantity,
            0,
        );

        const subtotal = items.reduce(
            (total, item) => total + Number(item.price || 0) * item.quantity,
            0,
        );

        const addItem = (product, quantity = 1) => {
            setItems((current) => {
                const existing = current.find(
                    (item) => item.id === product.id,
                );

                if (existing) {
                    return current.map((item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity: item.quantity + quantity,
                              }
                            : item,
                    );
                }

                return [
                    ...current,
                    {
                        id: product.id,
                        name: product.name,
                        price: Number(product.price || 0),
                        image: productMainImage(product) || product.image || null,
                        quantity,
                    },
                ];
            });

            setLastAdded({
                id: product.id,
                name: product.name,
                image: productMainImage(product) || product.image || null,
                quantity,
            });
        };

        const updateQuantity = (id, quantity) => {
            setItems((current) =>
                current
                    .map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item,
                    )
                    .filter((item) => item.quantity > 0),
            );
        };

        const removeItem = (id) => {
            setItems((current) =>
                current.filter((item) => item.id !== id),
            );
        };

        const clearCart = () => {
            setItems([]);
            setNote('');
        };

        /**
         * Rattache des coordonnees au panier. Appele au checkout des que le
         * client saisit son email, pour permettre une relance.
         */
        const identify = (contact) => {
            const next = {};

            ['email', 'firstName', 'lastName', 'phone'].forEach((key) => {
                if (contact?.[key]) {
                    next[key] = contact[key];
                }
            });

            if (Object.keys(next).length === 0 || !token) {
                return;
            }

            contactRef.current = { ...contactRef.current, ...next };

            fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    token,
                    items: items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                    ...contactRef.current,
                }),
            }).catch(() => {});
        };

        return {
            items,
            count,
            subtotal,
            token,
            identify,
            note,
            setNote,
            lastAdded,
            addItem,
            dismissAdded: () => setLastAdded(null),
            updateQuantity,
            removeItem,
            clearCart,
        };
    }, [items, note, lastAdded, token]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider.');
    }

    return context;
}
