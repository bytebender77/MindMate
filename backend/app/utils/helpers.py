from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re
import html


def format_date(date: datetime, format_string: str = "%B %d, %Y") -> str:
    """
    Format datetime object to string
    
    Args:
        date: datetime object
        format_string: strftime format string
        
    Returns:
        Formatted date string
    """
    return date.strftime(format_string)


def calculate_streak(entry_dates: List[datetime]) -> int:
    """
    Calculate current journaling streak
    
    Args:
        entry_dates: List of entry dates (sorted newest first)
        
    Returns:
        Current streak count in days
    """
    if not entry_dates:
        return 0
    
    # Sort dates in descending order
    sorted_dates = sorted(entry_dates, reverse=True)
    
    # Convert to dates only (ignore time)
    dates = [d.date() for d in sorted_dates]
    
    # Check if there's an entry today or yesterday
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    
    if dates[0] not in [today, yesterday]:
        return 0
    
    # Count consecutive days
    streak = 1
    current_date = dates[0]
    
    for date in dates[1:]:
        expected_date = current_date - timedelta(days=1)
        
        if date == expected_date:
            streak += 1
            current_date = date
        elif date < expected_date:
            # Gap found
            break
    
    return streak


def get_emotion_emoji(emotion: str) -> str:
    """
    Get emoji for emotion
    
    Args:
        emotion: Emotion name
        
    Returns:
        Corresponding emoji
    """
    emotion_map = {
        "joy": "😊",
        "happiness": "😊",
        "sadness": "😢",
        "sad": "😢",
        "anger": "😠",
        "angry": "😠",
        "fear": "😰",
        "scared": "😰",
        "surprise": "😲",
        "surprised": "😲",
        "neutral": "😐",
        "disgust": "🤢",
        "love": "❤️",
        "excited": "🤩",
        "anxious": "😰",
        "calm": "😌",
        "stressed": "😫"
    }
    
    return emotion_map.get(emotion.lower(), "😐")


def sanitize_text(text: str) -> str:
    """
    Sanitize user input text
    
    Args:
        text: Raw text input
        
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Escape HTML entities
    text = html.escape(text)
    
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Trim
    text = text.strip()
    
    return text


def calculate_sentiment_score(emotion_scores: Dict[str, float]) -> float:
    """
    Calculate overall sentiment score from emotion scores
    
    Args:
        emotion_scores: Dictionary of emotion scores
        
    Returns:
        Sentiment score between -1 (negative) and 1 (positive)
    """
    # Define emotion weights
    positive_emotions = ["joy", "happiness", "surprise", "love", "excited"]
    negative_emotions = ["sadness", "anger", "fear", "disgust", "anxious", "stressed"]
    
    positive_score = sum(
        emotion_scores.get(emotion, 0) 
        for emotion in positive_emotions
    )
    
    negative_score = sum(
        emotion_scores.get(emotion, 0)
        for emotion in negative_emotions
    )
    
    total = positive_score + negative_score
    
    if total == 0:
        return 0.0
    
    # Calculate score (-1 to 1)
    sentiment = (positive_score - negative_score) / total
    
    return round(sentiment, 3)


def truncate_text(text: str, max_length: int = 150, suffix: str = "...") -> str:
    """
    Truncate text to specified length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)].strip() + suffix


def parse_emotion_scores(emotion_scores_json: str) -> Dict[str, float]:
    """
    Parse emotion scores from JSON string
    
    Args:
        emotion_scores_json: JSON string of emotion scores
        
    Returns:
        Dictionary of emotion scores
    """
    import json
    
    try:
        return json.loads(emotion_scores_json)
    except (json.JSONDecodeError, TypeError):
        return {}


def get_time_of_day() -> str:
    """
    Get current time of day
    
    Returns:
        "morning", "afternoon", "evening", or "night"
    """
    hour = datetime.now().hour
    
    if 5 <= hour < 12:
        return "morning"
    elif 12 <= hour < 17:
        return "afternoon"
    elif 17 <= hour < 21:
        return "evening"
    else:
        return "night"


def get_greeting() -> str:
    """
    Get time-appropriate greeting
    
    Returns:
        Greeting message
    """
    time_of_day = get_time_of_day()
    
    greetings = {
        "morning": "Good morning",
        "afternoon": "Good afternoon",
        "evening": "Good evening",
        "night": "Good night"
    }
    
    return greetings.get(time_of_day, "Hello")


def validate_journal_content(content: str) -> tuple[bool, Optional[str]]:
    """
    Validate journal entry content
    
    Args:
        content: Journal entry text
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not content or not content.strip():
        return False, "Journal entry cannot be empty"
    
    if len(content) < 10:
        return False, "Journal entry must be at least 10 characters long"
    
    if len(content) > 5000:
        return False, "Journal entry cannot exceed 5000 characters"
    
    # Check for spam-like content (repeated characters)
    if re.search(r'(.)\1{20,}', content):
        return False, "Invalid content detected"
    
    return True, None