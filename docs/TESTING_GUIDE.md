# 🧪 MindMate Testing Guide

## Quick Test Queries

### 1. Health Check
```bash
curl http://localhost:8000/health
```
**Expected Response:**
```json
{"status": "healthy"}
```

### 2. Root Endpoint
```bash
curl http://localhost:8000/
```
**Expected Response:**
```json
{
  "message": "🧠 MindMate API",
  "version": "1.0.0",
  "status": "running"
}
```

---

## 📝 Journal Entry Tests

### Test 1: Create Happy Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Today was absolutely amazing! I got a promotion at work and celebrated with my friends. I feel so happy and grateful for all the wonderful things happening in my life.",
    "is_voice": false
  }'
```

**Expected:**
- Status: `200 OK`
- Response includes: `id`, `content`, `emotion` (should be "joy" or similar), `reflection`, `created_at`
- Emotion should be positive (joy, happiness, etc.)

### Test 2: Create Sad Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I feel really down today. Everything seems overwhelming and I dont know how to cope with all the stress. I miss my family and feel lonely.",
    "is_voice": false
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: "sadness" or similar negative emotion
- Reflection should be empathetic and supportive

### Test 3: Create Anxious Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I am so worried about my upcoming exam. I have been studying for weeks but I feel like I am not prepared. What if I fail? I cannot sleep at night because of anxiety.",
    "is_voice": false
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: "fear" or "anxiety"
- Reflection should acknowledge the anxiety and provide calming suggestions

### Test 4: Create Angry Journal Entry
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I am absolutely furious! My colleague took credit for my work again and my boss did not even listen to me. This is so unfair and I am really angry about it.",
    "is_voice": false
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: "anger" or similar
- Reflection should validate feelings and suggest healthy coping strategies

### Test 5: Get Journal History
```bash
curl "http://localhost:8000/journal/history?limit=10"
```

**Expected:**
- Status: `200 OK`
- Response: Array of journal entries
- Entries sorted by most recent first

### Test 6: Get Specific Journal Entry
```bash
# Replace {id} with actual entry ID from previous requests
curl "http://localhost:8000/journal/1"
```

**Expected:**
- Status: `200 OK`
- Response: Single journal entry object

### Test 7: Invalid Entry (Too Short)
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Short",
    "is_voice": false
  }'
```

**Expected:**
- Status: `422 Unprocessable Entity`
- Error about minimum length requirement

---

## 🧠 Emotion Analysis Tests

### Test 1: Analyze Positive Emotion
```bash
curl -X POST "http://localhost:8000/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am feeling fantastic today! The sun is shining, I had a great workout, and I am excited about my weekend plans. Life is wonderful!"
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: "joy" or "happiness"
- Confidence: High (0.7+)
- All scores: Object with emotion scores

### Test 2: Analyze Negative Emotion
```bash
curl -X POST "http://localhost:8000/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I feel terrible. Nothing is going right and I just want to curl up in bed and cry. Everything feels hopeless."
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: "sadness" or similar
- Confidence: Should be moderate to high

### Test 3: Analyze Mixed Emotions
```bash
curl -X POST "http://localhost:8000/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am excited about my new job but also nervous about starting. I hope everything goes well and I can make a good impression."
  }'
```

**Expected:**
- Status: `200 OK`
- Emotion: Could be "surprise", "fear", or "joy" depending on dominant emotion
- Multiple emotions with scores

---

## 💬 Reflection Generation Tests

### Test 1: Generate Reflection for Joy
```bash
curl -X POST "http://localhost:8000/analysis/reflect" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I had the best day today! I finished my project early, went for a beautiful walk in the park, and had dinner with my best friend.",
    "emotion": "joy"
  }'
```

**Expected:**
- Status: `200 OK`
- Response includes: `reflection` (warm, empathetic text)
- Response includes: `suggestions` (array of 2 self-care tips)

