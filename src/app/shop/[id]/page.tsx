import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck } from 'lucide-react';

// params endi Promise ekanligini bildiramiz
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    // 1. Params'ni await bilan kutib olamiz
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 2. Fetch qilishda endi to'g'ridan-to'g'ri tepadagi `id` ni ishlatamiz
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
            <Link href="/shop" className="text-xs font-bold text-gray-500 uppercase mb-6 inline-block hover:text-brand-gold transition-colors">← Орқага</Link>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="aspect-[4/5] md:aspect-square bg-gray-100 dark:bg-white/5 rounded-[2rem] overflow-hidden">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/800'} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-3">{product.main_category} / {product.sub_category}</p>
                        <h1 className="text-3xl sm:text-4xl font-black dark:text-white leading-tight">{product.name || product.sub_category}</h1>
                    </div>

                    <p className="text-4xl font-black dark:text-white">
                        {Number(product.price).toLocaleString('ru-RU')} <span className="text-sm text-gray-400">СЎМ</span>
                    </p>

                    {/* YANGI: Delivery Time */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border dark:border-white/5">
                        <Truck className="text-brand-gold" size={24} />
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Етказиб бериш</p>
                            <p className="font-bold text-sm dark:text-white">{product.delivery_time || '1-2 кун'}</p>
                        </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500 mb-3">Ўлчамлар (🟢)</p>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s: string) => (
                                    <span key={s} className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm dark:text-white shadow-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="w-full py-5 bg-brand-gold text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-gold/20 mt-4">
                        Харид қилиш
                    </button>
                </div>
            </div>
        </main>
    );
}