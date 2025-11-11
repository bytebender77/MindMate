# ⚡ Quick Test Queries for MindMate

## 🌐 Using Swagger UI (Easiest Way)

1. Start the backend: `python -m app.main`
2. Open browser: `http://localhost:8000/docs`
3. Test all endpoints interactively in the browser!

---

## 📋 Essential Test Queries (cURL)

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Create Happy Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Today was amazing! I got a promotion and celebrated with friends. I feel so happy and grateful!",
    "is_voice": false
  }'
```

### 3. Create Sad Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I feel really down today. Everything seems overwhelming and I dont know how to cope with all the stress.",
    "is_voice": false
  }'
```

### 4. Get Journal History
```bash
curl "http://localhost:8000/journal/history?limit=10"
```

### 5. Analyze Emotion
```bash
curl -X POST "http://localhost:8000/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am feeling fantastic today! The sun is shining and I am excited about my weekend plans."
  }'
```

### 6. Generate Reflection
```bash
curl -X POST "http://localhost:8000/analysis/reflect" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I had the best day today! I finished my project early and had dinner with my best friend.",
    "emotion": "joy"
  }'
```

### 7. Full Analysis
```bash
curl -X POST "http://localhost:8000/analysis/analyze-full" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am so grateful for my supportive friends and family. They have been there for me through thick and thin."
  }'
```

### 8. Get Mood Statistics
```bash
curl "http://localhost:8000/mood/stats?days=7"
```

### 9. Get Current AI Provider
```bash
curl "http://localhost:8000/settings/provider"
```

### 10. Switch to OpenAI
```bash
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai"}'
```

### 11. Switch to Gemini
```bash
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "gemini"}'
```

---

## 🎯 Test Scenarios

### Scenario 1: Complete Journaling Flow
```bash
# 1. Create entry
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I had a wonderful day! I completed all my tasks and felt productive.",
    "is_voice": false
  }'

# 2. Get history
curl "http://localhost:8000/journal/history?limit=5"

# 3. Get mood stats
curl "http://localhost:8000/mood/stats?days=7"
```

### Scenario 2: Test Different Emotions
```bash
# Happy
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{"content": "I am so happy and excited about my new opportunity!", "is_voice": false}'

# Sad
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{"content": "I feel really sad and lonely today. Nothing seems to be working out.", "is_voice": false}'

# Anxious
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{"content": "I am so worried about my future. I dont know what to do and I feel anxious.", "is_voice": false}'
```

### Scenario 3: Test Provider Switching
```bash
# Get current provider
curl "http://localhost:8000/settings/provider"

# Switch to OpenAI
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai"}'

# Create entry with OpenAI
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{"content": "Testing OpenAI provider for reflections.", "is_voice": false}'

# Switch back to Gemini
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "gemini"}'
```

---

## 🧪 Using Python (Alternative)

```python
import requests

API_URL = "http://localhost:8000"

# Health check
response = requests.get(f"{API_URL}/health")
print(response.json())

# Create journal entry
response = requests.post(
    f"{API_URL}/journal/create",
    json={
        "content": "I am feeling great today!",
        "is_voice": False
    }
)
print(response.json())

# Get history
response = requests.get(f"{API_URL}/journal/history?limit=10")
print(response.json())

# Analyze emotion
response = requests.post(
    f"{API_URL}/analysis/emotion",
    json={"text": "I am so happy and excited!"}
)
print(response.json())
```

---

## 📱 Frontend Testing

### Test 1: Create Journal Entry
1. Go to `http://localhost:3000/dashboard`
2. Write: "I am feeling great today! Everything is going well."
3. Click "Submit"
4. Verify: Reflection appears with emotion badge

### Test 2: View History
1. Go to `http://localhost:3000/history`
2. Verify: Previous entries are shown
3. Test filters: Emotion, time period, search

### Test 3: View Insights
1. Go to `http://localhost:3000/insights`
2. Verify: Charts and statistics are displayed
3. Change time range: 7 days, 30 days, all time

### Test 4: Switch Provider
1. Go to `http://localhost:3000/settings`
2. Find "AI Provider" section
3. Click "OpenAI" or "Gemini"
4. Verify: Provider switches successfully
5. Create new entry to test new provider

---

## ✅ Quick Verification Checklist

- [ ] Backend is running on `http://localhost:8000`
- [ ] Frontend is running on `http://localhost:3000`
- [ ] Health check returns `{"status": "healthy"}`
- [ ] Can create journal entries
- [ ] Emotion analysis works
- [ ] Reflections are generated
- [ ] Mood statistics are displayed
- [ ] Provider switching works
- [ ] Frontend displays data correctly

---

## 🎯 Recommended Test Order

1. **Health Check** - Verify backend is running
2. **Create Entry (Happy)** - Test basic functionality
3. **Create Entry (Sad)** - Test different emotions
4. **Get History** - Verify data persistence
5. **Mood Stats** - Test analytics
6. **Provider Switch** - Test provider toggle
7. **Frontend** - Test UI interactions

---

**💡 Tip**: Use Swagger UI at `http://localhost:8000/docs` for the easiest testing experience!

