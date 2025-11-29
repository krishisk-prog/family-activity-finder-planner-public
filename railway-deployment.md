# Railway Deployment Guide - Family Activity Finder

**Strategy:** Deploy both frontend and backend to Railway in a single project.

**Benefits:**
- ✅ Single platform (one dashboard, one bill)
- ✅ No CORS configuration needed (same domain)
- ✅ No timeout issues (persistent Express server)
- ✅ In-memory cache works perfectly
- ✅ No refactoring required

---

## Prerequisites

- [x] Code pushed to GitHub
- [ ] Railway account (free - includes $5/month credit)
- [ ] Anthropic API key ready

---

## Step 1: Create Railway Account (5 min)

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (easiest integration)
4. Authorize Railway to access your repositories
5. Verify email if prompted

**Expected Result:** You're in the Railway dashboard

---

## Step 2: Prepare Backend for Railway (10 min)

### 2a. Update Backend Package.json

Ensure `backend/package.json` has these scripts:

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/server.ts"
  }
}
```

### 2b. Update Backend Server for Production

Update `backend/src/server.ts` CORS configuration:

```typescript
// Update CORS to allow Railway domains
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL || 'https://*.railway.app',
        /\.railway\.app$/, // Allow all railway.app subdomains
      ]
    : true, // Allow all in development
  credentials: true,
};

app.use(cors(corsOptions));
```

### 2c. Ensure Port Configuration

In `backend/src/server.ts`, ensure port uses environment variable:

```typescript
const PORT = process.env.PORT || 3001;
```

**Note:** Railway automatically sets `PORT` environment variable.

### 2d. Commit Changes

```bash
git add backend/
git commit -m "Configure backend for Railway deployment"
git push origin main
```

---

## Step 3: Deploy Backend to Railway (15 min)

### 3a. Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `family-activity-finder-planner`
4. Railway detects it's a monorepo

### 3b. Configure Backend Service

1. Railway creates a service automatically
2. Click on the service card
3. Go to **"Settings"** tab
4. Set **Root Directory**: `backend`
5. Set **Build Command**: `npm install && npm run build`
6. Set **Start Command**: `npm start`

### 3c. Add Environment Variables

In the service dashboard, go to **"Variables"** tab:

Click **"New Variable"** for each:

```
ANTHROPIC_API_KEY = sk-ant-your-actual-key-here
NODE_ENV = production
HOST = 0.0.0.0
USE_HTTPS = false
```

**Important Notes:**
- Replace `sk-ant-...` with your actual Anthropic API key
- `USE_HTTPS = false` because Railway handles HTTPS at the edge
- `HOST = 0.0.0.0` allows Railway's internal networking to work

### 3d. Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Railway creates: `https://your-app-production-xxxx.up.railway.app`

### 3e. Deploy

Railway automatically deploys when you:
- Add environment variables
- Or click **"Deploy"** button

**Wait for deployment** (~2-3 minutes)

### 3f. Test Backend

Once deployed, test the health endpoint:

```
https://your-backend-url.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T...",
  "uptime": 123.45
}
```

**Save this URL!** You'll need it for the frontend.

---

## Step 4: Prepare Frontend for Railway (10 min)

### 4a. Add Serve Dependency

Update `client/package.json`:

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "npx serve -s dist -p $PORT"
  },
  "devDependencies": {
    // ... existing deps
  },
  "dependencies": {
    // ... existing deps
    "serve": "^14.2.1"
  }
}
```

### 4b. Install Serve

```bash
cd client
npm install serve --save
```

### 4c. Create Production Environment File

Create `client/.env.production`:

```env
# Replace with your actual Railway backend URL from Step 3f
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Important:** Replace with your actual backend URL!

### 4d. Update Frontend API Service (If Needed)

Ensure `client/src/services/api.ts` reads from environment:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### 4e. Test Build Locally

```bash
cd client
npm run build
npm run start
```

Visit `http://localhost:3000` to verify the build works.

### 4f. Commit Changes

```bash
git add client/
git commit -m "Configure frontend for Railway deployment with serve"
git push origin main
```

---

## Step 5: Deploy Frontend to Railway (10 min)

### 5a. Add Frontend Service

1. In Railway, **same project**, click **"New"** → **"GitHub Repo"**
2. Select: `family-activity-finder-planner` (same repo)
3. Railway creates a second service

### 5b. Configure Frontend Service

1. Click on the new service card
2. Go to **"Settings"** tab
3. Set **Root Directory**: `client`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm run start`

### 5c. Add Environment Variable

In **"Variables"** tab, add:

```
VITE_API_URL = https://your-backend-url.railway.app/api
```

**Important:** Use the backend URL from Step 3f!

### 5d. Configure Port (If Needed)

Railway should auto-detect the port from `$PORT` in your start command.

If needed, you can set:
```
PORT = 3000
```

### 5e. Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Railway creates: `https://your-frontend-production-yyyy.up.railway.app`

### 5f. Deploy

Railway automatically deploys.

**Wait for deployment** (~3-4 minutes for frontend build)

### 5g. Test Frontend

Visit your frontend URL:
```
https://your-frontend-url.railway.app
```

**Expected Result:** Your app loads and you can search for activities!

---

## Step 6: Update Backend CORS with Frontend URL (5 min)

