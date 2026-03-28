export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    sizes?: string[];
    colors?: string[];
    inStock: boolean;
    isNew?: boolean;
}

export const CATEGORIES = [
    { id: 'all', name: 'Barchasi' },
    { id: 'clothes', name: 'Kiyimlar' },
    { id: 'books', name: 'Kitoblar' },
    { id: 'accessories', name: 'Aksessuarlar' },
];

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'ATU Oversize T-shirt',
        description: 'ATU brendi ostida chiqarilgan maxsus oversize futbolka. Yumshoq va nafis material.',
        price: 1500,
        images: ['/products/tshirt-1.jpg', '/products/tshirt-2.jpg'],
        category: 'clothes',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Qora', 'Oq', 'Kulrang'],
        inStock: true,
        isNew: true,
    },
    {
        id: '2',
        name: 'ATU Hoodie',
        description: "Qishki mavsumga mo'ljallangan ATU brendli hoodie.",
        price: 2800,
        images: ['/products/hoodie-1.jpg'],
        category: 'clothes',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Qora', 'Jigarrang'],
        inStock: true,
    },
    {
        id: '3',
        name: "She'rlar to'plami",
        description: "Abdulloh Tohir Uzgoniyning eng sara she'rlari to'plami.",
        price: 500,
        images: ['/products/book-1.jpg'],
        category: 'books',
        inStock: true,
        isNew: true,
    },
    {
        id: '4',
        name: 'ATU Keychain',
        description: 'ATU logotipi tushirilgan kalit zanjiri.',
        price: 200,
        images: ['/products/keychain-1.jpg'],
        category: 'accessories',
        inStock: true,
    },
];

export const formatPrice = (price: number) =>
    new Intl.NumberFormat('ky-KG').format(price) + ' som';