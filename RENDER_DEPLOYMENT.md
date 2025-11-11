# 🚀 MindMate Deployment Guide for Render

This guide will help you deploy MindMate to Render.com, including both the backend API and frontend.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub (Render auto-deploys from Git)
3. **API Keys**:
   - Gemini API Key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - OpenAI API Key (from [OpenAI Platform](https://platform.openai.com/api-keys))
4. **PostgreSQL Database**: Render provides free PostgreSQL (optional, can use SQLite for testing)

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify files are in place**:
   - `backend/requirements.txt`
   - `backend/app/main.py`
   - `frontend/package.json`
   - `render.yaml` (optional, for Blueprint deployment)

### Step 2: Deploy Backend API

#### Option A: Using Render Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create services automatically
5. Add environment variables (see below)

#### Option B: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `mindmate-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
   - **Root Directory**: `backend` (optional, if your backend is in a subdirectory)

### Step 3: Configure Environment Variables

Add these environment variables in Render Dashboard → Your Service → Environment:

#### Required Variables:
```env
# API Keys (Mark as "Secret")
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=False

# Provider Selection
REFLECTION_PROVIDER=gemini  # or "openai"

# Model Configuration
GEMINI_MODEL=gemini-2.5-flash
OPENAI_MODEL=gpt-4o-mini
WHISPER_MODEL=whisper-1

# CORS (Update with your frontend URL after deployment)
CORS_ORIGINS=https://mindmate-frontend.onrender.com
```

#### Database Configuration:

**Option 1: Use Render PostgreSQL (Recommended for Production)**
1. Create a PostgreSQL database in Render Dashboard
2. Render automatically provides `DATABASE_URL` environment variable
3. No additional configuration needed

**Option 2: Use SQLite (For Testing)**
- Don't set `DATABASE_URL`
- The app will use SQLite (not recommended for production)

### Step 4: Deploy Frontend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `mindmate-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://your-backend-url.onrender.com`

### Step 5: Update CORS Settings

After frontend is deployed, update backend CORS:

1. Go to Backend Service → Environment
2. Update `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=https://mindmate-frontend.onrender.com
   ```
3. Restart the backend service

---

## 🔧 Configuration Details

### Backend Service Settings

- **Plan**: Starter (Free) or higher
- **Region**: Choose closest to your users
- **Health Check Path**: `/health`
- **Auto-Deploy**: Enable to auto-deploy on git push

### Frontend Service Settings

- **Plan**: Free (Static Sites are free)
- **Auto-Deploy**: Enable to auto-deploy on git push

### Database Settings (PostgreSQL)

- **Plan**: Starter (Free) - 90 days, then $7/month
- **Database Name**: `mindmate`
- **Auto-backup**: Enable for production

---

## 🐛 Troubleshooting

### Backend Issues

#### 1. Build Fails
- **Issue**: Dependencies fail to install
- **Solution**: 
  - Check `requirements.txt` syntax
  - Verify Python version (3.10+)
  - Check build logs for specific errors

#### 2. Service Won't Start
- **Issue**: Application crashes on startup
- **Solution**:
  - Check logs in Render Dashboard
  - Verify all environment variables are set
  - Ensure `DATABASE_URL` is correct (if using PostgreSQL)
  - Check that models load correctly (may take time on first start)

#### 3. Database Connection Errors
- **Issue**: Cannot connect to database
- **Solution**:
  - Verify `DATABASE_URL` is set correctly
  - Check database is running and accessible
  - Verify database credentials
  - For PostgreSQL, ensure `psycopg2-binary` is in requirements.txt

#### 4. Model Loading Takes Too Long
- **Issue**: Startup timeout
- **Solution**:
  - Increase timeout in start command: `--timeout 300`
  - Consider lazy loading models (load on first request)
  - Use smaller models for faster startup

#### 5. CORS Errors
- **Issue**: Frontend cannot connect to backend
- **Solution**:
  - Verify `CORS_ORIGINS` includes frontend URL
  - Check frontend `VITE_API_URL` matches backend URL
  - Ensure CORS middleware is configured correctly

### Frontend Issues

#### 1. Build Fails
- **Issue**: npm install or build fails
- **Solution**:
  - Check `package.json` syntax
  - Verify Node.js version (18+)
  - Check build logs for specific errors

#### 2. API Connection Errors
- **Issue**: Frontend cannot reach backend
- **Solution**:
  - Verify `VITE_API_URL` is correct
  - Check backend is running and accessible
  - Verify CORS is configured correctly
  - Check browser console for specific errors

#### 3. Environment Variables Not Working
- **Issue**: `VITE_API_URL` not being used
- **Solution**:
  - Vite env variables must start with `VITE_`
  - Rebuild frontend after changing env variables
  - Check that variables are set in Render Dashboard

---

## 📊 Monitoring

### Health Checks

- Backend health endpoint: `https://your-backend.onrender.com/health`
- Render automatically monitors this endpoint
- Service restarts if health check fails

### Logs

- View logs in Render Dashboard → Your Service → Logs
- Logs are streamed in real-time
- Useful for debugging issues

### Metrics

- Monitor CPU, memory, and request metrics in Render Dashboard
- Set up alerts for high usage
- Upgrade plan if needed

---

## 🔒 Security Best Practices

1. **API Keys**: Always mark API keys as "Secret" in Render
2. **CORS**: Restrict CORS origins to your frontend URL only
3. **Database**: Use strong passwords for database
4. **HTTPS**: Render provides HTTPS automatically
5. **Environment Variables**: Don't commit secrets to Git

---

## 💰 Cost Estimation

### Free Tier (Testing)
- **Backend**: Free (with limitations)
- **Frontend**: Free (Static Sites)
- **Database**: Free for 90 days, then $7/month

### Production (Recommended)
- **Backend**: $7/month (Starter plan)
- **Frontend**: Free (Static Sites)
- **Database**: $7/month (Starter plan)
- **Total**: ~$14/month

---

## 🚀 Post-Deployment

### 1. Test Your Deployment

1. **Backend**: Visit `https://your-backend.onrender.com/health`
2. **Frontend**: Visit `https://your-frontend.onrender.com`
3. **API Docs**: Visit `https://your-backend.onrender.com/docs`

### 2. Verify Features

- [ ] Create journal entry
- [ ] Emotion analysis works
- [ ] AI reflection generates
- [ ] Voice recording works (if implemented)
- [ ] Mood analytics display
- [ ] Provider switching works

### 3. Set Up Custom Domain (Optional)

1. Go to Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed
4. Update CORS origins if needed

---

## 📝 Environment Variables Reference

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key for reflections |
| `GEMINI_API_KEY` | Yes* | - | Gemini API key for reflections |
| `DATABASE_URL` | No | `sqlite:///./mindmate.db` | Database connection URL |
| `PORT` | Yes | `8000` | Server port (set by Render) |
| `HOST` | No | `0.0.0.0` | Server host |
| `DEBUG` | No | `False` | Debug mode |
| `REFLECTION_PROVIDER` | No | `gemini` | AI provider (gemini/openai) |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model name |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model name |
| `WHISPER_MODEL` | No | `whisper-1` | Whisper model name |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |

*At least one API key is required (Gemini or OpenAI)

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `http://localhost:8000` | Backend API URL |

---

## 🆘 Support

If you encounter issues:

1. Check Render logs for errors
2. Verify all environment variables are set
3. Test API endpoints using `/docs` endpoint
4. Check Render status page for outages
5. Review this guide for common issues

---

## 🎉 Success!

Once deployed, your MindMate application will be:
- ✅ Accessible worldwide via HTTPS
- ✅ Auto-deploying on git push
- ✅ Monitored and automatically restarted if needed
- ✅ Scalable and production-ready

Happy deploying! 🚀

