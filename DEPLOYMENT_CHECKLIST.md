# 🚀 MindMate Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## 📋 Pre-Deployment

### Code Preparation
- [ ] All code is committed to GitHub
- [ ] `backend/requirements.txt` includes all dependencies
- [ ] `backend/runtime.txt` specifies Python version (3.12.0)
- [ ] `frontend/package.json` is up to date
- [ ] Environment variables are documented
- [ ] `.env` files are NOT committed (use `.gitignore`)

### Backend Files
- [ ] `backend/app/main.py` has health check endpoint (`/health`)
- [ ] `backend/app/config.py` reads from environment variables
- [ ] `backend/app/database.py` supports PostgreSQL
- [ ] `backend/start.sh` is executable and configured
- [ ] CORS is configured for production origins

### Frontend Files
- [ ] `frontend/src/services/api.js` uses `VITE_API_URL`
- [ ] `frontend/vite.config.js` is configured for production
- [ ] Build command works locally: `npm run build`

### Documentation
- [ ] `RENDER_DEPLOYMENT.md` is reviewed
- [ ] `render.yaml` is configured (optional, for Blueprint)
- [ ] API keys are ready (Gemini and/or OpenAI)

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend

- [ ] Go to Render Dashboard → New → Web Service
- [ ] Connect GitHub repository
- [ ] Configure service:
  - [ ] Name: `mindmate-api`
  - [ ] Environment: `Python 3`
  - [ ] Build Command: `pip install -r backend/requirements.txt`
  - [ ] Start Command: `cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
  - [ ] Root Directory: (leave blank or set to `backend`)
- [ ] Set environment variables:
  - [ ] `OPENAI_API_KEY` (Secret)
  - [ ] `GEMINI_API_KEY` (Secret)
  - [ ] `REFLECTION_PROVIDER` (e.g., `gemini`)
  - [ ] `DEBUG` = `False`
  - [ ] `CORS_ORIGINS` = (leave as `*` for now, update after frontend deploy)
- [ ] Deploy and wait for build to complete
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`
- [ ] Test API docs: `https://your-backend.onrender.com/docs`

### Step 2: Set Up Database (Optional)

- [ ] Go to Render Dashboard → New → PostgreSQL
- [ ] Create database:
  - [ ] Name: `mindmate-db`
  - [ ] Plan: Starter (Free)
- [ ] Render automatically sets `DATABASE_URL` environment variable
- [ ] Link database to backend service (if not using `render.yaml`)

### Step 3: Deploy Frontend

- [ ] Go to Render Dashboard → New → Static Site
- [ ] Connect GitHub repository
- [ ] Configure service:
  - [ ] Name: `mindmate-frontend`
  - [ ] Build Command: `cd frontend && npm install && npm run build`
  - [ ] Publish Directory: `frontend/dist`
- [ ] Set environment variables:
  - [ ] `VITE_API_URL` = `https://your-backend.onrender.com`
- [ ] Deploy and wait for build to complete
- [ ] Test frontend: `https://your-frontend.onrender.com`

### Step 4: Update CORS

- [ ] Go to Backend Service → Environment
- [ ] Update `CORS_ORIGINS` to frontend URL:
  - [ ] `CORS_ORIGINS` = `https://your-frontend.onrender.com`
- [ ] Restart backend service
- [ ] Test frontend can connect to backend

---

## ✅ Post-Deployment Testing

### Backend Tests
- [ ] Health check: `GET /health` returns 200
- [ ] Root endpoint: `GET /` returns API info
- [ ] API docs: `GET /docs` loads Swagger UI
- [ ] Create journal entry: `POST /journal/create` works
- [ ] Emotion analysis: `POST /analysis/emotion-v2` works
- [ ] Reflection generation: `POST /analysis/reflect-v2` works
- [ ] Database: Journal entries are saved and retrieved

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] Can create journal entry
- [ ] Emotion analysis displays correctly
- [ ] AI reflection generates
- [ ] Journal history loads
- [ ] Mood analytics display
- [ ] Settings page works (provider switching)
- [ ] Voice recording works (if implemented)

### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] CORS errors are resolved
- [ ] API requests succeed
- [ ] Errors are handled gracefully
- [ ] Loading states work correctly

---

## 🔧 Troubleshooting

### Build Issues
- [ ] Check build logs for errors
- [ ] Verify all dependencies are in `requirements.txt`
- [ ] Check Python version matches `runtime.txt`
- [ ] Verify Node.js version (18+) for frontend

### Runtime Issues
- [ ] Check service logs for errors
- [ ] Verify environment variables are set
- [ ] Check database connection (if using PostgreSQL)
- [ ] Verify API keys are correct
- [ ] Check model loading (may take time on first start)

### Connection Issues
- [ ] Verify CORS origins are correct
- [ ] Check `VITE_API_URL` matches backend URL
- [ ] Test backend URL directly in browser
- [ ] Check firewall/network settings
- [ ] Verify HTTPS is working

---

## 📊 Monitoring

### Set Up Monitoring
- [ ] Enable health checks
- [ ] Set up log monitoring
- [ ] Configure alerts (optional)
- [ ] Monitor resource usage
- [ ] Set up error tracking (optional)

### Regular Checks
- [ ] Check service status weekly
- [ ] Review logs for errors
- [ ] Monitor API usage
- [ ] Check database size
- [ ] Review costs

---

## 🔒 Security

### Security Checklist
- [ ] API keys are marked as "Secret" in Render
- [ ] CORS origins are restricted to frontend URL
- [ ] Database credentials are secure
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Environment variables are not committed to Git
- [ ] Debug mode is disabled in production

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend is accessible and healthy
- ✅ Frontend loads and functions correctly
- ✅ All features work as expected
- ✅ No errors in logs
- ✅ API responses are fast (< 2 seconds)
- ✅ Database connections are stable
- ✅ CORS is properly configured

---

## 📝 Notes

### Important URLs
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-frontend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
- Health Check: `https://your-backend.onrender.com/health`

### Support Resources
- Render Documentation: https://render.com/docs
- Render Status: https://status.render.com
- Project Documentation: `RENDER_DEPLOYMENT.md`

---

**Last Updated**: [Date]
**Deployed By**: [Your Name]
**Deployment Date**: [Date]