### Test 2: Generate Reflection for Sadness
```bash
curl -X POST "http://localhost:8000/analysis/reflect" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I have been feeling really down lately. I miss my family and feel like I am not good enough for anything.",
    "emotion": "sadness"
  }'
```

**Expected:**
- Status: `200 OK`
- Reflection should be supportive and empathetic
- Suggestions should be helpful and actionable

---

## 🔄 Full Analysis Test

### Test 1: Complete Analysis (Emotion + Reflection)
```bash
curl -X POST "http://localhost:8000/analysis/analyze-full" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am so grateful for my supportive friends and family. They have been there for me through thick and thin. Today I realized how blessed I am to have such amazing people in my life."
  }'
```

**Expected:**
- Status: `200 OK`
- Response includes: `emotion` object (primary, confidence, all_scores)
- Response includes: `reflection` object (message, suggestions)
- Success: `true`

---

## 📊 Mood Statistics Tests

### Test 1: Get Mood Stats (7 days)
```bash
curl "http://localhost:8000/mood/stats?days=7"
```

**Expected:**
- Status: `200 OK`
- Response includes: `total_entries`, `emotion_distribution`, `weekly_trend`
- Emotion distribution: Object with emotion counts
- Weekly trend: Array of trend items

### Test 2: Get Mood Stats (30 days)
```bash
curl "http://localhost:8000/mood/stats?days=30"
```

**Expected:**
- Status: `200 OK`
- Should return stats for past 30 days

---

## ⚙️ Settings/Provider Tests

### Test 1: Get Current Provider
```bash
curl "http://localhost:8000/settings/provider"
```

**Expected:**
- Status: `200 OK`
- Response: `current_provider`, `available_providers`, `message`
- Current provider: "gemini" or "openai"
- Available providers: Array of available providers

### Test 2: Switch to Gemini
```bash
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gemini"
  }'
```

**Expected:**
- Status: `200 OK`
- Current provider: "gemini"
- Message: "Switched to GEMINI (Testing Mode)"

### Test 3: Switch to OpenAI
```bash
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai"
  }'
```

**Expected:**
- Status: `200 OK`
- Current provider: "openai"
- Message: "Switched to OPENAI (Production Mode)"

### Test 4: Invalid Provider
```bash
curl -X POST "http://localhost:8000/settings/provider" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "invalid"
  }'
```

**Expected:**
- Status: `400 Bad Request`
- Error message about invalid provider

---

## 🎤 Speech-to-Text Test (Advanced)

### Test 1: Upload Audio File
```bash
# Note: This requires an actual audio file
curl -X POST "http://localhost:8000/analysis/speech-to-text" \
  -F "audio=@/path/to/audio.webm"
```

**Expected:**
- Status: `200 OK`
- Response: `text` (transcribed text), `success: true`

### Test 2: Invalid File Type
```bash
curl -X POST "http://localhost:8000/analysis/speech-to-text" \
  -F "audio=@/path/to/file.txt"
```

**Expected:**
- Status: `400 Bad Request`
- Error about invalid file type

---

## 📋 Complete Test Sequence

### Step-by-Step Testing Workflow

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Create Multiple Journal Entries**
   ```bash
   # Happy entry
   curl -X POST "http://localhost:8000/journal/create" \
     -H "Content-Type: application/json" \
     -d '{"content": "I am feeling great today! Everything is going well.", "is_voice": false}'
   
   # Sad entry
   curl -X POST "http://localhost:8000/journal/create" \
     -H "Content-Type: application/json" \
     -d '{"content": "I feel really sad and lonely today. Nothing seems to be working out.", "is_voice": false}'
   
   # Anxious entry
   curl -X POST "http://localhost:8000/journal/create" \
     -H "Content-Type: application/json" \
     -d '{"content": "I am so worried about my future. I dont know what to do and I feel anxious all the time.", "is_voice": false}'
   ```

3. **Get Journal History**
   ```bash
   curl "http://localhost:8000/journal/history?limit=10"
   ```

4. **Get Mood Statistics**
   ```bash
   curl "http://localhost:8000/mood/stats?days=7"
   ```

