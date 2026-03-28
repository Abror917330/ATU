import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Savatdagi mahsulot strukturasi
interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string; // Savatda ko'rinadigan rasm
    images?: string[]; // Admin paneldan keladigan rasmlar massivi
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
                // Rasm formatini to'g'irlash (massiv bo'lsa birinchisini olamiz)
                const productImg = Array.isArray(product.images)
                    ? product.images[0]
                    : (product.image || product.image_url || '');

                // Bir xil ID, Size va Color bo'lgan mahsulotni qidiramiz
                const existingItem = state.items.find(
                    (item) =>
                        item.id === product.id &&
                        item.size === size &&
                        item.color === color
                );

                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id && item.size === size && item.color === color
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }

                // Yangi mahsulot qo'shish
                return {
                    items: [
                        ...state.items,
                        {
                            id: product.id,
                            name: product.name,
                            price: Number(product.price),
                            image: productImg, // Rasm shu yerda saqlanadi
                            quantity: 1,
                            size,
                            color,
                        },
                    ],
                    isOpen: true, // Qo'shilganda savatni ochish
                };
            }),

            removeItem: (id, size, color) => set((state) => ({
                items: state.items.filter(
                    (i) => !(i.id === id && i.size === size && i.color === color)
                ),
            })),

            updateQuantity: (id, quantity, size, color) => set((state) => ({
                items: state.items
                    .map((item) =>
                        item.id === id && item.size === size && item.color === color
                            ? { ...item, quantity: Math.max(0, quantity) }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
            })),

            total: () => {
                const { items } = get();
                return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'atu-cart-storage', // LocalStorage nomi
        }
    )
);