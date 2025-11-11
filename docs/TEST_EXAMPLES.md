# 🧪 Test Examples for MindMate

## 🎯 Quick Test Methods

### Method 1: Swagger UI (Easiest - Recommended)
1. Start backend: `python -m app.main`
2. Open: `http://localhost:8000/docs`
3. Test all endpoints interactively in the browser!

### Method 2: Test Script (Automated)
```bash
# Bash script
./test_api.sh

# Python script
python test_api.py
```

### Method 3: cURL Commands (Manual)
See `QUICK_TEST_QUERIES.md` for all cURL commands

---

## 📝 Sample Test Queries

### 1. Health Check
```bash
curl http://localhost:8000/health
```
**Expected:** `{"status": "healthy"}`

### 2. Create Happy Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Today was amazing! I got a promotion and celebrated with friends. I feel so happy!",
    "is_voice": false
  }'
```

### 3. Create Sad Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I feel really down today. Everything seems overwhelming and I dont know how to cope.",
    "is_voice": false
  }'
```

### 4. Get History
```bash
curl "http://localhost:8000/journal/history?limit=10"
```

### 5. Analyze Emotion
```bash
curl -X POST "http://localhost:8000/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{"text": "I am so happy and excited about my new opportunity!"}'
```

### 6. Get Mood Stats
```bash
curl "http://localhost:8000/mood/stats?days=7"
```

### 7. Switch Provider
```bash
# Get current
curl "http://localhost:8000/settings/provider"

# Switch to OpenAI
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai"}'

# Switch to Gemini
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{"provider": "gemini"}'
```

---

## 🎨 Frontend Testing

### Test Scenarios:

1. **Create Journal Entry**
   - Go to Dashboard
   - Write: "I am feeling great today!"
   - Click Submit
   - Verify: Reflection appears

2. **View History**
   - Go to History page
   - Verify: Entries are displayed
   - Test filters and search

3. **View Insights**
   - Go to Insights page
   - Verify: Charts are shown
   - Change time range

4. **Switch Provider**
   - Go to Settings
   - Click provider buttons
   - Verify: Provider switches

---

## 📋 Complete Test Checklist

- [ ] Backend health check
- [ ] Create journal entry (happy)
- [ ] Create journal entry (sad)
- [ ] Create journal entry (anxious)
- [ ] Create journal entry (angry)
- [ ] Get journal history
- [ ] Get specific entry
- [ ] Analyze emotion
- [ ] Generate reflection
- [ ] Full analysis
- [ ] Mood statistics
- [ ] Provider switching
- [ ] Frontend displays data
- [ ] Voice recording (if API key available)

---

**💡 Tip**: Use Swagger UI at `http://localhost:8000/docs` for the easiest testing!