5. **Test Emotion Analysis**
   ```bash
   curl -X POST "http://localhost:8000/analysis/emotion" \
     -H "Content-Type: application/json" \
     -d '{"text": "I am so happy and excited about my new opportunity!"}'
   ```

6. **Test Provider Switching**
   ```bash
   # Get current provider
   curl "http://localhost:8000/settings/provider"
   
   # Switch to OpenAI
   curl -X POST "http://localhost:8000/settings/provider" \
     -H "Content-Type: application/json" \
     -d '{"provider": "openai"}'
   
   # Create entry with new provider
   curl -X POST "http://localhost:8000/journal/create" \
     -H "Content-Type: application/json" \
     -d '{"content": "Testing OpenAI provider. This is a test journal entry.", "is_voice": false}'
   
   # Switch back to Gemini
   curl -X POST "http://localhost:8000/settings/provider" \
     -H "Content-Type: application/json" \
     -d '{"provider": "gemini"}'
   ```

---

## 🎯 Frontend Testing Scenarios

### Test Scenario 1: Create Journal Entry
1. Open `http://localhost:3000`
2. Navigate to Dashboard
3. Write a journal entry (at least 10 characters)
4. Click "Submit"
5. Verify:
   - Entry is saved
   - Emotion is detected
   - Reflection card appears
   - Suggestions are shown

### Test Scenario 2: View Journal History
1. Navigate to History page
2. Verify:
   - Previous entries are displayed
   - Entries are sorted by date (newest first)
   - Emotions are shown with badges
   - Can filter by emotion
   - Can search entries

### Test Scenario 3: Mood Analytics
1. Navigate to Insights page
2. Verify:
   - Mood statistics are displayed
   - Charts are rendered
   - Emotion distribution is shown
   - Weekly trend is visible
   - Can change time range (7, 30, 365 days)

### Test Scenario 4: Provider Switching
1. Navigate to Settings page
2. Find "AI Provider" section
3. Click on "OpenAI" (Production)
4. Verify:
   - Provider switches successfully
   - Toast notification appears
   - Status badge changes
5. Create a new journal entry
6. Verify:
   - Reflection is generated using OpenAI
   - Response quality is good

### Test Scenario 5: Voice Recording
1. Go to Dashboard
2. Click "Use Voice" button
3. Record audio (if microphone is available)
4. Verify:
   - Recording starts
   - Audio is processed
   - Text is transcribed
   - Entry is created automatically

---

## 🧪 Test Data Examples

### Happy/Positive Entries
```
"I am so grateful for my wonderful friends and family. Today was perfect!"
"I just got accepted into my dream university! I am overjoyed and excited!"
"Had an amazing day at the beach with my loved ones. Feeling blessed!"
```

### Sad/Negative Entries
```
"I feel really down today. Nothing seems to make me happy anymore."
"I miss my family so much. I feel lonely and sad without them."
"Everything is going wrong. I dont know how to handle this anymore."
```

### Anxious/Fearful Entries
```
"I am so worried about my presentation tomorrow. What if I mess up?"
"I feel anxious about the future. I dont know what will happen."
"I am scared of making mistakes. The pressure is overwhelming."
```

### Angry Entries
```
"I am furious about how I was treated. This is completely unfair!"
"I am so angry at myself for making that mistake. I cant believe it."
"This situation makes me really mad. I need to calm down."
```

### Neutral Entries
```
"Today was a regular day. Nothing special happened, just went to work and came home."
"I feel okay today. Not particularly happy or sad, just neutral."
"Had a normal day. Nothing to report, just going through the motions."
```

---

## 🔍 Validation Tests

### Test 1: Minimum Length Validation
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{"content": "Short", "is_voice": false}'
```
**Expected:** `422 Unprocessable Entity`

### Test 2: Maximum Length Validation
```bash
# Create a very long string (5001 characters)
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"$(python3 -c 'print(\"a\" * 5001)')\", \"is_voice": false}"
```
**Expected:** `422 Unprocessable Entity`

### Test 3: Missing Required Fields
```bash
curl -X POST "http://localhost:8000/journal/create" \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected:** `422 Unprocessable Entity`

