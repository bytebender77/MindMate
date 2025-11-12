# 🚀 MindMate Manual Deployment on Render (No Payment Required)

If Render Blueprints require payment information, you can deploy manually **without payment info** by creating services individually through the Render Dashboard.

## ✅ Manual Deployment (No Payment Required)

### 🔒 Private Repository?
If your GitHub repository is private, see **[PRIVATE_REPO_DEPLOY.md](PRIVATE_REPO_DEPLOY.md)** for setup instructions. Render needs access to private repositories via GitHub App.

### Why Manual Deployment?
- **No Payment Info**: Manual deployment doesn't require payment verification
- **Free Tier**: You can select free tier for each service individually
- **More Control**: You have full control over each service configuration

## 🎯 Step-by-Step Manual Deployment

### Step 1: Deploy Backend (Free Tier)

1. **Go to Render Dashboard** → **New** → **Web Service**

2. **Connect Repository**:
   - Connect your GitHub repository
   - **Note**: If repository is private, Render will prompt you to install GitHub App
   - Install Render GitHub App and grant access to your repository (see [PRIVATE_REPO_DEPLOY.md](PRIVATE_REPO_DEPLOY.md))
   - Select the branch (usually `main` or `master`)

3. **Configure Service**:
   - **Name**: `mindmate-api`
   - **Environment**: `Python 3`
   - **Region**: Choose any region (free tier available in all regions)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
   - ⚠️ **Note**: When Root Directory is set to `backend`, you DON'T need `cd backend` in commands

4. **Select Free Tier**:
   - **Instance Type**: Select **Free** (not Starter or other paid plans)
   - You should see "Free" option with 512MB RAM, 0.1 CPU

5. **Add Environment Variables**:
   - `PYTHON_VERSION` = `3.12.0`
   - `DEBUG` = `False`
   - `REFLECTION_PROVIDER` = `gemini`
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `WHISPER_MODEL` = `whisper-1`
   - `OPENAI_API_KEY` = (your OpenAI key - mark as Secret)
   - `GEMINI_API_KEY` = (your Gemini key - mark as Secret)
   - `CORS_ORIGINS` = (leave blank for now, update after frontend deploys)
   - `USE_LIGHT_MODEL` = `true` ⚠️ **Recommended for free tier** (uses lighter model to save memory)

6. **Create Web Service**:
   - Click **Create Web Service**
   - Wait for deployment to complete
   - Note your backend URL: `https://mindmate-api.onrender.com`

### Step 2: Deploy Frontend (Free Static Site)

1. **Go to Render Dashboard** → **New** → **Static Site**

2. **Connect Repository**:
   - Connect your GitHub repository
   - **Note**: If repository is private, ensure Render GitHub App has access
   - Select the branch (usually `main` or `master`)
   - **See [PRIVATE_REPO_DEPLOY.md](PRIVATE_REPO_DEPLOY.md) for private repository setup**

3. **Configure Static Site**:
   - **Name**: `mindmate-frontend`
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend` (leave blank if frontend is in root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. **Add Environment Variables**:
   - `VITE_API_URL` = `https://mindmate-api.onrender.com` (your backend URL from Step 1)
   - `NODE_VERSION` = `20.17.0` (optional)

5. **Create Static Site**:
   - Click **Create Static Site**
   - Static sites are **always free** - no payment required
   - Wait for deployment to complete
   - Note your frontend URL: `https://mindmate-frontend.onrender.com`

### Step 3: Update CORS Settings

1. **Go to Backend Service** → **Environment**

2. **Update CORS_ORIGINS**:
   - Add: `https://mindmate-frontend.onrender.com`
   - Or use: `https://mindmate-frontend.onrender.com,http://localhost:3000` (for local testing)

3. **Save Changes**:
   - Render will automatically redeploy with new settings

### Step 4: Database Setup (Optional - SQLite Recommended)

**Option 1: Use SQLite (Recommended - No Setup Needed)**
- ✅ No additional service needed
- ✅ Works out of the box
- ✅ No expiration
- ✅ Completely free
- The app will use SQLite if `DATABASE_URL` is not set

**Option 2: Free PostgreSQL (30 Days)**
1. Go to Dashboard → **New** → **PostgreSQL**
2. Select **Free** tier
3. Name: `mindmate-db`
4. Link to `mindmate-api` service
5. `DATABASE_URL` will be automatically provided
6. ⚠️ **Note**: Free PostgreSQL expires after 30 days

## ✅ Verification

### Test Backend
1. Visit: `https://mindmate-api.onrender.com/health`
2. Should return: `{"status": "healthy", ...}`

### Test Frontend
1. Visit: `https://mindmate-frontend.onrender.com`
2. Should load the MindMate application
3. Try creating a journal entry to test API connection

