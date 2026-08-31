import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { productMainImage } from './format';

const STORAGE_KEY = 'rck_cart';
const NOTE_KEY = 'rck_cart_note';
const CartContext = createContext(null);

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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

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

        return {
            items,
            count,
            subtotal,
            note,
            setNote,
            lastAdded,
            addItem,
            dismissAdded: () => setLastAdded(null),
            updateQuantity,
            removeItem,
            clearCart,
        };
    }, [items, note, lastAdded]);

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
