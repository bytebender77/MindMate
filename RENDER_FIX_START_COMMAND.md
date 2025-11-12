# 🔧 Fix: Render Start Command Error

## ❌ Error Message

```
bash: line 1: cd: backend: No such file or directory
==> Exited with status 1
```

## 🎯 Problem

The start command is trying to `cd backend` but the directory doesn't exist in the current working directory. This happens when the **Root Directory** setting in Render doesn't match the command paths.

## ✅ Solution

You have **two options** to fix this:

### Option 1: Set Root Directory to `backend` (Recommended)

This is the **simplest and recommended** approach:

1. **Go to Render Dashboard** → Your Service → **Settings**
2. **Find "Root Directory"** section
3. **Set Root Directory to**: `backend`
4. **Update Build Command** to: `pip install -r requirements.txt`
5. **Update Start Command** to: `gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
6. **Save Changes** - Render will automatically redeploy

**Why this works:**
- Root Directory = `backend` means Render's working directory is already in `backend/`
- No need to `cd backend` in commands
- Build command uses `requirements.txt` (not `backend/requirements.txt`)
- Start command uses `app.main:app` directly

### Option 2: Keep Root Directory as Repository Root

If you want to keep Root Directory as repository root (blank or `/`):

1. **Go to Render Dashboard** → Your Service → **Settings**
2. **Set Root Directory to**: (blank or leave as repository root)
3. **Update Build Command** to: `pip install -r backend/requirements.txt`
4. **Update Start Command** to: `cd backend && gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
5. **Save Changes** - Render will automatically redeploy

**Why this might not work:**
- Some Render configurations might not preserve the directory structure
- The `cd backend` might fail if the directory structure changes during deployment

## 🎯 Recommended Configuration (Option 1)

### Backend Service Settings:

```
Name: mindmate-api
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120
```

### Why Option 1 is Better:

✅ **Simpler commands** - No `cd` needed
✅ **More reliable** - Less chance of path issues
✅ **Cleaner configuration** - Easier to understand
✅ **Standard practice** - Common pattern for monorepos

## 🔍 How to Check Your Current Configuration

1. **Go to Render Dashboard** → Your Service
2. **Click "Settings"** tab
3. **Find "Root Directory"** - Check what it's set to
4. **Find "Build Command"** - Check the command
5. **Find "Start Command"** - Check the command

## ✅ Verification Steps

After updating the configuration:

1. **Wait for redeploy** - Render will automatically redeploy
2. **Check build logs** - Should show successful build
3. **Check start logs** - Should show service starting
4. **Test endpoint** - Visit `https://your-service.onrender.com/health`
5. **Verify response** - Should return `{"status": "healthy", ...}`

## 🐛 If Still Not Working

### Check Build Logs:

Look for errors like:
- `No such file or directory`
- `Module not found`
- `Import error`

### Check Start Logs:

Look for errors like:
- `cd: backend: No such file or directory`
- `gunicorn: command not found`
- `ModuleNotFoundError`

### Common Issues:

1. **Root Directory not set correctly**:
   - Verify it's set to `backend` (not `./backend` or `/backend`)

2. **Requirements.txt not found**:
   - Verify `backend/requirements.txt` exists
   - Check file is committed to Git

3. **Python path issues**:
   - Verify Python version matches `runtime.txt`
   - Check `PYTHON_VERSION` environment variable

4. **Import errors**:
   - Verify all dependencies are in `requirements.txt`
   - Check that `app.main:app` path is correct

## 📝 Updated render.yaml (For Future Reference)

If you want to update `render.yaml` for future deployments:

```yaml
services:
  - type: web
    name: mindmate-api
    env: python
    rootDir: backend  # Set root directory to backend
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120
```

## 🎉 Success!

After applying the fix, your service should:
- ✅ Build successfully
- ✅ Start without errors
- ✅ Respond to health checks
- ✅ Serve your API endpoints

---

## 🔗 Related Documentation

- [Render Root Directory Documentation](https://render.com/docs/root-directory)
- [Render Build Commands](https://render.com/docs/build-commands)
- [Render Start Commands](https://render.com/docs/start-commands)

---

**Fix Applied! Your service should now deploy successfully! 🚀**

