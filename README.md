# 🧠 MindMate - AI Mental Wellness Companion

![MindMate Banner](https://via.placeholder.com/1200x300/0ea5e9/ffffff?text=MindMate+-+Reflect+%7C+Understand+%7C+Heal)

## 🌟 Overview

MindMate is an AI-powered mental wellness companion that helps users reflect on their emotions through intelligent journaling. Using advanced NLP and sentiment analysis, MindMate provides personalized insights and supportive reflections.

## ✨ Features

- 📝 **Smart Journaling** - Write or speak your thoughts
- 🧠 **Emotion Detection** - AI analyzes your emotional state using transformers
- 💬 **AI Reflections** - Get personalized, supportive feedback from Gemini or OpenAI
- 📊 **Mood Tracking** - Visualize your emotional journey with charts and analytics
- 🎤 **Voice Input** - Record and transcribe your thoughts
- 🔄 **Provider Switching** - Toggle between Gemini (testing) and OpenAI (production)
- 🔒 **Privacy First** - Your data stays secure

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** (Node.js 20+ recommended)
- **pip** (Python package manager)
- **npm** (Node package manager)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   ⚠️ **Note:** This may take several minutes as it downloads PyTorch and transformers models (~2-3GB)

5. **Configure environment variables**
   ```bash
   # The .env file should already exist, but verify it has your API keys
   # Edit backend/.env and add:
   GEMINI_API_KEY=your_gemini_key_here
   OPENAI_API_KEY=your_openai_key_here  # Optional but recommended
   ```

6. **Run the backend server**
   ```bash
   python -m app.main
   ```
   
   The backend will start on `http://localhost:8000`
   
   You should see:
   - ✅ Emotion analyzer loaded successfully
   - ✅ Gemini/OpenAI initialized
   - INFO: Uvicorn running on http://0.0.0.0:8000

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (if not exists)
   ```bash
   # Create .env file with:
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Run the frontend development server**
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:3000`
   
   You should see:
   - VITE ready in XXX ms
   - ➜ Local: http://localhost:3000/

## 🎯 Running the Application

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m app.main
```

### Step 2: Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### Step 3: Open in Browser
- Open `http://localhost:3000` in your browser
- The frontend will automatically connect to the backend API

## 📁 Project Structure

```
MindMate/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routes/              # API routes
│   │   │   ├── journal.py       # Journal endpoints
│   │   │   ├── mood.py          # Mood analytics
│   │   │   ├── analysis.py      # AI analysis endpoints
│   │   │   └── settings.py      # Settings/provider switching
│   │   ├── services/            # AI services
│   │   │   ├── emotion_analyzer.py
│   │   │   ├── reflection_generator.py
│   │   │   └── speech_to_text.py
│   │   └── utils/               # Utility functions
│   ├── tests/                   # Test files
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── common/          # Reusable components
│   │   │   ├── journal/         # Journal components
│   │   │   ├── layout/          # Layout components
│   │   │   └── mood/            # Mood analytics components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   └── utils/               # Utility functions
│   ├── package.json             # Node dependencies
│   └── vite.config.js           # Vite configuration
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables (`backend/.env`)

```env
# API Keys
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Model Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4o-mini
WHISPER_MODEL=whisper-1

# Provider Selection (gemini for testing, openai for production)
REFLECTION_PROVIDER=gemini

# Database
DATABASE_URL=sqlite:///./mindmate.db

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### Frontend Environment Variables (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Features Usage

### Journaling
1. Navigate to Dashboard
2. Write your thoughts in the journal input
3. Click "Submit" or use voice recording
4. Get AI-powered reflection and emotion analysis

### Voice Recording
1. Click "Use Voice" button
2. Record your thoughts
3. Audio is transcribed automatically
4. Journal entry is created with transcription

### Provider Switching
1. Go to Settings page
2. Find "AI Provider" section
3. Click on Gemini (Testing) or OpenAI (Production)
4. Provider switches instantly without server restart

### Mood Analytics
1. Navigate to Insights page
2. View emotion distribution charts
3. See mood trends over time
4. Track your emotional patterns

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
pytest tests/test_api.py -v
```

### API Documentation
- Once backend is running, visit: `http://localhost:8000/docs`
- Interactive API documentation (Swagger UI)

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Missing API keys:**
- Add API keys to `backend/.env`
- Restart the backend server

**PyTorch installation issues:**
- Make sure you have Python 3.10+
- Try: `pip install torch --index-url https://download.pytorch.org/whl/cpu`

### Frontend Issues

**Port already in use:**
- Change port in `vite.config.js` or kill the process

**API connection errors:**
- Verify backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `frontend/.env`

**Module not found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Endpoints

### Journal
- `POST /journal/create` - Create journal entry
- `GET /journal/history` - Get journal history
- `GET /journal/{id}` - Get specific entry

### Mood
- `GET /mood/stats` - Get mood statistics

### Analysis
- `POST /analysis/emotion` - Analyze emotion
- `POST /analysis/reflect` - Generate reflection
- `POST /analysis/speech-to-text` - Transcribe audio
- `POST /analysis/analyze-full` - Full analysis

### Settings
- `GET /settings/provider` - Get current provider
- `POST /settings/provider` - Switch provider

## 🚀 Production Deployment

### Render Deployment (Recommended)

MindMate is ready to deploy on Render! See the complete deployment guide:

📖 **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Complete deployment guide
📋 **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

#### Quick Start on Render:

1. **Push code to GitHub**
2. **Deploy Backend**:
   - Create Web Service on Render
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
   - Set environment variables (API keys, DATABASE_URL, etc.)
3. **Deploy Frontend**:
   - Create Static Site on Render
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Set `VITE_API_URL` to your backend URL
4. **Update CORS**: Set `CORS_ORIGINS` in backend to your frontend URL

#### Using Render Blueprint:

1. Push `render.yaml` to your repository
2. Go to Render Dashboard → New → Blueprint
3. Connect your repository
4. Render will automatically create all services

### Manual Deployment

#### Backend
1. Set `DEBUG=False` in environment variables
2. Use a production WSGI server (Gunicorn)
3. Set up proper CORS origins
4. Use a production database (PostgreSQL)

#### Frontend
1. Build for production: `npm run build`
2. Serve with a web server (Nginx)
3. Update `VITE_API_URL` to production API URL

## 📝 License

This project is built for LuminHacks 2025.

## 🙏 Credits

- Built with FastAPI, React, and Vite
- AI powered by Gemini and OpenAI
- Emotion analysis using Hugging Face transformers

---

**Happy Journaling! 🧠💙**
