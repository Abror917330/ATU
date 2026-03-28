export default function Footer() {
    return (
        // 'hidden md:block' -> mobil qurilmalarda yashiradi, noutbukda ko'rsatadi
        <footer className="hidden md:block w-full bg-brand-black text-white py-12 px-6 mt-auto border-t border-white/5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brend haqida */}
                <div>
                    <h3 className="text-brand-gold text-xl font-bold mb-4">ATU Brand</h3>
                    <p className="text-gray-400 text-sm italic">
                        San'at, she'riyat va zamonaviy uslub birlashgan portal.
                    </p>
                </div>

                {/* Tezkor havolalar */}
                <div>
                    <h4 className="font-semibold mb-4 text-brand-gold">Bo'limlar</h4>
                    <ul className="text-gray-400 space-y-2 text-sm">
                        <li className="hover:text-brand-gold cursor-pointer transition">Biz haqimizda</li>
                        <li className="hover:text-brand-gold cursor-pointer transition">Yetkazib berish</li>
                        <li className="hover:text-brand-gold cursor-pointer transition">Bog'lanish</li>
                    </ul>
                </div>

                {/* Ijtimoiy tarmoqlar */}
                <div>
                    <h4 className="font-semibold mb-4 text-brand-gold">Bizni kuzating</h4>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-brand-gold transition">Instagram</span>
                        <span className="cursor-pointer hover:text-brand-gold transition">Telegram</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-[10px] text-gray-500 uppercase tracking-widest">
                © {new Date().getFullYear()} ATU Portal. Barcha huquqlar himoyalangan.
            </div>
        </footer>
    );
}