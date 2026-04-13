"use client";
import { Edit2, Trash2, Loader2, Package } from 'lucide-react';

export default function ProductList({ products = [], onEdit, onDelete, loading }: any) {
    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>;

    if (!products || products.length === 0) return <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"><p className="text-gray-500 font-bold uppercase text-sm">Маҳсулотлар топилмади</p></div>;

    return (
        <div className="grid gap-4">
            {products.map((p: any) => (
                <div key={p.id} className="bg-white dark:bg-[#0f0f0f] p-4 rounded-2xl border dark:border-white/5 flex items-center justify-between group hover:border-brand-gold/50 transition-all">
                    <div className="flex items-center gap-4">
                        <img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                        <div>
                            <span className="text-[10px] font-black text-brand-gold uppercase">{p.main_category}</span>
                            <h4 className="font-bold text-white text-base leading-tight">{p.name || p.sub_category}</h4>
                            <p className="text-sm font-black text-gray-400 mt-1">{Number(p.price).toLocaleString()} SOM</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(p.id)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => onDelete(p.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                </div>
            ))}
        </div>
    );
}