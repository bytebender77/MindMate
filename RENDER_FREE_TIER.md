# 🆓 MindMate Free Tier Deployment on Render

This guide explains how to deploy MindMate on Render's **free tier** without any payment information.

## ✅ Free Tier Configuration

The `render.yaml` has been configured for Render's free tier:
- **Backend**: Free web service (no `plan` specified = free tier)
- **Frontend**: Free static site (always free)
- **Database**: SQLite (default, no additional service needed)

## 🎯 Free Tier Limitations

### Backend Service (Free Tier)
- **Resources**: 512MB RAM, 0.1 CPU
- **Spin-down**: Services spin down after 15 minutes of inactivity
- **Cold Start**: First request after spin-down takes 30-60 seconds
- **Instance Hours**: 750 free hours per month
- **Build Minutes**: 500 free build minutes per month
- **Bandwidth**: 100 GB outbound bandwidth per month

### Frontend (Static Site)
- **Always Free**: Static sites are completely free
- **Unlimited Bandwidth**: No bandwidth limits
- **No Spin-down**: Always available

### Database Options

#### Option 1: SQLite (Recommended for Free Tier)
- ✅ **Free**: No additional service needed
- ✅ **No Expiration**: Works indefinitely
- ✅ **Simple Setup**: Works out of the box
- ⚠️ **Data Persistence**: Data stored in service's file system
- ⚠️ **Data Loss Risk**: Data is lost if service is deleted

#### Option 2: Free PostgreSQL (30 Days)
- ✅ **Free for 30 Days**: 1 GB database
- ⚠️ **Expires**: Database expires after 30 days
- ⚠️ **Data Migration**: Need to migrate data before expiration
- ⚠️ **Requires Payment**: After 30 days, requires paid plan

## 🚀 Deployment Steps

### Step 1: Deploy with Blueprint

1. **Push code to GitHub**
2. **Go to Render Dashboard** → **New** → **Blueprint**
3. **Connect your repository**
4. **Render will detect `render.yaml`**
5. **No payment information required** ✅

### Step 2: Configure Environment Variables

After deployment, add these in Render Dashboard:

#### Backend Service Environment Variables:
- `OPENAI_API_KEY` (Secret) - If using OpenAI
- `GEMINI_API_KEY` (Secret) - If using Gemini
- `CORS_ORIGINS` - Your frontend URL (after frontend deploys)

#### Frontend Service Environment Variables:
- `VITE_API_URL` - Your backend URL (e.g., `https://mindmate-api.onrender.com`)

### Step 3: Database Setup

**For Free Tier (Recommended): Use SQLite**
- No setup needed!
- App automatically uses SQLite if `DATABASE_URL` is not set
- Data persists as long as the service exists

**Optional: Free PostgreSQL (30 Days)**
1. Go to Dashboard → **New** → **PostgreSQL**
2. Select **Free** tier
3. Link to `mindmate-api` service
4. `DATABASE_URL` will be automatically provided
5. ⚠️ **Remember**: Database expires after 30 days

## 📊 Free Tier Usage Tips

### Optimize for Free Tier

1. **Reduce Workers**: Already set to 1 worker (free tier friendly)
2. **Monitor Usage**: Check Render Dashboard for usage stats
3. **Optimize Builds**: Keep dependencies minimal
4. **Use SQLite**: Avoid PostgreSQL to stay completely free

### Handle Spin-down

Free tier services spin down after 15 minutes of inactivity:
- **First Request**: May take 30-60 seconds (cold start)
- **Subsequent Requests**: Fast (service is warm)
- **Keep Alive**: Services stay warm with regular traffic

### Monitor Limits

- **Instance Hours**: 750 hours/month (31.25 days)
- **Build Minutes**: 500 minutes/month
- **Bandwidth**: 100 GB/month
- **Check Dashboard**: Monitor usage in Render Dashboard

## 🔧 Configuration Details

### Backend Configuration
```yaml
# Free tier configuration
- type: web
  name: mindmate-api
  env: python
  # No plan = Free tier
  startCommand: gunicorn app.main:app --workers 1 ...
```

### Frontend Configuration
```yaml
# Static sites are always free
- type: web
  name: mindmate-frontend
  env: static
  # No plan needed for static sites
```

## ⚠️ Important Notes

### Free Tier Limitations
1. **Spin-down**: Services spin down after inactivity
2. **Cold Starts**: First request after spin-down is slow
3. **Resource Limits**: Limited RAM and CPU
4. **Usage Limits**: Instance hours, build minutes, bandwidth

### Data Persistence
- **SQLite**: Data stored in service file system
- **Backup**: Consider backing up data regularly
- **Migration**: Can migrate to PostgreSQL later if needed

### Scaling Considerations
- **Free Tier**: Suitable for testing and personal projects
- **Production**: Consider paid plans for production use
- **Upgrade**: Easy to upgrade to paid plans later

## 🎉 Success!

Your MindMate app is now deployed on Render's free tier:
- ✅ **No Payment Required**
- ✅ **Backend**: Free web service
- ✅ **Frontend**: Free static site
- ✅ **Database**: SQLite (free, no expiration)

## 📝 Next Steps

1. **Test Your Deployment**:
   - Backend: `https://your-backend.onrender.com/health`
   - Frontend: `https://your-frontend.onrender.com`

2. **Add Environment Variables**:
   - Add API keys in Render Dashboard
   - Set CORS origins after frontend deploys

3. **Monitor Usage**:
   - Check Render Dashboard for usage stats
   - Stay within free tier limits

4. **Enjoy Your Free Deployment!** 🚀

---

## 🔗 Additional Resources

- [Render Free Tier Documentation](https://render.com/free)
- [Render Free Tier Limits](https://render.com/docs/free-tier)
- [Render Pricing](https://render.com/pricing)

---

**Happy Free Deploying! 🆓🚀**

