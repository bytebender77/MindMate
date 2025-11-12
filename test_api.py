#!/usr/bin/env python3
"""
Quick test script for MindMate API
Usage: python test_api.py
"""

import requests
import json
from datetime import datetime

API_URL = "http://localhost:8000"

def print_response(title, response):
    """Print formatted response"""
    print(f"\n{'='*50}")
    print(f"✅ {title}")
    print(f"{'='*50}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print()

def test_health_check():
    """Test health check endpoint"""
    response = requests.get(f"{API_URL}/health")
    print_response("Health Check", response)
    return response.status_code == 200

def test_create_journal_entry(content, emotion_type):
    """Test creating a journal entry"""
    response = requests.post(
        f"{API_URL}/journal/create",
        json={
            "content": content,
            "is_voice": False
        }
    )
    print_response(f"Create Journal Entry ({emotion_type})", response)
    if response.status_code == 200:
        return response.json().get("id")
    return None

def test_get_history():
    """Test getting journal history"""
    response = requests.get(f"{API_URL}/journal/history?limit=5")
    print_response("Get Journal History", response)
    return response.status_code == 200

def test_get_entry(entry_id):
    """Test getting a specific entry"""
    response = requests.get(f"{API_URL}/journal/{entry_id}")
    print_response(f"Get Journal Entry {entry_id}", response)
    return response.status_code == 200

def test_analyze_emotion(text):
    """Test emotion analysis"""
    response = requests.post(
        f"{API_URL}/analysis/emotion",
        json={"text": text}
    )
    print_response("Analyze Emotion", response)
    return response.status_code == 200

def test_generate_reflection(content, emotion):
    """Test reflection generation"""
    response = requests.post(
        f"{API_URL}/analysis/reflect",
        json={
            "content": content,
            "emotion": emotion
        }
    )
    print_response("Generate Reflection", response)
    return response.status_code == 200

def test_full_analysis(text):
    """Test full analysis"""
    response = requests.post(
        f"{API_URL}/analysis/analyze-full",
        json={"text": text}
    )
    print_response("Full Analysis", response)
    return response.status_code == 200

def test_mood_stats(days=7):
    """Test mood statistics"""
    response = requests.get(f"{API_URL}/mood/stats?days={days}")
    print_response(f"Mood Statistics ({days} days)", response)
    return response.status_code == 200

def test_get_provider():
    """Test getting current provider"""
    response = requests.get(f"{API_URL}/settings/provider")
    print_response("Get Current Provider", response)
    return response.status_code == 200

def test_switch_provider(provider):
    """Test switching provider"""
    response = requests.post(
        f"{API_URL}/settings/provider",
        json={"provider": provider}
    )
    print_response(f"Switch to {provider.upper()}", response)
    return response.status_code == 200

def main():
    """Run all tests"""
    print("🧪 MindMate API Test Suite")
    print("=" * 50)
    
    # Test data
    test_entries = {
        "happy": "Today was absolutely amazing! I got a promotion at work and celebrated with my friends. I feel so happy and grateful for all the wonderful things happening in my life.",
        "sad": "I feel really down today. Everything seems overwhelming and I dont know how to cope with all the stress. I miss my family and feel lonely.",
        "anxious": "I am so worried about my upcoming exam. I have been studying for weeks but I feel like I am not prepared. What if I fail?",
        "angry": "I am absolutely furious! My colleague took credit for my work again and my boss did not even listen to me. This is so unfair!",
        "neutral": "Today was a regular day. Nothing special happened, just went to work and came home. I feel okay, not particularly happy or sad."
    }
    
    try:
        # 1. Health Check
        if not test_health_check():
            print("❌ Backend is not running!")
            return
        
        # 2. Create journal entries
        entry_ids = []
        for emotion_type, content in test_entries.items():
            entry_id = test_create_journal_entry(content, emotion_type)
            if entry_id:
                entry_ids.append(entry_id)
        
        # 3. Get history
        test_get_history()
        
        # 4. Get specific entry
        if entry_ids:
            test_get_entry(entry_ids[0])
        
        # 5. Analyze emotion
        test_analyze_emotion("I am feeling fantastic today! The sun is shining and I am excited!")
        
        # 6. Generate reflection
        test_generate_reflection(
            "I had the best day today! I finished my project early.",
            "joy"
        )
        
        # 7. Full analysis
        test_full_analysis("I am so grateful for my supportive friends and family.")
        
        # 8. Mood statistics
        test_mood_stats(7)
        
        # 9. Provider tests
        test_get_provider()
        test_switch_provider("openai")
        test_get_provider()
        test_switch_provider("gemini")
        test_get_provider()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend!")
        print("Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()

