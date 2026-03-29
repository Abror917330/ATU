import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    addItem: (product: any, size?: string, color?: string) => void;
    removeItem: (id: string, size?: string, color?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
    total: () => number;
    clearCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            setIsOpen: (open) => set({ isOpen: open }),

            addItem: (product, size, color) => set((state) => {
                const productImg = Array.isArray(product.images)
                    ? product.images[0]
                    : (product.image || '');

                const existing = state.items.find(
                    i => i.id === product.id && i.size === size && i.color === color
                );

                if (existing) {
                    return {
                        items: state.items.map(i =>
                            i.id === product.id && i.size === size && i.color === color
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    };
                }

                return {
                    items: [...state.items, {
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        image: productImg,
                        quantity: 1,
                        size,
                        color,
                    }],
                    isOpen: true,
                };
            }),

            removeItem: (id, size, color) => set((state) => ({
                items: state.items.filter(
                    i => !(i.id === id && i.size === size && i.color === color)
                ),
            })),

            updateQuantity: (id, quantity, size, color) => set((state) => ({
                items: state.items
                    .map(i => i.id === id && i.size === size && i.color === color
                        ? { ...i, quantity: Math.max(0, quantity) }
                        : i
                    )
                    .filter(i => i.quantity > 0),
            })),

            total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
            clearCart: () => set({ items: [] }),
        }),
        { name: 'atu-cart' }
    )
);