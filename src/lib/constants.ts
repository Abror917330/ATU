// src/lib/constants.ts
export const DEFAULT_CATEGORIES: Record<string, string[]> = {
    "кухня": [],
    "универсал": [],
    "игрушка-ўйинчоқ": [],
    "авто продукт": ["чехол-тўшак", "запчасть", "насос", "авто аксессуар", "мойка", "бошқалар"],
    "для дом-уй учун": ["парта", "стул", "кресло", "декор", "гул", "свитилник", "люстра", "бошқалар"],
    "электроника": [],
    "техника": [],
    "сумка": ["кашёлок", "мактаб", "мужской", "женский", "барсетка", "бошқалар"],
    "барбер": [],
    "медицина": [],
    "кийим": [], // O'lcham logikasi uchun qo'shildi
    "оёқ кийим": [] // O'lcham logikasi uchun qo'shildi
};

export const SIZES_CLOTHES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
export const SIZES_SHOES = Array.from({ length: 13 }, (_, i) => (i + 36).toString()); // 36-48