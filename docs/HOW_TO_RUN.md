# 🚀 How to Run MindMate

## Quick Start Guide

### Prerequisites Check
```bash
# Check Python version (need 3.10+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

## Step-by-Step Instructions

### 1️⃣ Backend Setup

#### Terminal 1 - Backend

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Make sure .env file has your API keys
# Edit backend/.env and add:
# GEMINI_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# Run the backend server
python -m app.main
```

**Expected Output:**
```
✅ Gemini gemini-2.0-flash-exp initialized
✅ OpenAI gpt-4o-mini initialized
✅ Using Gemini gemini-2.0-flash-exp for reflections (Testing Mode)
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Backend is now running on:** `http://localhost:8000`

---

### 2️⃣ Frontend Setup

#### Terminal 2 - Frontend (New Terminal Window)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Create .env file if it doesn't exist
echo "VITE_API_URL=http://localhost:8000" > .env

# Run the frontend development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Frontend is now running on:** `http://localhost:3000`

---

### 3️⃣ Open in Browser

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the MindMate homepage

---

## ✅ Verification

### Check Backend is Running
- Visit: `http://localhost:8000`
- You should see: `{"message":"🧠 MindMate API","version":"1.0.0","status":"running"}`

### Check API Documentation
- Visit: `http://localhost:8000/docs`
- You should see Swagger UI with all API endpoints

### Check Frontend is Running
- Visit: `http://localhost:3000`
- You should see the MindMate landing page

---

## 🎯 Common Commands

### Backend Commands
```bash
# Start backend
cd backend
source venv/bin/activate
python -m app.main

# Run tests
pytest tests/test_api.py -v

# Check backend health
curl http://localhost:8000/health
```

### Frontend Commands
```bash
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new packages
npm install package-name
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem: Port 8000 already in use**
```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)

# Or on Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Problem: Module not found**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Problem: API keys not working**
- Check `backend/.env` file exists
- Verify API keys are correct
- Restart the backend server

### Frontend Won't Start

**Problem: Port 3000 already in use**
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001  // Change to different port
  }
  ```

**Problem: Cannot connect to backend**
- Verify backend is running on `http://localhost:8000`
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:8000`
- Check browser console for errors

**Problem: Module not found**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Both Running But Not Connecting

1. **Check backend is accessible:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

2. **Check frontend .env file:**
   ```bash
   cat frontend/.env
   # Should have: VITE_API_URL=http://localhost:8000
   ```

3. **Check browser console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API calls

---

## 📱 Using the Application

### 1. Create Journal Entry
- Go to Dashboard
- Write your thoughts
- Click "Submit"
- See AI reflection and emotion analysis

### 2. Switch AI Provider
- Go to Settings page
- Click on "Gemini" (Testing) or "OpenAI" (Production)
- Provider switches instantly

### 3. View Mood Analytics
- Go to Insights page
- See emotion distribution charts
- View mood trends over time

### 4. Voice Recording
- Click "Use Voice" button
- Record your thoughts
- Audio is transcribed automatically

---

## 🛑 Stopping the Application

### Stop Backend
- Press `Ctrl + C` in the backend terminal
- Or close the terminal window

### Stop Frontend
- Press `Ctrl + C` in the frontend terminal
- Or close the terminal window

---

## 📊 Project Structure Summary

```
MindMate/
├── backend/          # FastAPI backend
│   ├── app/         # Application code
│   ├── tests/       # Test files
│   └── .env         # Environment variables
│
└── frontend/        # React frontend
    ├── src/         # Source code
    ├── public/      # Static files
    └── .env         # Environment variables
```

---

## 🎉 Success!

If both backend and frontend are running, you should be able to:
- ✅ Access the frontend at `http://localhost:3000`
- ✅ Create journal entries
- ✅ See AI reflections
- ✅ Switch between AI providers
- ✅ View mood analytics
- ✅ Use voice recording

**Happy Journaling! 🧠💙**

