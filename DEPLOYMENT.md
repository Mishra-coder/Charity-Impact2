# Vercel Deployment Guide - GolfPro Platform

यह guide आपको frontend और backend दोनों को Vercel पर deploy करने में मदद करेगी।

## Prerequisites

1. Vercel account (https://vercel.com)
2. Vercel CLI installed (optional but recommended)
3. Git repository (GitHub, GitLab, या Bitbucket)
4. Supabase project setup with credentials

## Step 1: Vercel CLI Install करें (Optional)

```bash
npm install -g vercel
```

## Step 2: Environment Variables Setup

### Backend Environment Variables
Vercel dashboard में ये environment variables add करें:

```
PORT=5001
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
```

## Step 3: Deployment Methods

### Method 1: Vercel Dashboard से Deploy (Recommended)

1. **Vercel Dashboard खोलें**: https://vercel.com/dashboard
2. **New Project** पर click करें
3. **Import Git Repository** select करें
4. अपना repository select करें
5. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty - vercel.json handles this)
   - Output Directory: (leave empty - vercel.json handles this)
6. **Environment Variables** add करें (ऊपर दिए गए)
7. **Deploy** button पर click करें

### Method 2: Vercel CLI से Deploy

```bash
# Project root directory में जाएं
cd /path/to/your/project

# Vercel login करें
vercel login

# Deploy करें
vercel

# Production deploy के लिए
vercel --prod
```

## Step 4: Environment Variables Add करना

### Vercel Dashboard में:
1. Project Settings → Environment Variables
2. सभी variables add करें (backend और frontend दोनों के लिए)
3. Environment select करें: Production, Preview, Development
4. Save करें

### Vercel CLI से:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add JWT_SECRET
# ... बाकी variables
```

## Step 5: Deployment Verify करें

Deploy होने के बाद:

1. **Frontend Check करें**: 
   - https://your-app.vercel.app पर जाएं
   - Login/Register page दिखना चाहिए

2. **Backend API Check करें**:
   ```bash
   curl https://your-app.vercel.app/api/charities
   ```

3. **Logs देखें**:
   - Vercel Dashboard → Project → Deployments → Latest → View Function Logs

## Project Structure

```
.
├── backend/
│   ├── server.js          # Main backend entry point
│   ├── package.json
│   ├── routes/
│   ├── middleware/
│   └── config/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── vercel.json            # Vercel configuration
└── DEPLOYMENT.md          # This file
```

## Vercel Configuration Explained

`vercel.json` file में:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"           // Backend को Node.js serverless function के रूप में deploy करता है
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",  // Frontend को static site के रूप में build करता है
      "config": {
        "distDir": "build"            // React build output directory
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"    // सभी /api/* requests backend को route करता है
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"          // बाकी सब frontend को route करता है
    }
  ]
}
```

## Common Issues और Solutions

### Issue 1: Environment Variables नहीं मिल रहे
**Solution**: 
- Vercel dashboard में सभी variables properly add करें
- Redeploy करें

### Issue 2: API calls fail हो रहे हैं
**Solution**:
- `REACT_APP_API_URL` में correct Vercel URL set करें
- CORS settings check करें backend में

### Issue 3: Build fail हो रहा है
**Solution**:
- Local में `npm run build` test करें
- Dependencies properly install हैं check करें
- Build logs देखें Vercel dashboard में

### Issue 4: 404 errors on page refresh
**Solution**:
- React Router के लिए rewrites already configured हैं
- अगर issue है तो `vercel.json` में routes check करें

## Post-Deployment Steps

1. **Custom Domain Setup** (Optional):
   - Vercel Dashboard → Project → Settings → Domains
   - अपना domain add करें

2. **SSL Certificate**:
   - Vercel automatically SSL provide करता है
   - कुछ करने की जरूरत नहीं

3. **Monitoring Setup**:
   - Vercel Analytics enable करें
   - Error tracking setup करें

4. **Database Connection Verify करें**:
   - Supabase dashboard में connection logs check करें
   - Test API endpoints

## Continuous Deployment

Vercel automatically deploy करता है जब आप:
- Main branch में push करते हैं (Production)
- अन्य branches में push करते हैं (Preview)

## Rollback करना

अगर कोई issue है:
1. Vercel Dashboard → Deployments
2. पुराना working deployment select करें
3. "Promote to Production" click करें

## Support और Resources

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Project Issues: GitHub Issues

## Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

---

**Note**: पहली बार deploy करने में 5-10 minutes लग सकते हैं। Patience रखें!

**Important**: Production में deploy करने से पहले सभी environment variables properly set करें।
