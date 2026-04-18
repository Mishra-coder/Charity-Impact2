#!/bin/bash

# GolfPro Vercel Deployment Script
# यह script deployment process को automate करता है

echo "🏌️ GolfPro Vercel Deployment Script"
echo "===================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI installed नहीं है"
    echo "📦 Install करने के लिए: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if user is logged in
echo "🔐 Vercel login status check कर रहे हैं..."
if ! vercel whoami &> /dev/null
then
    echo "❌ Vercel में login नहीं हैं"
    echo "🔑 Login करने के लिए: vercel login"
    exit 1
fi

echo "✅ Vercel में logged in हैं"
echo ""

# Ask for deployment type
echo "📋 Deployment type select करें:"
echo "1) Preview (testing के लिए)"
echo "2) Production (live deployment)"
read -p "Enter choice (1 or 2): " choice

echo ""

case $choice in
    1)
        echo "🚀 Preview deployment start कर रहे हैं..."
        vercel
        ;;
    2)
        echo "🚀 Production deployment start कर रहे हैं..."
        echo "⚠️  Warning: यह live production में deploy करेगा!"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            vercel --prod
        else
            echo "❌ Deployment cancelled"
            exit 0
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo "🌐 अपना app check करें Vercel dashboard में"
echo ""
echo "📊 Logs देखने के लिए:"
echo "   vercel logs [deployment-url]"
echo ""
echo "🔄 Rollback करने के लिए:"
echo "   Vercel Dashboard → Deployments → Select old deployment → Promote to Production"