### Test 4: Invalid Entry ID
```bash
curl "http://localhost:8000/journal/99999"
```
**Expected:** `404 Not Found`

---

## 📊 Expected Response Formats

### Journal Entry Response
```json
{
  "id": 1,
  "content": "Journal entry text...",
  "emotion": "joy",
  "emotion_scores": "{\"joy\": 0.85, \"sadness\": 0.1, ...}",
  "reflection": "AI-generated reflection...",
  "created_at": "2024-11-12T10:30:00",
  "is_voice": false,
  "user_id": "default_user"
}
```

### Emotion Analysis Response
```json
{
  "emotion": "joy",
  "confidence": 0.85,
  "all_scores": {
    "joy": 0.85,
    "sadness": 0.05,
    "anger": 0.03,
    "fear": 0.02,
    "surprise": 0.03,
    "neutral": 0.02
  }
}
```

### Reflection Response
```json
{
  "reflection": "Thank you for sharing...",
  "suggestions": [
    "Take a few deep breaths",
    "Be kind to yourself"
  ]
}
```

### Mood Stats Response
```json
{
  "total_entries": 10,
  "emotion_distribution": {
    "joy": 5,
    "sadness": 2,
    "anger": 1,
    "fear": 2
  },
  "weekly_trend": [
    {
      "date": "2024-11-12",
      "emotion": "joy",
      "confidence": 0.85
    }
  ]
}
```

---

## 🚀 Quick Test Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:8000"

echo "🧪 Testing MindMate API"
echo "========================"

# Health Check
echo -e "\n1. Health Check"
curl -s "$API_URL/health" | jq .

# Create Journal Entry
echo -e "\n2. Creating Journal Entry"
ENTRY_RESPONSE=$(curl -s -X POST "$API_URL/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I am feeling great today! Everything is going well and I am happy.",
    "is_voice": false
  }')
echo "$ENTRY_RESPONSE" | jq .

# Get Entry ID
ENTRY_ID=$(echo "$ENTRY_RESPONSE" | jq -r '.id')
echo -e "\n3. Getting Journal Entry $ENTRY_ID"
curl -s "$API_URL/journal/$ENTRY_ID" | jq .

# Get History
echo -e "\n4. Getting Journal History"
curl -s "$API_URL/journal/history?limit=5" | jq .

# Mood Stats
echo -e "\n5. Getting Mood Statistics"
curl -s "$API_URL/mood/stats?days=7" | jq .

# Emotion Analysis
echo -e "\n6. Analyzing Emotion"
curl -s -X POST "$API_URL/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{"text": "I am so happy and excited!"}' | jq .

# Provider Info
echo -e "\n7. Getting Provider Info"
curl -s "$API_URL/settings/provider" | jq .

echo -e "\n✅ Tests Complete!"
```

**Usage:**
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📝 Notes

- Replace `{id}` with actual IDs from your responses
- All timestamps are in UTC
- Emotion analysis may vary slightly between runs
- Provider switching affects new journal entries only
- Speech-to-text requires valid API keys and audio files

---

## 🎯 Testing Checklist

- [ ] Health check works
- [ ] Create journal entry (happy)
- [ ] Create journal entry (sad)
- [ ] Create journal entry (anxious)
- [ ] Create journal entry (angry)
- [ ] Get journal history
- [ ] Get specific journal entry
- [ ] Emotion analysis works
- [ ] Reflection generation works
- [ ] Full analysis works
- [ ] Mood statistics work
- [ ] Provider switching works
- [ ] Validation works (too short, too long)
- [ ] Error handling works (404, 422, 500)
- [ ] Frontend displays data correctly
- [ ] Voice recording works (if API key available)

---

**Happy Testing! 🧪✨**

