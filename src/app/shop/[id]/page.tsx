"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Check, ChevronLeft, ChevronRight, MessageCircle, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/../store/useCart';
import { useFavorites } from '@/../store/useFavorites';

const formatPrice = (price: number) =>
    new Intl.NumberFormat('ky-KG').format(price) + ' som';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
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
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (!error && data) setProduct(data);
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
                    <button
                        onClick={() => router.push('/shop')}
                        className="text-brand-gold font-black border-b-2 border-brand-gold pb-1"
                    >
                        ← DO'KONGA QAYTISH
                    </button>
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
            image: product.images?.[0] || '',
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            quantity: 1,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        cart.setIsOpen(true);
    };

    const handleDirectWhatsApp = () => {
        const msg = `Salom! ATU Shop dan so'rovim bor:\n\n` +
            `*Mahsulot:* ${product.name}\n` +
            `*Narx:* ${formatPrice(product.price)}\n` +
            `${selectedSize ? `*Razmer:* ${selectedSize}\n` : ''}` +
            `${selectedColor ? `*Rang:* ${selectedColor}\n` : ''}` +
            `Havola: ${window.location.href}`;
        window.open(`https://wa.me/996223555539?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-main-bg pb-32 pt-6">
            <div className="max-w-5xl mx-auto px-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand-gold transition-all mb-8 uppercase italic"
                >
                    <ArrowLeft size={18} /> Orqaga
                </button>

                <div className="grid md:grid-cols-2 gap-12">

                    {/* RASMLAR */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10">
                            {product.images?.[currentImage] ? (
                                <img
                                    src={product.images[currentImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag size={80} className="text-gray-200 dark:text-white/10" />
                                </div>
                            )}

                            {/* LIKE */}
                            <button
                                onClick={() => toggleShop(id as string)}
                                className="absolute top-5 right-5 z-10 w-12 h-12 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                                <Heart
                                    size={20}
                                    className={faved ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                                />
                            </button>

                            {/* PREV/NEXT */}
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.max(0, i - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage(i => Math.min(product.images.length - 1, i + 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                                    >
                                        <ChevronRight size={22} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* THUMBNAILS */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                                {product.images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImage(i)}
                                        className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === i
                                                ? 'border-brand-gold scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MA'LUMOTLAR */}
                    <div className="flex flex-col">
                        {product.is_new && (
                            <span className="inline-block bg-brand-gold text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-4 w-fit italic">
                                Yangi kolleksiya
                            </span>
                        )}

                        <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase italic tracking-tighter mb-4 leading-none">
                            {product.name}
                        </h1>

                        <p className="text-4xl font-black text-brand-gold mb-6 italic">
                            {formatPrice(product.price)}
                        </p>

                        {product.description && (
                            <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-3xl mb-6 border border-gray-100 dark:border-white/5">
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* RAZMERLAR */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Razmer tanlang
                                    {selectedSize && <span className="text-brand-gold ml-2">— {selectedSize}</span>}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[52px] h-12 rounded-2xl font-black text-sm transition-all border-2 ${selectedSize === size
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
                            <div className="mb-8">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Rang tanlang
                                    {selectedColor && <span className="text-brand-gold ml-2">— {selectedColor}</span>}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.colors.map((color: string) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all border-2 ${selectedColor === color
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

                        {/* OGOHLANTIRISH */}
                        {((product.sizes?.length > 0 && !selectedSize) || (product.colors?.length > 0 && !selectedColor)) && (
                            <p className="text-xs text-red-400 mb-4 font-bold">
                                * {product.sizes?.length > 0 && !selectedSize ? 'Razmer' : 'Rang'} tanlang
                            </p>
                        )}

                        {/* TUGMALAR */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={
                                    (product.sizes?.length > 0 && !selectedSize) ||
                                    (product.colors?.length > 0 && !selectedColor)
                                }
                                className={`h-16 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all ${added
                                        ? 'bg-green-500 text-white'
                                        : 'bg-brand-gold text-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-gold/20 disabled:opacity-30 disabled:scale-100'
                                    }`}
                            >
                                {added ? (
                                    <><Check size={24} /> Savatga qo'shildi!</>
                                ) : (
                                    <><ShoppingBag size={24} /> Savatga qo'shish</>
                                )}
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