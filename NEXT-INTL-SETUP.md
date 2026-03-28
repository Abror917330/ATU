# Next-Intl Setup Guide for ATU Portal

## ✅ Completed Files

### 1. Message Files Created
- ✅ `messages/uz.json` - Uzbek translations
- ✅ `messages/ru.json` - Russian translations
- ✅ `messages/kg.json` - Kyrgyz translations

### 2. i18n Configuration Files
- ✅ `src/i18n/routing.ts` - Route definitions and locale configuration
- ✅ `src/i18n/request.ts` - Server-side request configuration

### 3. Middleware & Config
- ✅ `middleware.ts` - Locale routing middleware
- ✅ `next.config.ts` - Updated with createNextIntlPlugin

### 4. App Structure
- ✅ `src/app/[locale]/` - New locale-parameterized layout structure
- ✅ `src/app/[locale]/layout.tsx` - Root layout with NextIntlClientProvider
- ✅ `src/app/[locale]/page.tsx` - Home page (moved)
- ✅ `src/app/[locale]/creative/page.tsx` - Creative page
- ✅ `src/app/[locale]/shop/page.tsx` - Shop page
- ✅ `src/app/[locale]/shop/[id]/page.tsx` - Product details page
- ✅ `src/app/[locale]/uzgen-youth/page.tsx` - Uzgen page
- ✅ `src/app/[locale]/settings/page.tsx` - Settings page
- ✅ `src/app/[locale]/globals.css` - Global styles

## 🔧 Installation Steps

### Step 1: Install next-intl Package
```bash
npm install next-intl
```

### Step 2: Update package.json (Already Contains Necessary Dependencies)
The project already has:
- next: 16.1.6 (supports App Router)
- next-themes: 0.4.6 (works with next-intl)

### Step 3: Manual Updates Needed

#### A. Navbar.tsx Component
Update `src/components/layout/Navbar.tsx` to use translations:

```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('nav');
    
    const navLinks = [
        { name: t('home'), href: `/${locale}`, id: '01' },
        { name: t('creative'), href: `/${locale}/creative`, id: '02' },
        { name: t('shop'), href: `/${locale}/shop`, id: '03' },
        { name: t('uzgen'), href: `/${locale}/uzgen-youth`, id: '04' },
        { name: t('courses'), href: `/${locale}/courses`, id: '05' },
    ];

    const languages = ['uz', 'ru', 'kg'];

    const handleLanguageSwitch = (lang: string) => {
        const currentPath = pathname.replace(`/${locale}`, '');
        router.push(`/${lang}${currentPath || ''}`);
    };
    
    // ... rest of component
}
```

#### B. BottomNav.tsx Component
Similar updates needed. Import and use translations for links and labels.

#### C. Update Providers (if using additional providers)
The current setup in `src/app/[locale]/layout.tsx` correctly wraps:
```tsx
<NextIntlClientProvider messages={messages}>
    <Providers>
        {/* Components */}
    </Providers>
</NextIntlClientProvider>
```

### Step 4: Clean Up Old Structure

Delete these directories/files (they've been moved to [locale]):
```bash
# Keep these for reference, but they're duplicated in [locale]
rm -rf src/app/creative
rm -rf src/app/shop
rm -rf src/app/uzgen-youth
rm -rf src/app/settings
rm src/app/page.tsx
rm src/app/globals.css
```

Keep `src/app/layout.tsx` only if you need a root layout that doesn't consume the locale parameter.

### Step 5: Environment Setup (Optional)
Add to `.env.local` if needed:
```bash
NEXT_PUBLIC_DEFAULT_LOCALE=uz
```

## 📝 Translation Structure

Each message file (uz.json, ru.json, kg.json) contains:
```json
{
  "nav": {
    "home": "...",
    "creative": "...",
    "shop": "...",
    "uzgen": "...",
    "courses": "..."
  },
  "auth": { ... },
  "shop": { ... },
  "sidebar": { ... },
  "home": { ... }
}
```

## 🚀 Usage in Components

### In Server Components:
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
    const t = await getTranslations('nav');
    return <h1>{t('home')}</h1>;
}
```

### In Client Components:
```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';

export default function Component() {
    const t = useTranslations('nav');
    const locale = useLocale();
    return <h1>{t('home')}</h1>;
}
```

## 🔗 URL Routing

With this setup, URLs will look like:
- `/uz` - Uzbek home
- `/ru/creative` - Russian creative page
- `/kg/shop/1` - Kyrgyz product #1
- `/uz` → automatically routes to `/uz` (default locale)

## ⚙️ Next Steps

1. **Run the install command**: `npm install next-intl`
2. **Update Navbar.tsx and BottomNav.tsx** with translations hook
3. **Test the setup**: `npm run dev`
4. **Test locale switching** in browser navigation
5. **Add more translations** as needed to the message files

## 🐛 Troubleshooting

### "Module not found" for next-intl
- Run: `npm install next-intl`
- Clear .next folder: `rm -rf .next`
- Restart dev server: `npm run dev`

### Locale not changing
- Ensure Navbar uses `useRouter` from 'next/navigation'
- Check middleware.ts is in project root
- Verify locales array in routing.ts matches language codes

### Translations not loading
- Check message files exist in `/messages` folder
- Verify JSON syntax in translation files
- Check i18n/request.ts imports correct locale

## 📚 Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Internationalization Best Practices](https://next-intl-docs.vercel.app/docs/getting-started/app-router-client-components)
