import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export default function Input({ icon, className = '', ...props }: InputProps) {
    return (
        <div className="relative w-full">
            <input
                className={`w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 outline-none font-bold text-sm dark:text-white border border-transparent focus:border-brand-gold/50 transition-all placeholder:font-normal ${icon ? 'pl-12' : ''} ${className}`}
                {...props}
            />
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
        </div>
    );
}