### Test API Connection
1. Open browser console on frontend
2. Create a journal entry
3. Check for any CORS or API errors
4. Verify data is saved (check backend logs)

## 🎯 Free Tier Configuration

### Backend (Free Tier)
- **Instance Type**: Free
- **RAM**: 512MB
- **CPU**: 0.1 CPU
- **Spin-down**: 15 minutes of inactivity
- **Cold Start**: 30-60 seconds after spin-down

### Frontend (Static Site)
- **Always Free**: No limits
- **No Spin-down**: Always available
- **Unlimited Bandwidth**: No bandwidth limits

### Database (SQLite)
- **Free**: No additional service
- **No Expiration**: Works indefinitely
- **Data Storage**: In service file system

## 📊 Free Tier Limits

- **Instance Hours**: 750 hours/month (31.25 days)
- **Build Minutes**: 500 minutes/month
- **Bandwidth**: 100 GB/month (backend only)
- **Static Sites**: Unlimited bandwidth

## 🐛 Troubleshooting

### ❌ Common Error: "cd: backend: No such file or directory"

**Problem**: Start command fails with directory error.

**Solution**: 
1. Go to Render Dashboard → Your Service → Settings
2. Set **Root Directory** to: `backend`
3. Update **Build Command** to: `pip install -r requirements.txt`
4. Update **Start Command** to: `gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
5. Save changes - Render will redeploy automatically

**See [RENDER_FIX_START_COMMAND.md](RENDER_FIX_START_COMMAND.md) for detailed fix instructions**

### Backend Issues

**Out of Memory Error**:
- ❌ **Error**: `Out of memory (used over 512Mi)`
- ✅ **Solution**: See [RENDER_MEMORY_OPTIMIZATION.md](RENDER_MEMORY_OPTIMIZATION.md)
- **Quick Fix**: Set `USE_LIGHT_MODEL=true` environment variable
- **Alternative**: Model now uses lazy loading (loads on first request, not at startup)
- This reduces startup memory from ~500MB to ~300MB

**Service Won't Start**:
- Check build logs for errors
- Verify all dependencies are in `requirements.txt`
- Check Python version matches (3.12.0)
- Verify environment variables are set
- **Verify Root Directory is set to `backend`**
- **Check memory usage** - free tier has 512MB limit

**Cold Start Delay**:
- Normal for free tier (30-60 seconds after spin-down)
- Service stays warm with regular traffic
- Consider using a keep-alive service (external) if needed

**Database Errors**:
- Verify SQLite is working (default)
- Check database file permissions
- Review database logs in Render Dashboard

### Frontend Issues

**Build Fails - Terser Not Found**:
- ❌ **Error**: `terser not found. Since Vite v3, terser has become an optional dependency`
- ✅ **Solution**: See [RENDER_FIX_FRONTEND_BUILD.md](RENDER_FIX_FRONTEND_BUILD.md)
- **Quick Fix**: Update `vite.config.js` to use `minify: 'esbuild'` instead of `minify: 'terser'`
- This is already fixed in the latest version of the code

**Build Fails (Other Errors)**:
- Check build logs for errors
- Verify `package.json` is correct
- Check Node.js version
- Verify all dependencies are installed

**API Connection Errors**:
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running
- Check browser console for errors

### CORS Issues

**CORS Errors**:
- Update `CORS_ORIGINS` in backend environment variables
- Include frontend URL: `https://mindmate-frontend.onrender.com`
- Restart backend service after updating CORS
- Check browser console for specific error messages

## 💡 Tips for Free Tier

1. **Use SQLite**: No additional database service needed
2. **Monitor Usage**: Check Render Dashboard for usage stats
3. **Optimize Builds**: Keep dependencies minimal
4. **Handle Spin-down**: First request after inactivity is slow (normal)
5. **Stay Within Limits**: Monitor instance hours and bandwidth

## 🎉 Success!

Your MindMate app is now deployed on Render's free tier:
- ✅ **Backend**: Free web service
- ✅ **Frontend**: Free static site
- ✅ **Database**: SQLite (free, no expiration)
- ✅ **No Payment Required**: Everything is free!

## 📝 Next Steps

1. **Test Your Deployment**:
   - Backend: `https://mindmate-api.onrender.com/health`
   - Frontend: `https://mindmate-frontend.onrender.com`

2. **Add Environment Variables**:
   - Add API keys in Render Dashboard
   - Set CORS origins

3. **Monitor Usage**:
   - Check Render Dashboard for usage stats
   - Stay within free tier limits

4. **Enjoy Your Free Deployment!** 🚀

---

## 🔗 Alternative: Skip Blueprint

If Blueprints require payment info, **skip the Blueprint** and deploy manually:
1. Don't use the Blueprint feature
2. Create services individually through Dashboard
3. Select **Free** tier for each service
4. No payment information required!

---

**Happy Free Deploying! 🆓🚀**

