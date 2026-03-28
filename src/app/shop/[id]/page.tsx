"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Check, ChevronLeft, ChevronRight, MessageCircle, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/../store/useCart';
import { useFavorites } from '@/../store/useFavorites';

// Narxni formatlash funksiyasi
const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    // Savatcha funksiyalarini olish
    const cart = useCart();
    const { toggleShop, isShopFaved } = useFavorites();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('shop_products')
            .select('*')
            .eq('id', id)
            .single();

        if (!error && data) {
            setProduct(data);
        }
        setLoading(false);
    };

    const faved = mounted && isShopFaved(id as string);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main-bg">
                <Loader2 className="animate-spin text-brand-gold" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main-bg">
                <div className="text-center">
                    <p className="text-gray-400 mb-4 font-bold uppercase italic">Mahsulot topilmadi</p>
                    <button onClick={() => router.push('/shop')} className="text-brand-gold font-black border-b-2 border-brand-gold pb-1">← DO'KONGA QAYTISH</button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (product.sizes?.length > 0 && !selectedSize) return;
        if (product.colors?.length > 0 && !selectedColor) return;

        cart.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            quantity: 1,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        cart.setIsOpen(true);
    };

    // WhatsApp orqali to'g'ridan-to'g'ri buyurtma berish
    const handleDirectWhatsApp = () => {
        const whatsappNumber = "996223555539";
        const msg = `Salom! ATU Shop dan ushbu mahsulot bo'yicha so'rovim bor:\n\n` +
            `🔥 *Mahsulot:* ${product.name}\n` +
            `💰 *Narx:* ${formatPrice(product.price)}\n` +
            `${selectedSize ? `📏 *Razmer:* ${selectedSize}\n` : ''}` +
            `${selectedColor ? `🎨 *Rang:* ${selectedColor}\n` : ''}` +
            `📍 Mahsulot havolasi: ${window.location.href}`;

        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-5xl mx-auto px-4">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand-gold transition-all mb-8 uppercase italic"
                >
                    <ArrowLeft size={18} /> Orqaga qaytish
                </button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* RASMLAR GALEREYASI */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl">
                            <img
                                src={product.images[currentImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700"
                            />

                            <button
                                onClick={() => toggleShop(id as string)}
                                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                                <Heart size={22} className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                            </button>

                            {product.images.length > 1 && (
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                    <button
                                        onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                                        className="w-10 h-10 bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto hover:bg-white dark:hover:bg-black transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))}
                                        className="w-10 h-10 bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto hover:bg-white dark:hover:bg-black transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                                {product.images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImage(i)}
                                        className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-brand-gold scale-105' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MAHSULOT MA'LUMOTLARI */}
                    <div className="flex flex-col justify-center">
                        {product.is_new && (
                            <span className="inline-block bg-brand-gold text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-4 w-fit italic">
                                Yangi kolleksiya
                            </span>
                        )}

                        <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase italic tracking-tighter mb-4 leading-none">
                            {product.name}
                        </h1>

                        <p className="text-4xl font-black text-brand-gold mb-8 italic">
                            {formatPrice(product.price)}
                        </p>

                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl mb-8 border border-white/5">
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* RAZMERLAR */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-8">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Razmerni tanlang</p>
                                <div className="flex gap-3 flex-wrap">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[56px] h-14 rounded-2xl font-black text-sm transition-all border-2 ${selectedSize === size
                                                ? 'bg-brand-gold border-brand-gold text-black scale-110 shadow-lg shadow-brand-gold/30'
                                                : 'bg-transparent dark:text-white border-gray-200 dark:border-white/10 hover:border-brand-gold'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* RANGLAR */}
                        {product.colors?.length > 0 && (
                            <div className="mb-10">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Rangni tanlang</p>
                                <div className="flex gap-3 flex-wrap">
                                    {product.colors.map((color: string) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-2 ${selectedColor === color
                                                ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/30'
                                                : 'bg-transparent dark:text-white border-gray-200 dark:border-white/10 hover:border-brand-gold'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TUGMALAR */}
                        <div className="grid grid-cols-1 gap-4 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={(product.sizes?.length > 0 && !selectedSize) || (product.colors?.length > 0 && !selectedColor)}
                                className={`h-16 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all ${added
                                    ? 'bg-green-500 text-white'
                                    : 'bg-brand-gold text-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-gold/20 disabled:opacity-30 disabled:grayscale disabled:scale-100'
                                    }`}
                            >
                                {added ? <><Check size={24} /> Savatga qo'shildi!</> : <><ShoppingBag size={24} /> Savatga qo'shish</>}
                            </button>

                            <button
                                onClick={handleDirectWhatsApp}
                                className="h-16 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 bg-[#25D366] text-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20"
                            >
                                <MessageCircle size={24} /> WhatsApp orqali so'rash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}