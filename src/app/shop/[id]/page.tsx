import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductClient from '@/components/shop/ProductClient';

export const revalidate = 0; // Har doim yangi ma'lumot olish uchun

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Supabase'dan mahsulotni olish
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    // Agar xato bo'lsa yoki mahsulot topilmasa 404 ga otadi
    if (error || !product) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-28 pb-20 bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* ORQAGA TUGMASI */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-brand-gold transition-colors group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Орқага қайтиш
                </Link>

                {/* CLIENT KOMPONENTI */}
                <ProductClient product={product} />
            </div>
        </main>
    );
}