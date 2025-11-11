# ⚡ Quick Start Guide - MindMate

## 🚀 Run the Application (2 Simple Steps)

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate  # macOS/Linux
python -m app.main
```
✅ Backend running on: `http://localhost:8000`

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
✅ Frontend running on: `http://localhost:3000`

### Step 3: Open Browser
🌐 Open: `http://localhost:3000`

---

## ✅ Status Check

### Backend Status
- Visit: `http://localhost:8000/health`
- Should return: `{"status":"healthy"}`

### Frontend Status
- Visit: `http://localhost:3000`
- Should show: MindMate homepage

### API Documentation
- Visit: `http://localhost:8000/docs`
- Should show: Swagger UI with all endpoints

---

## 📝 First Time Setup

### Backend (One-time)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add API keys to backend/.env
# GEMINI_API_KEY=your_key
# OPENAI_API_KEY=your_key (optional)
```

### Frontend (One-time)
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env
```

---

## 🎯 What You Can Do

1. **Create Journal Entries** - Write or speak your thoughts
2. **Get AI Reflections** - Receive personalized feedback
3. **View Mood Analytics** - See your emotional patterns
4. **Switch AI Providers** - Toggle between Gemini (testing) and OpenAI (production)
5. **Voice Recording** - Record and transcribe your thoughts

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Restart backend
cd backend
source venv/bin/activate
python -m app.main
```

### Frontend Won't Start
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart frontend
cd frontend
npm run dev
```

### Connection Issues
- Verify backend is running: `curl http://localhost:8000/health`
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:8000`
- Check browser console for errors

---

## 📊 Current Status

✅ **Frontend**: Running on `http://localhost:3000`
✅ **Backend**: Should be running on `http://localhost:8000`
✅ **Dependencies**: Installed and updated
✅ **Vulnerabilities**: Minor dev dependency issues (non-critical)

---

## 🎉 You're All Set!

The application is ready to use. Just make sure:
1. ✅ Backend is running (`python -m app.main`)
2. ✅ Frontend is running (`npm run dev`)
3. ✅ Browser is open to `http://localhost:3000`

**Happy Journaling! 🧠💙**

