import pytest
from app.services.emotion_analyzer_v2 import emotion_analyzer_v2
from app.services.reflection_generator_v2 import reflection_generator_v2


class TestGoEmotions:
    """Test GoEmotions integration"""
    
    def test_confusion_detection(self):
        """Test detecting confusion"""
        text = "I don't know how to feel about this situation"
        result = emotion_analyzer_v2.analyze(text)
        
        assert result is not None
        assert 'confusion' in result['all_scores']
        assert result['has_confusion'] or result['emotion'] == 'confusion'
    
    def test_mixed_emotions(self):
        """Test detecting mixed emotions"""
        text = "I should be happy about this promotion, but something feels off"
        result = emotion_analyzer_v2.analyze(text)
        
        assert result['is_mixed'] == True
        assert len(result['significant_emotions']) >= 2
    
    def test_emotional_conflict(self):
        """Test detecting emotional conflict"""
        text = "I love them but I'm also really angry at their behavior"
        result = emotion_analyzer_v2.analyze(text)
        
        assert result['has_conflict'] == True
        assert result['is_mixed'] == True
    
    def test_simple_emotion(self):
        """Test simple, clear emotion"""
        text = "I am so happy and excited today! Everything is wonderful!"
        result = emotion_analyzer_v2.analyze(text)
        
        assert result['emotion'] in ['joy', 'excitement', 'optimism']
        assert result['is_mixed'] == False
        assert result['complexity'] in ['simple', 'moderate']
    
    def test_valence_calculation(self):
        """Test valence calculation"""
        text = "This is terrible and I feel awful"
        result = emotion_analyzer_v2.analyze(text)
        
        assert result['valence']['overall'] == 'negative'
        assert result['valence']['negative'] > result['valence']['positive']
    
    def test_complexity_levels(self):
        """Test complexity calculation"""
        simple_text = "I am happy"
        complex_text = "I feel excited yet nervous, grateful but also worried about the future"
        
        simple_result = emotion_analyzer_v2.analyze(simple_text)
        complex_result = emotion_analyzer_v2.analyze(complex_text)
        
        assert simple_result['complexity'] == 'simple'
        assert complex_result['complexity'] in ['complex', 'very_complex']
    
    def test_reflection_for_confusion(self):
        """Test reflection generation for confusion"""
        text = "I'm so confused about what to do next"
        emotion_data = emotion_analyzer_v2.analyze(text)
        reflection = reflection_generator_v2.generate(text, emotion_data)
        
        assert reflection is not None
        assert len(reflection['suggestions']) >= 2
        assert 'confusion' in reflection['reflection'].lower() or \
               'confused' in reflection['reflection'].lower()
    
    def test_reflection_for_conflict(self):
        """Test reflection generation for conflicted emotions"""
        text = "Part of me wants to stay but part of me wants to leave"
        emotion_data = emotion_analyzer_v2.analyze(text)
        reflection = reflection_generator_v2.generate(text, emotion_data)
        
        assert reflection is not None
        assert reflection['tone'] in ['validating', 'empathetic', 'supportive']
    
    def test_27_emotions_available(self):
        """Test that all 27 GoEmotions are available"""
        from app.services.emotion_analyzer_v2 import EmotionAnalyzerV2
        
        assert len(EmotionAnalyzerV2.EMOTIONS) == 27
        assert 'confusion' in EmotionAnalyzerV2.EMOTIONS
        assert 'joy' in EmotionAnalyzerV2.EMOTIONS


class TestRealWorldScenarios:
    """Test with real-world journal entries"""
    
    @pytest.mark.parametrize("text,expected_state", [
        (
            "I should be happy about this opportunity, but something inside me feels uneasy.",
            "conflicted"
        ),
        (
            "I'm excited for the trip but also terrified of flying.",
            "mixed"
        ),
        (
            "Today was amazing! I accomplished everything I wanted.",
            "positive"
        ),
        (
            "I don't understand why I feel this way.",
            "confused"
        ),
    ])
    def test_real_scenarios(self, text, expected_state):
        """Test with realistic journal entries"""
        result = emotion_analyzer_v2.analyze(text)
        
        assert result is not None
        assert expected_state in result['emotional_state'] or \
               expected_state in result['mixed_type']


if __name__ == "__main__":
    pytest.main([__file__, "-v"])