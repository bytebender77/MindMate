"""
Interactive testing script for emotion analysis
"""

from app.services.emotion_analyzer_v2 import emotion_analyzer_v2
from app.services.reflection_generator_v2 import reflection_generator_v2
import json


def print_analysis(text: str):
    """Print comprehensive analysis for a text"""
    print("\n" + "="*80)
    print(f"TEXT: {text}")
    print("="*80)
    
    # Analyze
    result = emotion_analyzer_v2.analyze(text)
    
    # Print results
    print(f"\n🎭 PRIMARY EMOTION: {result['emotion']} ({result['confidence']:.2%})")
    print(f"🌈 EMOTIONAL STATE: {result['emotional_state']}")
    print(f"📊 COMPLEXITY: {result['complexity']}")
    print(f"⚖️  VALENCE: {result['valence']['overall']}")
    print(f"🔀 MIXED: {'Yes' if result['is_mixed'] else 'No'} ({result['mixed_type']})")
    print(f"⚔️  CONFLICT: {'Yes' if result['has_conflict'] else 'No'}")
    print(f"❓ CONFUSION: {'Yes' if result['has_confusion'] else 'No'}")
    
    print(f"\n📈 TOP EMOTIONS:")
    for i, emo in enumerate(result['significant_emotions'][:5], 1):
        print(f"  {i}. {emo['label']}: {emo['confidence']:.2%}")
    
    # Generate reflection
    print(f"\n💬 GENERATING REFLECTION...")
    reflection = reflection_generator_v2.generate(text, result)
    
    print(f"\n💙 MINDMATE'S REFLECTION:")
    print(f"  {reflection['reflection']}")
    
    print(f"\n💡 SUGGESTIONS:")
    for i, tip in enumerate(reflection['suggestions'], 1):
        print(f"  {i}. {tip}")
    
    print(f"\n🎯 TONE: {reflection.get('tone', 'N/A')}")
    print(f"🎯 FOCUS: {reflection.get('focus', 'N/A')}")
    print("\n" + "="*80 + "\n")


def main():
    """Run test cases"""
    
    test_cases = [
        "I should be happy about this opportunity, but something inside me feels uneasy.",
        "I'm so confused about what to do next in my life.",
        "I love them but I'm also frustrated with their behavior.",
        "Today was absolutely amazing! Everything went perfectly!",
        "I feel terrible. Nothing is going right.",
        "I'm excited for the trip but also terrified of leaving.",
        "I don't know how to feel about this whole situation.",
        "Part of me wants to stay but another part wants to leave.",
    ]
    
    print("\n🧠 MINDMATE EMOTION ANALYZER V2 - TEST SUITE")
    print("Testing GoEmotions with 27 emotion labels\n")
    
    for text in test_cases:
        print_analysis(text)
    
    # Interactive mode
    print("\n🎮 INTERACTIVE MODE")
    print("Enter your own text (or 'quit' to exit):\n")
    
    while True:
        try:
            user_input = input("📝 Your journal entry: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if len(user_input) < 5:
                print("❌ Please enter at least 5 characters\n")
                continue
            
            print_analysis(user_input)
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}\n")


if __name__ == "__main__":
    main()