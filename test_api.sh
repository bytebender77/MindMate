#!/bin/bash

API_URL="http://localhost:8000"

echo "🧪 Testing MindMate API"
echo "========================"
echo ""

# Health Check
echo "1. Health Check"
curl -s "$API_URL/health" | python3 -m json.tool
echo -e "\n"

# Create Happy Entry
echo "2. Creating Happy Journal Entry"
curl -s -X POST "$API_URL/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Today was absolutely amazing! I got a promotion at work and celebrated with my friends. I feel so happy and grateful!",
    "is_voice": false
  }' | python3 -m json.tool
echo -e "\n"

# Create Sad Entry
echo "3. Creating Sad Journal Entry"
curl -s -X POST "$API_URL/journal/create" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I feel really down today. Everything seems overwhelming and I dont know how to cope with all the stress.",
    "is_voice": false
  }' | python3 -m json.tool
echo -e "\n"

# Get History
echo "4. Getting Journal History"
curl -s "$API_URL/journal/history?limit=5" | python3 -m json.tool
echo -e "\n"

# Mood Stats
echo "5. Getting Mood Statistics"
curl -s "$API_URL/mood/stats?days=7" | python3 -m json.tool
echo -e "\n"

# Emotion Analysis
echo "6. Analyzing Emotion"
curl -s -X POST "$API_URL/analysis/emotion" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am so happy and excited about my new opportunity!"
  }' | python3 -m json.tool
echo -e "\n"

# Provider Info
echo "7. Getting Provider Info"
curl -s "$API_URL/settings/provider" | python3 -m json.tool
echo -e "\n"

echo "✅ Tests Complete!"
