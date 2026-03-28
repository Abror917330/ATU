import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-black': '#0A0A0A',
                'brand-gold': '#D4AF37',
                'brand-silver': '#F8F9FA',
            },
        },
    },
    plugins: [],
};
export default config;
