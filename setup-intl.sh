#!/bin/bash

# ATU Portal - next-intl Setup Script
# This script helps complete the next-intl setup

echo "================================"
echo "ATU Portal - next-intl Setup"
echo "================================"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing next-intl..."
npm install next-intl

echo ""
echo "✅ Installation complete!"
echo ""

# Step 2: Show summary
echo "📋 Setup Summary:"
echo "================="
echo ""
echo "✅ COMPLETED:"
echo "  • messages/uz.json - Uzbek translations"
echo "  • messages/ru.json - Russian translations"
echo "  • messages/kg.json - Kyrgyz translations"
echo "  • src/i18n/routing.ts - Route configuration"
echo "  • src/i18n/request.ts - Request configuration"
echo "  • middleware.ts - Locale middleware"
echo "  • next.config.ts - Plugin integration"
echo "  • src/app/[locale]/ - New app structure"
echo "  • src/app/[locale]/layout.tsx - Root layout"
echo "  • All page.tsx files moved to [locale]"
echo "  • src/components/layout/BottomNav.tsx - Updated with i18n"
echo ""

echo "⚠️  REMAINING TASKS:"
echo "  1. Update src/components/layout/Navbar.tsx:"
echo "     - Import useTranslations, useLocale from 'next-intl'"
echo "     - Import useRouter from 'next/navigation'"
echo "     - Update navLinks array to use t() function"
echo "     - Update language switching logic to use router.push"
echo "     - Update Link hrefs to include locale prefix"
echo ""
echo "  2. (Optional) Delete old app structure:"
echo "     rm -rf src/app/creative"
echo "     rm -rf src/app/shop"
echo "     rm -rf src/app/uzgen-youth"
echo "     rm -rf src/app/settings"
echo "     rm src/app/page.tsx"
echo "     rm src/app/globals.css"
echo ""
echo "  3. Test the setup:"
echo "     npm run dev"
echo ""
echo "  4. Test locale switching by visiting:"
echo "     http://localhost:3000/uz"
echo "     http://localhost:3000/ru"
echo "     http://localhost:3000/kg"
echo ""

echo "================================"
echo "For detailed instructions, see:"
echo "NEXT-INTL-SETUP.md"
echo "================================"
