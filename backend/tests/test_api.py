import pytest  # pyright: ignore[reportMissingImports]
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine
import json

# Create test client
client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    """Setup test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
        assert "MindMate" in response.json()["message"]
    
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestJournalEndpoints:
    """Test journal API endpoints"""
    
    def test_create_journal_entry(self, setup_database):
        """Test creating a new journal entry"""
        payload = {
            "content": "Today was a wonderful day. I felt happy and energized throughout.",
            "is_voice": False
        }
        
        response = client.post("/journal/create", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["content"] == payload["content"]
        assert "emotion" in data
        assert "reflection" in data
    
    def test_create_journal_entry_too_short(self):
        """Test validation for short entries"""
        payload = {
            "content": "Short",
            "is_voice": False
        }
        
        response = client.post("/journal/create", json=payload)
        assert response.status_code == 422  # Validation error
    
    def test_get_journal_history(self, setup_database):
        """Test retrieving journal history"""
        # First create an entry
        payload = {
            "content": "This is a test journal entry for history.",
            "is_voice": False
        }
        client.post("/journal/create", json=payload)
        
        # Then get history
        response = client.get("/journal/history?limit=10")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_get_journal_entry_by_id(self, setup_database):
        """Test retrieving specific journal entry"""
        # Create entry
        payload = {
            "content": "Test entry for retrieval by ID.",
            "is_voice": False
        }
        create_response = client.post("/journal/create", json=payload)
        entry_id = create_response.json()["id"]
        
        # Get by ID
        response = client.get(f"/journal/{entry_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == entry_id
    
    def test_get_nonexistent_entry(self):
        """Test retrieving non-existent entry"""
        response = client.get("/journal/99999")
        assert response.status_code == 404


class TestAnalysisEndpoints:
    """Test AI analysis endpoints"""
    
    def test_analyze_emotion(self):
        """Test emotion analysis endpoint"""
        response = client.post(
            "/analysis/emotion",
            params={"text": "I am feeling really happy and excited today!"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "emotion" in data
        assert "confidence" in data
        assert "all_scores" in data
        assert isinstance(data["all_scores"], dict)
    
    def test_analyze_emotion_too_short(self):
        """Test emotion analysis with short text"""
        response = client.post(
            "/analysis/emotion",
            params={"text": "Hi"}
        )
        
        assert response.status_code == 400
    
    def test_generate_reflection(self):
        """Test reflection generation endpoint"""
        payload = {
            "content": "I had a stressful day at work with many deadlines.",
            "emotion": "anxiety"
        }
        
        response = client.post("/analysis/reflect", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "reflection" in data
        assert "suggestions" in data
        assert isinstance(data["suggestions"], list)
    
    def test_full_analysis(self):
        """Test complete analysis endpoint"""
        response = client.post(
            "/analysis/analyze-full",
            params={"text": "Today was amazing! I accomplished all my goals and felt great."}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "emotion" in data
        assert "reflection" in data
        assert data["success"] is True


class TestMoodEndpoints:
    """Test mood analytics endpoints"""
    
    def test_get_mood_statistics(self, setup_database):
        """Test mood statistics endpoint"""
        # Create a few entries first
        entries = [
            "I feel happy today!",
            "Feeling a bit sad and lonely.",
            "Great day with lots of joy!"
        ]
        
        for content in entries:
            client.post("/journal/create", json={"content": content, "is_voice": False})
        
        # Get stats
        response = client.get("/mood/stats?days=7")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "total_entries" in data
        assert "emotion_distribution" in data
        assert "weekly_trend" in data
        assert isinstance(data["emotion_distribution"], dict)
        assert isinstance(data["weekly_trend"], list)
    
    def test_mood_stats_different_periods(self):
        """Test mood stats with different time periods"""
        periods = [7, 30]
        
        for days in periods:
            response = client.get(f"/mood/stats?days={days}")
            assert response.status_code == 200


class TestUtilityFunctions:
    """Test utility helper functions"""
    
    def test_emotion_emoji_mapping(self):
        """Test emotion to emoji mapping"""
        from app.utils.helpers import get_emotion_emoji
        
        assert get_emotion_emoji("joy") == "😊"
        assert get_emotion_emoji("sadness") == "😢"
        assert get_emotion_emoji("anger") == "😠"
        assert get_emotion_emoji("unknown") == "😐"
    
    def test_sanitize_text(self):
        """Test text sanitization"""
        from app.utils.helpers import sanitize_text
        
        dirty_text = "<script>alert('xss')</script>  Hello   World  "
        clean_text = sanitize_text(dirty_text)
        
        assert "<script>" not in clean_text
        assert "Hello World" in clean_text
    
    def test_validate_journal_content(self):
        """Test journal content validation"""
        from app.utils.helpers import validate_journal_content
        
        # Valid content
        is_valid, error = validate_journal_content("This is a valid journal entry.")
        assert is_valid is True
        assert error is None
        
        # Too short
        is_valid, error = validate_journal_content("Short")
        assert is_valid is False
        assert "10 characters" in error
        
        # Empty
        is_valid, error = validate_journal_content("")
        assert is_valid is False
        assert "empty" in error.lower()
    
    def test_calculate_streak(self):
        """Test streak calculation"""
        from app.utils.helpers import calculate_streak
        from datetime import datetime, timedelta
        
        # Current streak
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        two_days_ago = today - timedelta(days=2)
        
        dates = [today, yesterday, two_days_ago]
        streak = calculate_streak(dates)
        
        assert streak >= 2
        
        # No streak (gap)
        dates_with_gap = [today, today - timedelta(days=5)]
        streak = calculate_streak(dates_with_gap)
        
        assert streak == 1 or streak == 0


class TestErrorHandling:
    """Test error handling"""
    
    def test_invalid_json(self):
        """Test invalid JSON request"""
        response = client.post(
            "/journal/create",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
    
    def test_missing_required_fields(self):
        """Test missing required fields"""
        response = client.post("/journal/create", json={})
        assert response.status_code == 422
    
    def test_invalid_endpoint(self):
        """Test non-existent endpoint"""
        response = client.get("/nonexistent")
        assert response.status_code == 404


# Performance Tests
class TestPerformance:
    """Test API performance"""
    
    def test_journal_creation_speed(self, setup_database):
        """Test journal creation performance"""
        import time
        
        payload = {
            "content": "Performance test entry with sufficient content for validation.",
            "is_voice": False
        }
        
        start = time.time()
        response = client.post("/journal/create", json=payload)
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 5.0  # Should complete within 5 seconds
    
    def test_batch_queries(self, setup_database):
        """Test multiple queries performance"""
        import time
        
        start = time.time()
        for _ in range(10):
            client.get("/journal/history?limit=10")
        duration = time.time() - start
        
        assert duration < 2.0  # 10 queries should complete within 2 seconds


if __name__ == "__main__":
    pytest.main([__file__, "-v"])