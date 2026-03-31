"use client";
import { Edit3, Trash2, Star, Image as ImageIcon } from 'lucide-react';

export default function ProductList({ products, onEdit, onDelete, onToggleQuick }: any) {
    const quickCount = products.filter((p: any) => p.is_quick_shop).length;

    return (
        <div className="mt-12 space-y-4">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-sm font-black uppercase text-gray-500 tracking-widest">Barcha mahsulotlar ({products.length})</h3>
                <span className="text-[10px] font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase">Bosh sahifada: {quickCount}/4</span>
            </div>

            {products.map((p: any) => (
                <div key={p.id} className="bg-white dark:bg-white/5 rounded-[2rem] p-4 border border-gray-100 dark:border-white/5 flex items-center gap-6 group hover:border-brand-gold/30 transition-all">
                    {/* Rasm */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/10 flex-shrink-0">
                        {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto text-gray-400 mt-6" />}
                    </div>

                    {/* Ma'lumot */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm uppercase truncate dark:text-white italic">{p.name}</h4>
                        <p className="text-brand-gold font-black text-xs">{Number(p.price).toLocaleString()} KGS</p>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">{p.category}</span>
                    </div>

                    {/* Harakatlar */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (!p.is_quick_shop && quickCount >= 4) {
                                    alert("Bosh sahifada joy qolmadi (maksimum 4 ta)!");
                                } else {
                                    onToggleQuick(p.id, !p.is_quick_shop);
                                }
                            }}
                            className={`p-3 rounded-xl transition-all ${p.is_quick_shop ? 'bg-brand-gold text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}
                        >
                            <Star size={18} fill={p.is_quick_shop ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => onEdit(p)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => onDelete(p.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                </div>
            ))}
        </div>
    );
}