Now that you have the frontend URL, update backend CORS:

### 6a. Update Backend Code

In `backend/src/server.ts`:

```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://your-frontend-url.railway.app', // Add your actual frontend URL
        /\.railway\.app$/, // Regex to allow all railway.app domains
      ]
    : true,
  credentials: true,
};
```

### 6b. Add Environment Variable to Backend

In Railway backend service, add variable:

```
FRONTEND_URL = https://your-frontend-url.railway.app
```

### 6c. Update CORS to Use Environment Variable

In `backend/src/server.ts`:

```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  /\.railway\.app$/,
].filter(Boolean);

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : true,
  credentials: true,
};
```

### 6d. Commit and Push

```bash
git add backend/
git commit -m "Update CORS with production frontend URL"
git push origin main
```

Railway auto-deploys! ✅

---

## Step 7: End-to-End Testing (10 min)

### Test Checklist

Visit your frontend URL and test:

- [ ] **Homepage loads** - No errors in console
- [ ] **Location auto-detection** - Works or falls back gracefully
- [ ] **Search form submission** - Can enter search criteria
- [ ] **Loading state** - Skeleton cards appear
- [ ] **Results display** - 20 activities show up
- [ ] **Activity cards** - All data displays correctly
- [ ] **Links work**:
  - [ ] Website links open
  - [ ] Google Maps links work
  - [ ] Apple Maps links work
- [ ] **Event type badges** - Display with correct colors
- [ ] **Mobile responsive** - Test on phone
- [ ] **Form collapse (mobile)** - "Modify Search" button works
- [ ] **LocalStorage** - Saved searches persist on refresh
- [ ] **Error handling** - Try with invalid data

### Test Backend Directly

Test backend endpoints:

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Search endpoint (use valid data)
curl -X POST https://your-backend-url.railway.app/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Seattle, WA",
    "kidsAges": "5, 8",
    "availability": "Saturday afternoon",
    "maxDistance": "20",
    "preferences": "outdoor"
  }'
```

---

## Step 8: Monitor and Optimize (Ongoing)

### Railway Dashboard Monitoring

1. **Metrics** - View CPU, Memory, Network usage
2. **Logs** - Check application logs for errors
3. **Deployments** - See deployment history

### Cost Monitoring

- Railway gives **$5 free credit per month**
- Monitor usage in **"Usage"** tab
- Your app should cost ~$2-3/month (well within free tier)

### Performance Optimization

If needed:
- Add Redis for shared cache (instead of in-memory)
- Scale up resources if traffic increases
- Add custom domain for better branding

---

## Troubleshooting

### Backend won't start

**Check:**
1. Environment variables are set correctly
2. `npm run build` completes successfully
3. `start` script exists in package.json
4. Logs in Railway dashboard for specific errors

### Frontend shows "Failed to fetch"

**Check:**
1. Backend is running (visit health endpoint)
2. `VITE_API_URL` is set correctly
3. CORS includes frontend URL
4. Network tab in browser DevTools for specific error

### CORS errors

**Check:**
1. Backend CORS config includes frontend URL
2. `FRONTEND_URL` environment variable is set
3. Try using regex: `/\.railway\.app$/` to allow all Railway domains

### Timeout errors on search

**Check:**
1. Anthropic API key is valid
2. Web search tool is enabled in Anthropic account
3. Check Railway logs for specific Claude API errors

---

## Next Steps After Deployment

### Optional Enhancements

1. **Custom Domain** - Add your own domain (e.g., familyactivities.com)
2. **Environment-based configs** - Different configs for staging/production
3. **Monitoring** - Add Sentry for error tracking
4. **Analytics** - Add Google Analytics or similar
5. **Performance** - Add Redis for distributed caching

### Custom Domain Setup

1. Purchase domain (Namecheap, Google Domains, etc.)
2. In Railway, go to service **"Settings"** → **"Networking"**
3. Click **"Custom Domain"**
4. Add your domain and update DNS records
5. Railway handles SSL certificate automatically

---

## Cost Estimates

### Railway Pricing (as of 2025)

- **Free Tier**: $5 credit per month
- **Hobby Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage

### Your Estimated Usage

**Backend (Node.js):**
- ~$1-2/month (depending on traffic)

**Frontend (Static site):**
- ~$0.50-1/month (mostly free)

**Total:** ~$1.50-3/month (well within $5 free credit)

---

## Success Criteria

✅ **Deployment Complete When:**

- [ ] Backend deployed and health check returns 200
- [ ] Frontend deployed and homepage loads
- [ ] Can perform full activity search end-to-end
- [ ] All links work (website, maps)
- [ ] Mobile responsive layout works
- [ ] LocalStorage persists searches
- [ ] No CORS errors in browser console
- [ ] Both services show "Active" in Railway dashboard

---

## Documentation

- **Railway Docs**: https://docs.railway.app/
- **Vite Production Build**: https://vitejs.dev/guide/build.html
- **Node.js on Railway**: https://docs.railway.app/guides/nodejs

---

## Support

If you encounter issues:
1. Check Railway logs first
2. Review this guide's troubleshooting section
3. Railway has excellent Discord support community
4. Railway docs are comprehensive

Good luck with your deployment! 🚀
