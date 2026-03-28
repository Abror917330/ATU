import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
    shopIds: string[];
    creativeIds: string[];
    toggleShop: (id: string) => void;
    toggleCreative: (id: string) => void;
    isShopFaved: (id: string) => boolean;
    isCreativeFaved: (id: string) => boolean;
}

export const useFavorites = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            shopIds: [],
            creativeIds: [],
            toggleShop: (id) => set(state => ({
                shopIds: state.shopIds.includes(id)
                    ? state.shopIds.filter(i => i !== id)
                    : [...state.shopIds, id]
            })),
            toggleCreative: (id) => set(state => ({
                creativeIds: state.creativeIds.includes(id)
                    ? state.creativeIds.filter(i => i !== id)
                    : [...state.creativeIds, id]
            })),
            isShopFaved: (id) => get().shopIds.includes(id),
            isCreativeFaved: (id) => get().creativeIds.includes(id),
        }),
        { name: 'atu-favorites' }
    )
);