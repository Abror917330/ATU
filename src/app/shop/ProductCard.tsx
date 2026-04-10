import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
    const image = product.images?.[0] || 'https://via.placeholder.com/400?text=No+Image';

    return (
        <Link href={`/shop/${product.id}`} className="group bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border dark:border-white/5 flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-black/20">
                <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-brand-gold tracking-wider">{product.sub_category}</span>
                <h3 className="font-bold text-sm dark:text-white truncate">{product.name || product.sub_category}</h3>
                <p className="font-black text-lg text-black dark:text-white mt-1">
                    {Number(product.price).toLocaleString('ru-RU')} <span className="text-[10px] text-gray-400">СЎМ</span>
                </p>
            </div>
        </Link>
    );
}