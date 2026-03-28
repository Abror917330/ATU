# 🌐 ATU Portal - i18n Quick Reference

## Installation
```bash
npm install next-intl
npm run dev
```

## File Structure
```
project-root/
├── middleware.ts                    # Locale detection
├── next.config.ts                   # next-intl plugin
├── src/
│   ├── i18n/
│   │   ├── routing.ts              # Locale config
│   │   └── request.ts              # Message loader
│   ├── app/
│   │   └── [locale]/               # Locale parameter
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── creative/
│   │       ├── shop/
│   │       ├── uzgen-youth/
│   │       └── settings/
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx          # ✅ Updated
│   │       └── BottomNav.tsx       # ✅ Updated
│   └── ...
└── messages/
    ├── uz.json                     # ✅ Uzbek
    ├── ru.json                     # ✅ Russian
    └── kg.json                     # ✅ Kyrgyz
```

## Usage Patterns

### Server Component
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
    const t = await getTranslations('nav');
    return <h1>{t('home')}</h1>;
}
```

### Client Component
```tsx
'use client';
import { useTranslations, useLocale } from 'next-intl';

export default function Component() {
    const t = useTranslations('nav');
    const locale = useLocale();
    return <a href={`/${locale}/shop`}>{t('shop')}</a>;
}
```

### Locale Switching
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
    const router = useRouter();
    const locale = useLocale();
    
    const handleSwitch = (lang: string) => {
        const path = pathname.replace(`/${locale}`, '');
        router.push(`/${lang}${path}`);
    };
    
    return (
        <button onClick={() => handleSwitch('ru')}>
            Русский
        </button>
    );
}
```

## Available Translations

### Navigation (`nav`)
- `home` → Асосий / Главная / Башы
- `creative` → Ижод / Творчество / Чыгармачылык
- `shop` → До'кон / Магазин / Дүкөн
- `uzgen` → Узгониялар / Узгенцы / Узгондор
- `courses` → Курслар / Курсы / Курстар

### Auth (`auth`)
- `login`, `register`, `logout`, `profile`, `email`, `password`, `welcome`

### Shop (`shop`)
- `title`, `products`, `cart`, `checkout`, `price`, `addCart`, `removeCart`, `total`, `empty`

### Sidebar (`sidebar`)
- `menu`, `settings`, `theme`, `language`, `dark`, `light`

### Home (`home`)
- `hero`, `subtitle`, `featured`

## URL Examples

```
/uz              → Home (Uzbek)
/ru/creative     → Creative (Russian)
/kg/shop         → Shop (Kyrgyz)
/uz/shop/123     → Product #123 (Uzbek)
```

## Configuration

### Supported Locales (`src/i18n/routing.ts`)
- `uz` (Uzbek) - Default
- `ru` (Russian)
- `kg` (Kyrgyz)

### Middleware Rules (`middleware.ts`)
- Intercepts all routes except: api, _next/static, _next/image, favicon.ico

## Components Already Updated

✅ **Navbar.tsx**
- Uses `useTranslations('nav')`
- Uses `useLocale()` for current language
- Language switcher in sidebar
- All links include locale prefix

✅ **BottomNav.tsx**
- Uses `useTranslations('nav')`
- Uses `useLocale()` for href generation
- Mobile navigation with translations

✅ **Layout.tsx** (`[locale]`)
- Wraps with `NextIntlClientProvider`
- Passes messages from server

## Common Errors & Fixes

### "Module not found: 'next-intl'"
```bash
npm install next-intl
rm -rf .next
npm run dev
```

### Locale not changing
- Ensure using `useRouter` from `'next/navigation'`
- Double-check `router.push()` includes locale prefix
- Verify `pathname` is correct from `usePathname()`

### 404 on locale prefix
- Middleware might not be loaded
- Check middleware.ts exists in project root (not src/)
- Verify next.config.ts includes `createNextIntlPlugin()`

### Wrong translations showing
- Check JSON syntax in message files
- Verify message key exists for that locale
- Clear `.next` folder and restart server

## Testing Locales Quick

```bash
# Terminal 1
npm run dev

# Terminal 2 - Run these curl commands
curl http://localhost:3000/uz
curl http://localhost:3000/ru
curl http://localhost:3000/kg

# Or just visit in browser:
# - http://localhost:3000/uz
# - http://localhost:3000/ru
# - http://localhost:3000/kg
```

## Adding New Translations

1. Open `messages/uz.json`, `messages/ru.json`, `messages/kg.json`
2. Add new key in the appropriate namespace:
```json
{
  "nav": {
    "newPage": "Yangi sahifa"
  }
}
```
3. Use in component:
```tsx
const t = useTranslations('nav');
<a>{t('newPage')}</a>
```

## Tips & Tricks

- Keep translation keys lowercase and camelCase
- Use namespaces (nav, auth, shop) to organize translations
- Test all 3 locales when adding features
- Use `useLocale()` to get current locale, not pathname
- Always include locale in `Link` and `router.push()` URLs

## Brand Colors (For Reference)
- Gold: `#D4AF37`
- Black: `#0A0A0A`
- Silver: `#F8F9FA`

---

**Remember**: After any middleware.ts or next.config.ts changes, restart the dev server!
