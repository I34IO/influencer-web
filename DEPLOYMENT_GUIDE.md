# Deployment Guide - SOLUTION FOR "No Next.js version detected"

## ⚠️ Issue: "No Next.js version detected"

This error occurs because your Next.js app is in a subdirectory (`influencer-app`), but the deployment platform is looking at the parent directory (`hack-the-gap`).

## ✅ SOLUTION

### Option 1: Set Root Directory in Vercel (RECOMMENDED)

1. **Go to Vercel Dashboard**
   - Open your project
   - Go to **Settings** → **General**

2. **Set Root Directory**
   - Find **"Root Directory"** setting
   - Click **"Edit"**
   - Enter: `influencer-app`
   - Click **"Save"**

3. **Redeploy**
   - Go to **Deployments**
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger deployment

### Option 2: Deploy from Subdirectory (CLI)

```bash
cd /Users/roane/roane/perso/hack-the-gap/influencer-app
vercel --prod
```

This deploys directly from the app directory.

### Option 3: Create vercel.json in Parent Directory

Create `/Users/roane/roane/perso/hack-the-gap/vercel.json`:

```json
{
  "buildCommand": "cd influencer-app && npm run build",
  "devCommand": "cd influencer-app && npm run dev",
  "installCommand": "cd influencer-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "influencer-app/.next",
  "rootDirectory": "influencer-app"
}
```

Then commit and push.

### For Netlify Deployment

1. **Create `netlify.toml` in the root** (`/Users/roane/roane/perso/hack-the-gap/netlify.toml`):
   ```toml
   [build]
     base = "influencer-app"
     command = "npm run build"
     publish = "influencer-app/.next"
   
   [build.environment]
     NEXT_PUBLIC_API_BASE_URL = "http://10.80.222.41:3000/api/public"
   ```

2. **Or set in Netlify UI**:
   - Base directory: `influencer-app`
   - Build command: `npm run build`
   - Publish directory: `influencer-app/.next`

### For Other Platforms

Set the following in your deployment configuration:
- **Root/Base Directory**: `influencer-app`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables

Don't forget to set your environment variables in the deployment platform:

```bash
NEXT_PUBLIC_API_BASE_URL=http://10.80.222.41:3000/api/public
```

### Vercel
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter: http://10.80.222.41:3000/api/public
```

### Netlify
Add in Site Settings → Environment Variables:
- Key: `NEXT_PUBLIC_API_BASE_URL`
- Value: `http://10.80.222.41:3000/api/public`

## Project Structure

```
/Users/roane/roane/perso/hack-the-gap/
├── package-lock.json          ← This is causing confusion!
├── influencer-app/            ← Your Next.js app is HERE
│   ├── package.json           ← This is the correct package.json
│   ├── next.config.ts
│   ├── src/
│   └── ...
└── mobile-app/
    └── ...
```

## Recommended: Clean Up Parent Directory

The `package-lock.json` in the parent directory is causing issues. You can either:

1. **Remove it** (if not needed):
   ```bash
   rm /Users/roane/roane/perso/hack-the-gap/package-lock.json
   ```

2. **Or ignore it** by setting Root Directory to `influencer-app` in deployment

## Vercel Deployment Steps

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from the app directory**:
   ```bash
   cd /Users/roane/roane/perso/hack-the-gap/influencer-app
   vercel
   ```

3. **Follow prompts**:
   - Set up and deploy? Yes
   - Which scope? (select your account)
   - Link to existing project? No (or Yes if you have one)
   - What's your project's name? influencer-tracker
   - In which directory is your code located? ./
   - Want to override settings? No

4. **Set environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Alternative: Deploy from Parent Directory

If you want to deploy from the parent directory, create `vercel.json`:

```json
{
  "buildCommand": "cd influencer-app && npm run build",
  "devCommand": "cd influencer-app && npm run dev",
  "installCommand": "cd influencer-app && npm install",
  "outputDirectory": "influencer-app/.next",
  "framework": "nextjs",
  "rootDirectory": "influencer-app"
}
```

## Docker Deployment

If using Docker, create `Dockerfile` in `influencer-app/`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NEXT_PUBLIC_API_BASE_URL=http://10.80.222.41:3000/api/public

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
cd influencer-app
docker build -t influencer-tracker .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://your-api-url influencer-tracker
```

## Troubleshooting

### Error: "No Next.js version detected"
✅ **Solution**: Set Root Directory to `influencer-app`

### Error: "Module not found"
✅ **Solution**: Make sure `npm install` runs in the correct directory

### Error: "Build failed"
✅ **Solution**: Test build locally first: `npm run build`

### Environment variables not working
✅ **Solution**: Make sure they're prefixed with `NEXT_PUBLIC_`

## Quick Fix Summary

**For Vercel:**
1. Project Settings → Root Directory → `influencer-app`
2. Redeploy

**For Netlify:**
1. Site Settings → Build & Deploy → Base directory → `influencer-app`
2. Redeploy

**For CLI deployment:**
```bash
cd influencer-app
vercel --prod
```

## Verification

After deployment, verify:
1. ✅ App loads successfully
2. ✅ API calls are working (check browser console)
3. ✅ Environment variables are set correctly
4. ✅ Theme and language switching works
5. ✅ Data displays correctly

## Support

If you still have issues:
1. Check deployment logs for specific errors
2. Verify Root Directory is set to `influencer-app`
3. Ensure environment variables are set
4. Test the build locally: `npm run build`
