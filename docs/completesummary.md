# MindMate — AI Mental Wellness Companion
## Complete Technical Documentation

---

## 1. High-Level Purpose

### Problem Statement

Mental wellness is a critical yet often neglected aspect of health. Many people struggle with:
- **Lack of self-awareness**: Difficulty identifying and understanding their emotional states
- **Isolation**: Hesitation to share feelings with others due to stigma
- **No structured reflection**: Missing tools to track emotional patterns over time
- **Limited access to support**: High cost and availability barriers to professional therapy

### Target Users

1. **Primary Users**: Individuals (18-65) seeking emotional self-awareness and mental wellness support
2. **Secondary Users**: People tracking mood patterns for therapy or personal growth
3. **Use Cases**: Daily journaling, emotion tracking, stress management, self-reflection

### Product Goals

- **Emotional Intelligence**: Help users identify and understand 27 distinct emotions using GoEmotions model
- **AI-Powered Insights**: Provide contextual, empathetic reflections based on emotional state
- **Privacy-First**: Local storage option with opt-in cloud sync
- **Accessibility**: Voice and text input, intuitive UI, dark mode support
- **Pattern Recognition**: Visualize emotional trends over time through charts and analytics

### Why AI is Appropriate

**Emotion Detection**: Traditional keyword-based approaches are limited. AI models like GoEmotions (RoBERTa-based) can understand:
- Context and nuance in language
- Mixed emotions and emotional complexity
- Subtle emotional indicators beyond explicit words
- 27 distinct emotion labels vs. basic positive/negative

**Reflection Generation**: LLMs (Gemini/OpenAI) provide:
- Contextual, empathetic responses tailored to emotional state
- Personalized suggestions based on detected emotions
- Non-judgmental support available 24/7
- Scalable solution that doesn't require human therapists for every interaction

**Value Added**: 
- **Accuracy**: 27-emotion classification vs. basic sentiment
- **Personalization**: Context-aware reflections vs. generic advice
- **Accessibility**: Always available, no appointment needed
- **Pattern Recognition**: Identifies trends humans might miss
- **Cost-Effective**: Free/low-cost alternative to therapy sessions

---

## 2. How the Models Work (End-to-End)

### Complete Data Flow

```
User Input (Text/Voice)
    ↓
[Speech-to-Text] (if voice)
    ↓
Raw Text
    ↓
[Emotion Analyzer V2] → GoEmotions Model (27 labels)
    ↓
Emotion Analysis Result:
  - Primary emotion
  - All emotion scores
  - Mixed emotion detection
  - Conflict detection
  - Confusion detection
  - Complexity score
  - Valence (positive/negative/neutral)
    ↓
[Reflection Generator V2] → LLM (Gemini/OpenAI)
    ↓
Reflection + Suggestions
    ↓
[Database] → SQLite Storage
    ↓
[Frontend] → Display to User
```

### Step-by-Step Breakdown

#### Step 1: User Input → Text

**Text Input**: Direct text entry (no processing needed)

**Voice Input**: 
1. User records audio via browser MediaRecorder API
2. Audio file sent to backend as multipart/form-data
3. Backend routes to Speech-to-Text service
4. Service selects best available backend:
   - **OpenAI Whisper API** (preferred, highest accuracy)
   - **Google Speech-to-Text** (via Gemini API)
   - **Local Whisper** (fallback, requires model download)

**Algorithm**: 
- **OpenAI Whisper**: Transformer-based ASR model
- **Google STT**: Google's speech recognition API
- **Local Whisper**: OpenAI's open-source Whisper model

**Why Chosen**: 
- OpenAI Whisper: Best accuracy, handles accents/noise well
- Google STT: Good fallback, integrated with Gemini
- Local Whisper: Privacy-preserving, no API calls

**Input Format**: 
```python
# Audio file (WAV, MP3, WebM, OGG)
audio_file: UploadFile
```

**Output Format**: 
```json
{
  "text": "I feel anxious about my presentation tomorrow",
  "success": true,
  "message": "Audio transcribed successfully"
}
```

#### Step 2: Text → Emotion Analysis

**Model**: `SamLowe/roberta-base-go_emotions`
- **Architecture**: RoBERTa-base (125M parameters)
- **Task**: Multi-label emotion classification
- **Labels**: 27 emotions (admiration, amusement, anger, etc.)

**Process**:
1. Text preprocessing (truncate to 512 tokens)
2. Pass through RoBERTa model
3. Get probability scores for all 27 emotions
4. Apply threshold (default: 0.10) to get significant emotions
5. Detect mixed emotions, conflicts, confusion
6. Calculate complexity and valence

**Algorithms Used**:
- **Emotion Classification**: RoBERTa transformer
- **Mixed Emotion Detection**: Check if 2+ emotions exceed threshold (0.20)
- **Conflict Detection**: Linguistic pattern matching + emotional contrast
- **Complexity Calculation**: Entropy-based emotional diversity
- **Valence Calculation**: Sum positive/negative/neutral emotion scores

**Why Chosen**:
- GoEmotions: State-of-the-art for fine-grained emotion detection
- RoBERTa: Better than BERT for classification tasks
- 27 labels: More nuanced than 6-emotion models
- Open-source: Can run locally, no API costs

**Input Format**:
```python
text: str  # Journal entry text
threshold: float = 0.10  # Minimum confidence
```

**Output Format**:
```json
{
  "emotion": "anxiety",
  "confidence": 0.85,
  "all_scores": {
    "anxiety": 0.85,
    "fear": 0.42,
    "nervousness": 0.38,
    ...
  },
  "significant_emotions": [
    {"label": "anxiety", "confidence": 0.85},
    {"label": "fear", "confidence": 0.42}
  ],
  "is_mixed": true,
  "mixed_type": "layered",
  "has_conflict": false,
  "has_confusion": false,
  "complexity": "moderate",
  "valence": {
    "positive": 0.15,
    "negative": 0.72,
    "neutral": 0.13,
    "overall": "negative"
  },
  "emotional_state": "mixed_negative",
  "model": "SamLowe/roberta-base-go_emotions"
}
```

#### Step 3: Emotion Analysis → Reflection

**Model**: Gemini 2.5 Flash or OpenAI GPT-4o-mini
- **Gemini 2.5 Flash**: Fast, cost-effective, good for testing
- **GPT-4o-mini**: More reliable, better for production

**Process**:
1. Build contextual prompt with:
   - Journal entry text
   - Primary emotion
   - Emotional state (mixed/conflicted/confused)
   - Significant emotions
   - Complexity and valence
2. Send prompt to LLM
3. Parse response into reflection and suggestions
4. Apply tone and focus based on emotional state

**Prompt Engineering**:
- **System Message**: Defines AI as "MindMate, a compassionate mental wellness companion"
- **Temperature**: 0.75 (balanced creativity and consistency)
- **Max Tokens**: 300 (keeps responses concise)
- **Instructions**: 
  - Acknowledge complexity
  - Validate emotions
  - Provide actionable tips
  - Maintain warm, non-judgmental tone

**Why Chosen**:
- **Gemini 2.5 Flash**: Free tier available, fast responses
- **GPT-4o-mini**: Lower cost than GPT-4, good quality
- **Prompt Engineering**: Ensures empathetic, helpful responses
- **Template Fallback**: Works even if API fails

**Input Format**:
```python
journal_text: str
emotion_data: dict  # From emotion analyzer
```

**Output Format**:
```json
{
  "reflection": "I hear that you're feeling anxious about your presentation. It's completely normal to feel this way before important events. Your anxiety shows that you care about doing well, which is actually a strength.",
  "suggestions": [
    "Practice the 5-4-3-2-1 grounding technique",
    "Focus on what you can control",
    "Take slow, deep breaths"
  ],
  "tone": "empathetic",
  "focus": "validation",
  "emotional_state": "mixed_negative"
}
```

#### Step 4: Storage → Database

**Database**: SQLite (local) or PostgreSQL (production)
- **Schema**: JournalEntry table with:
  - id, user_id, content
  - emotion, emotion_scores (JSON)
  - reflection, created_at, is_voice

**Process**:
1. Save journal entry with emotion and reflection
2. Store emotion_scores as JSON string
3. Index by user_id and created_at for fast queries
4. Return entry with parsed metadata

**Why SQLite**:
- **Local-first**: No external database needed
- **Simple**: File-based, easy to backup
- **Fast**: Good performance for single-user apps
- **Portable**: Database file can be moved/backed up

---

## 3. AI Models / APIs (Detailed)

### Emotion Detection Model

**Model**: `SamLowe/roberta-base-go_emotions`
- **Hugging Face**: https://huggingface.co/SamLowe/roberta-base-go_emotions
- **Base Model**: RoBERTa-base (125M parameters)
- **Training Data**: GoEmotions dataset (58k Reddit comments)
- **Labels**: 27 emotions
- **Accuracy**: ~90% F1-score on test set

**Input Format**:
- **Text**: String, max 512 tokens
- **Preprocessing**: Tokenization via RoBERTa tokenizer
- **Encoding**: BPE (Byte Pair Encoding)

**Output Format**:
- **Scores**: 27 probability scores (0.0-1.0)
- **Top Emotion**: Highest scoring emotion
- **Significant Emotions**: Emotions above threshold (default: 0.10)

**Inference Considerations**:
- **Latency**: ~100-200ms on CPU, ~50ms on GPU
- **Cost**: Free (local inference)
- **Memory**: ~500MB RAM
- **Fallback**: `j-hartmann/emotion-english-distilroberta-base` (6 emotions, faster)

**Local Deployment**:
```bash
# Model downloads automatically on first use
# No API key needed
# Works offline after initial download
```

### Speech-to-Text Models

#### Option 1: OpenAI Whisper API (Recommended)
- **Model**: `whisper-1`
- **Accuracy**: Very high (95%+)
- **Languages**: 99 languages
- **Cost**: $0.006 per minute
- **Latency**: ~2-5 seconds
- **Input**: Audio file (WAV, MP3, WebM, etc.)
- **Output**: Transcribed text

#### Option 2: Google Speech-to-Text
- **Model**: Via Gemini API
- **Accuracy**: High (90%+)
- **Cost**: Free tier available
- **Latency**: ~3-6 seconds
- **Input**: Audio file
- **Output**: Transcribed text

#### Option 3: Local Whisper (Fallback)
- **Model**: OpenAI Whisper (open-source)
- **Accuracy**: High (90%+)
- **Cost**: Free (no API calls)
- **Latency**: ~5-10 seconds (CPU), ~1-2 seconds (GPU)
- **Installation**: `pip install openai-whisper`
- **Model Size**: ~150MB (base model)

**Recommendation**: Use OpenAI Whisper API for production (best accuracy), local Whisper for privacy-sensitive deployments.

### Reflection Generation Models

#### Option 1: Gemini 2.5 Flash (Recommended for Testing)
- **Model**: `gemini-2.5-flash`
- **Provider**: Google AI
- **Cost**: Free tier available, then $0.075 per 1M input tokens
- **Latency**: ~1-2 seconds
- **Context Window**: 1M tokens
- **Strengths**: Fast, cost-effective, good for testing
- **Weaknesses**: Less reliable than GPT-4 for complex emotions

#### Option 2: OpenAI GPT-4o-mini (Recommended for Production)
- **Model**: `gpt-4o-mini`
- **Provider**: OpenAI
- **Cost**: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Latency**: ~2-3 seconds
- **Context Window**: 128K tokens
- **Strengths**: More reliable, better reasoning, production-ready
- **Weaknesses**: More expensive than Gemini

#### Option 3: GPT-3.5-turbo (Budget Option)
- **Model**: `gpt-3.5-turbo`
- **Cost**: $0.50 per 1M input tokens, $1.50 per 1M output tokens
- **Latency**: ~1-2 seconds
- **Strengths**: Cheaper than GPT-4o-mini
- **Weaknesses**: Less capable than GPT-4o-mini

**Recommendation**: Use Gemini 2.5 Flash for testing/development, GPT-4o-mini for production.

### Prompt Templates

#### Simple Emotional State (Clear Emotion)
```python
prompt = f"""You are MindMate, a compassionate mental wellness companion.

USER'S JOURNAL ENTRY:
"{journal_text}"

DETECTED EMOTION: {primary_emotion}

Provide:
1. A warm, empathetic 2-3 sentence reflection
2. Three actionable self-care tips

FORMAT:
REFLECTION: [your reflection]

TIPS:
- [tip 1]
- [tip 2]
- [tip 3]
"""
```

#### Complex Emotional State (Mixed/Conflicted)
```python
prompt = f"""You are MindMate, a compassionate mental wellness AI companion specializing in emotional complexity.

USER'S JOURNAL ENTRY:
"{journal_text}"

EMOTIONAL ANALYSIS:
- Detected emotions: {emotion_list}
- Emotional state: {emotional_state}
- Context: {context}
- Overall sentiment: {valence_overall}

INSTRUCTIONS:
The user is experiencing {emotional_state}. This requires special care.

Provide a response with:

1. **ACKNOWLEDGMENT** (2-3 sentences):
   - Acknowledge the COMPLEXITY of what they're feeling
   - Validate that their mixed/conflicted emotions are completely normal
   - Show understanding of the specific situation

2. **INSIGHT** (1-2 sentences):
   - Help them understand WHY they might be feeling this way
   - Normalize the experience
   - Provide gentle perspective

3. **ACTIONABLE TIPS** (3 specific suggestions):
   - Practical, doable self-care actions
   - Tailored to their specific emotional state
   - Mix of immediate relief and longer-term strategies

FORMAT:
REFLECTION: [Your acknowledgment and insight here]

TIPS:
- [Specific tip 1]
- [Specific tip 2]
- [Specific tip 3]

TONE: Warm, non-judgmental, emotionally intelligent, validating
"""
```

#### Prompt Engineering Choices

1. **System Message**: Defines AI role as "compassionate mental wellness companion"
2. **Temperature**: 0.75 (balanced creativity and consistency)
3. **Max Tokens**: 300 (keeps responses concise and focused)
4. **Instructions**: 
   - Acknowledge complexity
   - Validate emotions
   - Provide actionable tips
   - Maintain warm, non-judgmental tone
5. **Safety**: 
   - No medical advice
   - Encourage professional help for serious issues
   - Focus on self-care and validation

### Fallback Options

**Template-Based Fallback**: If LLM API fails, use pre-defined templates:
```python
TEMPLATES = {
    'confusion': {
        'acknowledge': "It's okay to feel confused right now.",
        'validate': "Confusion is often a sign that you're processing complex information or emotions.",
        'suggestions': [
            "Take time to sit with your thoughts without judgment",
            "Write down what you know vs. what you're unsure about",
            "Talk to someone you trust about what's on your mind"
        ]
    },
    # ... more templates
}
```

**Local LLM Option**: For complete privacy, use local LLM:
- **Ollama**: Run Llama 2/3 locally
- **LM Studio**: Local LLM interface
- **GPT4All**: Free, local LLM

---

## 4. Features (Complete List + Behavior)

### 4.1 Daily Text Journaling

**UI Behavior**:
- User types journal entry in text area (max 5000 characters)
- Real-time character counter
- Submit button (or Ctrl+Enter)
- Loading spinner during processing
- Success toast notification

**Backend Behavior**:
1. Receive journal entry text
2. Analyze emotion using GoEmotions model
3. Generate reflection using LLM
4. Save to database
5. Return entry with emotion and reflection

**API Call**:
```http
POST /journal/create
Content-Type: application/json

{
  "content": "I feel anxious about my presentation tomorrow",
  "is_voice": false
}
```

**Response**:
```json
{
  "id": 1,
  "content": "I feel anxious about my presentation tomorrow",
  "emotion": "anxiety",
  "emotion_metadata": {
    "emotion": "anxiety",
    "confidence": 0.85,
    "all_scores": {...},
    "significant_emotions": [...],
    "is_mixed": true,
    "mixed_type": "layered",
    "has_conflict": false,
    "has_confusion": false,
    "complexity": "moderate",
    "valence": {...},
    "emotional_state": "mixed_negative",
    "model": "SamLowe/roberta-base-go_emotions"
  },
  "reflection": "I hear that you're feeling anxious...",
  "reflection_metadata": {
    "suggestions": ["Practice grounding technique", ...],
    "tone": "empathetic",
    "focus": "validation"
  },
  "created_at": "2024-01-15T10:30:00",
  "is_voice": false
}
```

**Success Cases**:
- Entry saved successfully
- Emotion detected accurately
- Reflection generated
- User sees reflection card

**Failure Cases**:
- Text too short (< 10 characters) → Error message
- API timeout → Retry button
- Model loading error → Fallback to template
- Database error → Error toast

### 4.2 Voice Journaling

**UI Behavior**:
- Microphone button to start recording
- Recording indicator (pulsing animation)
- Stop button to finish recording
- Audio waveform visualization
- Transcription display
- Auto-submit after transcription

**Backend Behavior**:
1. Receive audio file (WAV, MP3, WebM)
2. Validate file type and size (< 10MB)
3. Transcribe using speech-to-text service
4. Process transcribed text as journal entry
5. Return entry with `is_voice: true`

**API Call**:
```http
POST /analysis/speech-to-text
Content-Type: multipart/form-data

audio: <binary file>
```

**Response**:
```json
{
  "text": "I feel anxious about my presentation tomorrow",
  "success": true,
  "message": "Audio transcribed successfully"
}
```

**Success Cases**:
- Audio transcribed accurately
- Text processed as journal entry
- Entry saved with voice flag

**Failure Cases**:
- Invalid file type → Error message
- File too large → Error message
- Transcription failed → Retry button
- No audio detected → Error message

### 4.3 Emotion Detection

**UI Behavior**:
- Emotion badge displayed next to entry
- Color-coded by emotion type
- Mixed emotions show breakdown
- Confusion detection shows special badge
- Confidence percentage displayed

**Backend Behavior**:
1. Analyze text using GoEmotions model
2. Detect primary emotion
3. Identify significant emotions (above threshold)
4. Detect mixed emotions, conflicts, confusion
5. Calculate complexity and valence
6. Return comprehensive analysis

**API Call**:
```http
POST /analysis/emotion-v2
Content-Type: application/json

{
  "text": "I feel anxious about my presentation tomorrow"
}
```

**Response**: See Step 2 output format above.

**Success Cases**:
- Emotion detected accurately
- Mixed emotions identified
- Confusion detected when present
- Conflict detected when present

**Failure Cases**:
- Text too short → Error message
- Model loading error → Fallback to basic model
- API timeout → Retry button

### 4.4 AI Reflection Generation

**UI Behavior**:
- Reflection card displayed after entry submission
- Reflection text in readable format
- Suggestions listed as bullet points
- Tone indicator (empathetic, supportive, etc.)
- Focus indicator (validation, clarity, etc.)

**Backend Behavior**:
1. Analyze emotion first
2. Build contextual prompt
3. Send to LLM (Gemini/OpenAI)
4. Parse response into reflection and suggestions
5. Apply tone and focus based on emotional state
6. Return structured reflection

**API Call**:
```http
POST /analysis/reflect-v2
Content-Type: application/json

{
  "text": "I feel anxious about my presentation tomorrow"
}
```

**Response**:
```json
{
  "emotion_analysis": {...},
  "reflection": {
    "reflection": "I hear that you're feeling anxious...",
    "suggestions": [
      "Practice the 5-4-3-2-1 grounding technique",
      "Focus on what you can control",
      "Take slow, deep breaths"
    ],
    "tone": "empathetic",
    "focus": "validation"
  },
  "success": true
}
```

**Success Cases**:
- Reflection generated accurately
- Suggestions are actionable
- Tone matches emotional state
- Focus is appropriate

**Failure Cases**:
- API timeout → Template fallback
- API error → Template fallback
- Invalid response → Template fallback
- Rate limit exceeded → Retry with backoff

### 4.5 Mood Charts & Analytics

**UI Behavior**:
- Line chart showing emotion trends over time
- Doughnut chart showing emotion distribution
- Calendar view showing daily emotions
- Emotion distribution bars
- Statistics (total entries, most common emotion, streak)

**Backend Behavior**:
1. Query journal entries from database
2. Group by date and emotion
3. Calculate emotion distribution
4. Generate weekly trend data
5. Calculate statistics (streak, most common, etc.)
6. Return structured data

**API Call**:
```http
GET /mood/stats?days=7
```

**Response**:
```json
{
  "total_entries": 15,
  "emotion_distribution": {
    "anxiety": 5,
    "joy": 4,
    "sadness": 3,
    "anger": 2,
    "fear": 1
  },
  "weekly_trend": [
    {
      "date": "2024-01-15",
      "emotion": "anxiety",
      "confidence": 0.85
    },
    ...
  ]
}
```

**Success Cases**:
- Charts render correctly
- Data is accurate
- Trends are visible
- Statistics are correct

**Failure Cases**:
- No entries → Empty state
- Database error → Error message
- Invalid date range → Error message

### 4.6 History Search & Filtering

**UI Behavior**:
- List of journal entries sorted by date
- Search bar to filter entries
- Filter by emotion
- Filter by date range
- Pagination for large datasets

**Backend Behavior**:
1. Query journal entries from database
2. Apply filters (emotion, date range, search term)
3. Sort by date (newest first)
4. Paginate results (limit: 10-50)
5. Return filtered entries

**API Call**:
```http
GET /journal/history?limit=50&emotion=anxiety
```

**Response**: Array of journal entries (see Journal Response format above).

**Success Cases**:
- Entries filtered correctly
- Search works accurately
- Pagination works
- Filters combine correctly

**Failure Cases**:
- No entries → Empty state
- Invalid filter → Error message
- Database error → Error message

### 4.7 Privacy Toggles

**UI Behavior**:
- Toggle switch for local-only mode
- Toggle switch for cloud sync
- Privacy policy link
- Data deletion option
- Export data option

**Backend Behavior**:
1. Store privacy preferences in database
2. Respect local-only mode (no cloud sync)
3. Encrypt sensitive data
4. Allow data deletion
5. Support data export

**API Call**:
```http
POST /settings/privacy
Content-Type: application/json

{
  "local_only": true,
  "cloud_sync": false
}
```

**Success Cases**:
- Privacy preferences saved
- Local-only mode works
- Data is encrypted
- Data deletion works

**Failure Cases**:
- Invalid preference → Error message
- Database error → Error message

### 4.8 Dark Mode

**UI Behavior**:
- Toggle switch in header
- Persistent preference (localStorage)
- Smooth transition
- All components support dark mode
- System preference detection

**Backend Behavior**:
- No backend changes needed (frontend-only feature)

**Success Cases**:
- Dark mode toggles correctly
- Preference persists
- All components support dark mode
- Smooth transition

**Failure Cases**:
- localStorage disabled → Falls back to light mode
- Invalid preference → Falls back to light mode

### 4.9 AI Provider Switching

**UI Behavior**:
- Toggle switch in settings
- Options: Gemini (testing) or OpenAI (production)
- Current provider displayed
- Success toast on switch

**Backend Behavior**:
1. Store provider preference in database
2. Update reflection generator service
3. Return current provider
4. Allow runtime switching

**API Call**:
```http
GET /settings/provider
POST /settings/provider
Content-Type: application/json

{
  "provider": "gemini"  # or "openai"
}
```

**Success Cases**:
- Provider switched correctly
- Reflection generator uses new provider
- Preference persists
- API calls work with new provider

**Failure Cases**:
- Invalid provider → Error message
- API key missing → Error message
- API error → Fallback to template

---

## 5. Tech Stack and Justifications

### Frontend

**Framework**: React 18.3.1
- **Why**: Component-based, large ecosystem, good performance
- **Alternatives**: Vue.js, Angular (React chosen for popularity and ecosystem)

**Build Tool**: Vite 5.4.2
- **Why**: Fast HMR, optimized builds, modern tooling
- **Alternatives**: Webpack, Create React App (Vite chosen for speed)

**Styling**: Tailwind CSS 3.4.1
- **Why**: Utility-first, fast development, small bundle size
- **Alternatives**: CSS Modules, Styled Components (Tailwind chosen for speed and consistency)

**Routing**: React Router DOM 7.9.5
- **Why**: Standard React routing solution, good documentation
- **Alternatives**: Next.js Router (React Router chosen for simplicity)

**Charts**: Chart.js 4.5.1 + React-Chartjs-2 5.3.1
- **Why**: Popular, well-documented, good performance
- **Alternatives**: Recharts, Victory (Chart.js chosen for popularity)

**Icons**: Lucide React 0.344.0
- **Why**: Modern, tree-shakeable, consistent design
- **Alternatives**: Font Awesome, Material Icons (Lucide chosen for modern design)

**HTTP Client**: Axios 1.13.2
- **Why**: Promise-based, interceptors, good error handling
- **Alternatives**: Fetch API (Axios chosen for better error handling)

**Notifications**: React Hot Toast 2.6.0
- **Why**: Lightweight, customizable, good UX
- **Alternatives**: React-Toastify (React Hot Toast chosen for simplicity)

**Date Handling**: date-fns 4.1.0
- **Why**: Lightweight, tree-shakeable, good API
- **Alternatives**: Moment.js (date-fns chosen for smaller bundle size)

### Backend

**Framework**: FastAPI 0.104.1
- **Why**: Fast, async support, automatic OpenAPI docs, type hints
- **Alternatives**: Flask, Django (FastAPI chosen for performance and modern features)

**ASGI Server**: Uvicorn 0.24.0
- **Why**: Fast, async support, production-ready
- **Alternatives**: Gunicorn (Uvicorn chosen for async support)

**Validation**: Pydantic 2.5.0
- **Why**: Type validation, automatic serialization, good performance
- **Alternatives**: Marshmallow (Pydantic chosen for type hints and performance)

**Database ORM**: SQLAlchemy 2.0.23
- **Why**: Mature, flexible, good documentation
- **Alternatives**: Tortoise ORM, Peewee (SQLAlchemy chosen for maturity)

**Database**: SQLite (local) / PostgreSQL (production)
- **Why**: SQLite for local development, PostgreSQL for production scalability
- **Alternatives**: MySQL, MongoDB (SQLite chosen for simplicity, PostgreSQL for production)

### AI/ML

**NLP Library**: Transformers 4.57.1
- **Why**: Hugging Face ecosystem, easy model loading, good documentation
- **Alternatives**: TensorFlow, PyTorch (Transformers chosen for ease of use)

**ML Framework**: PyTorch 2.2.0+
- **Why**: Required by Transformers, good GPU support
- **Alternatives**: TensorFlow (PyTorch chosen as it's the default for Transformers)

**Emotion Model**: SamLowe/roberta-base-go_emotions
- **Why**: State-of-the-art, 27 emotions, good accuracy
- **Alternatives**: j-hartmann/emotion-english-distilroberta-base (GoEmotions chosen for more emotions)

**LLM APIs**: 
- **Gemini 2.5 Flash**: Google AI (testing)
- **GPT-4o-mini**: OpenAI (production)
- **Why**: Gemini for free tier, GPT-4o-mini for reliability
- **Alternatives**: Claude, Llama 2 (Gemini/GPT chosen for availability and quality)

**Speech-to-Text**: 
- **OpenAI Whisper API**: Primary
- **Google Speech-to-Text**: Fallback
- **Local Whisper**: Privacy option
- **Why**: OpenAI for accuracy, Google for fallback, Local for privacy
- **Alternatives**: Azure Speech, AWS Transcribe (OpenAI chosen for accuracy)

### DevOps

**Environment Variables**: python-dotenv 1.0.0
- **Why**: Simple, standard approach
- **Alternatives**: Environment variables directly (python-dotenv chosen for convenience)

**File Handling**: aiofiles 23.2.1
- **Why**: Async file operations, good for FastAPI
- **Alternatives**: Standard library (aiofiles chosen for async support)

**HTTP Client**: httpx 0.25.2
- **Why**: Async HTTP client, good for FastAPI
- **Alternatives**: Requests (httpx chosen for async support)

### Security & Privacy

**Encryption**: 
- **At Rest**: SQLite encryption (optional)
- **In Transit**: HTTPS (required)
- **API Keys**: Environment variables, never committed

**Authentication**: 
- **Current**: Single-user (default_user)
- **Future**: JWT tokens, OAuth2

**Data Privacy**:
- **Local Storage**: SQLite database (local file)
- **Cloud Sync**: Opt-in, encrypted
- **Data Retention**: User-controlled
- **Data Deletion**: User can delete all data

### Recommended Versions

**Python**: 3.10+
- **Why**: Required for FastAPI, type hints, modern features
- **Alternatives**: Python 3.9 (3.10+ chosen for better type hints)

**Node.js**: 18+
- **Why**: Required for Vite, modern JavaScript features
- **Alternatives**: Node.js 16 (18+ chosen for better performance)

### Essential Packages

**Backend**:
```bash
pip install fastapi uvicorn pydantic pydantic-settings sqlalchemy transformers torch sentencepiece protobuf openai google-generativeai python-multipart httpx aiofiles scikit-learn numpy python-dotenv
```

**Frontend**:
```bash
npm install react react-dom react-router-dom axios chart.js react-chartjs-2 date-fns lucide-react react-hot-toast
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer eslint
```

### Security & Privacy Notes

1. **API Keys**: Never commit API keys to git, use `.env` files
2. **Encryption**: Use HTTPS in production, encrypt sensitive data
3. **Local Storage**: SQLite database is local, no cloud sync by default
4. **Data Retention**: User can delete all data at any time
5. **Privacy Policy**: Clear privacy policy, user consent for cloud sync
6. **Rate Limiting**: Implement rate limiting for API endpoints
7. **Input Validation**: Validate all user input, sanitize output
8. **CORS**: Configure CORS properly for production

---

## 6. Complete Project Structure

### Repository Structure

```
MindMate/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app, routes, middleware
│   │   ├── config.py               # Settings, environment variables
│   │   ├── database.py             # SQLAlchemy engine, session
│   │   ├── models.py               # Database models (JournalEntry)
│   │   ├── schemas.py              # Pydantic schemas (request/response)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── journal.py          # Journal entry endpoints
│   │   │   ├── analysis.py         # AI analysis endpoints
│   │   │   ├── mood.py             # Mood analytics endpoints
│   │   │   └── settings.py         # Settings endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── emotion_analyzer.py      # V1 emotion analyzer
│   │   │   ├── emotion_analyzer_v2.py   # V2 GoEmotions analyzer
│   │   │   ├── reflection_generator.py  # V1 reflection generator
│   │   │   ├── reflection_generator_v2.py # V2 reflection generator
│   │   │   └── speech_to_text.py        # Speech-to-text service
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── helpers.py          # Utility functions
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_emotion.py         # Emotion analyzer tests
│   │   ├── test_reflection.py      # Reflection generator tests
│   │   └── test_api.py             # API endpoint tests
│   ├── scripts/
│   │   └── test_emotions.py        # Test script for emotions
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Example environment variables
│   ├── Dockerfile                  # Docker configuration
│   └── README.md                   # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app component, routes
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global styles, Tailwind
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx      # Reusable button component
│   │   │   │   ├── Card.jsx        # Reusable card component
│   │   │   │   ├── Modal.jsx       # Modal dialog component
│   │   │   │   ├── EmotionBadge.jsx # Emotion display component
│   │   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   │   ├── EmptyState.jsx  # Empty state component
│   │   │   │   ├── DarkModeToggle.jsx # Dark mode toggle
│   │   │   │   └── ErrorBoundary.jsx # Error boundary
│   │   │   ├── journal/
│   │   │   │   ├── JournalInput.jsx # Journal input form
│   │   │   │   ├── JournalHistory.jsx # Journal history list
│   │   │   │   ├── ReflectionCard.jsx # AI reflection display
│   │   │   │   └── VoiceRecorder.jsx # Voice recording component
│   │   │   ├── mood/
│   │   │   │   ├── MoodChart.jsx   # Line chart component
│   │   │   │   ├── MoodCalendar.jsx # Calendar view
│   │   │   │   └── EmotionDistribution.jsx # Emotion bars
│   │   │   └── layout/
│   │   │       ├── Header.jsx      # App header
│   │   │       ├── Footer.jsx      # App footer
│   │   │       └── Layout.jsx      # Main layout wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── DashboardPage.jsx   # Main dashboard
│   │   │   ├── HistoryPage.jsx     # Journal history
│   │   │   ├── InsightsPage.jsx    # Mood analytics
│   │   │   └── SettingsPage.jsx    # Settings page
│   │   ├── hooks/
│   │   │   ├── useJournal.js       # Journal entries hook
│   │   │   └── useMood.js          # Mood stats hook
│   │   ├── services/
│   │   │   └── api.js              # API client (Axios)
│   │   ├── contexts/
│   │   │   └── DarkModeContext.jsx # Dark mode context
│   │   └── utils/
│   │       ├── constants.js        # App constants
│   │       └── helpers.js          # Utility functions
│   ├── public/
│   │   └── favicon.ico             # App favicon
│   ├── package.json                # Node.js dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── .env.example                # Example environment variables
│   └── README.md                   # Frontend documentation
│
├── .gitignore                      # Git ignore rules
├── README.md                       # Main project documentation
└── TECHNICAL_DOCUMENTATION.md      # This file
```

### Key Files Explained

#### Backend

**`backend/app/main.py`**:
- FastAPI application initialization
- CORS middleware configuration
- Router registration
- Startup event (model loading)
- Root and health endpoints

**`backend/app/config.py`**:
- Environment variable loading
- API key configuration
- Model selection (Gemini/OpenAI)
- Database URL configuration

**`backend/app/models.py`**:
- SQLAlchemy models (JournalEntry)
- Database schema definition

**`backend/app/schemas.py`**:
- Pydantic schemas for request/response validation
- JournalCreate, JournalResponse, JournalResponseV2
- EmotionAnalysis, EmotionAnalysisV2
- ReflectionRequest, ReflectionResponse

**`backend/app/routes/journal.py`**:
- POST `/journal/create` - Create journal entry
- GET `/journal/history` - Get journal history
- GET `/journal/{entry_id}` - Get specific entry

**`backend/app/routes/analysis.py`**:
- POST `/analysis/emotion-v2` - Analyze emotion
- POST `/analysis/reflect-v2` - Generate reflection
- POST `/analysis/full-analysis-v2` - Full analysis
- POST `/analysis/speech-to-text` - Transcribe audio

**`backend/app/services/emotion_analyzer_v2.py`**:
- GoEmotions model loading
- Emotion analysis logic
- Mixed emotion detection
- Conflict detection
- Complexity calculation
- Valence calculation

**`backend/app/services/reflection_generator_v2.py`**:
- LLM integration (Gemini/OpenAI)
- Prompt building
- Response parsing
- Template fallback

**`backend/app/services/speech_to_text.py`**:
- Speech-to-text service
- Multiple backend support (OpenAI/Google/Local)
- Audio file handling

#### Frontend

**`frontend/src/App.jsx`**:
- React Router configuration
- Route definitions
- Error boundary wrapping

**`frontend/src/main.jsx`**:
- React entry point
- Dark mode initialization
- App rendering

**`frontend/src/services/api.js`**:
- Axios client configuration
- API endpoint functions
- Error handling
- Request/response transformation

**`frontend/src/hooks/useJournal.js`**:
- Journal entries state management
- Create, read, update, delete operations
- Reflection state management

**`frontend/src/hooks/useMood.js`**:
- Mood statistics state management
- Data fetching and transformation
- Error handling

**`frontend/src/components/journal/JournalInput.jsx`**:
- Journal input form
- Character counter
- Submit handling
- Voice recorder integration

**`frontend/src/components/journal/ReflectionCard.jsx`**:
- AI reflection display
- Suggestions list
- Emotion badge integration

**`frontend/src/components/mood/MoodChart.jsx`**:
- Line chart for emotion trends
- Chart.js integration
- Dark mode support

### Configuration Files

#### `backend/requirements.txt`
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
sqlalchemy==2.0.23
transformers>=4.57.1
torch>=2.2.0
sentencepiece>=0.2.1
protobuf>=4.21.6,<5.0.0
openai==1.3.7
google-generativeai==0.3.1
python-multipart==0.0.6
httpx==0.25.2
aiofiles==23.2.1
scikit-learn>=1.7.2
numpy>=1.24.3
```

#### `frontend/package.json`
```json
{
  "name": "mindmate-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.9.5",
    "axios": "^1.13.2",
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.344.0",
    "react-hot-toast": "^2.6.0"
  },
  "devDependencies": {
    "vite": "^5.4.2",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1"
  }
}
```

#### `backend/.env.example`
```env
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Model Configuration
GEMINI_MODEL=gemini-2.5-flash
OPENAI_MODEL=gpt-4o-mini
WHISPER_MODEL=whisper-1

# Provider Selection
REFLECTION_PROVIDER=gemini

# Database
DATABASE_URL=sqlite:///./mindmate.db

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# App
APP_NAME=MindMate API
VERSION=2.0.0
```

#### `frontend/.env.example`
```env
VITE_API_URL=http://localhost:8000
```

#### `backend/Dockerfile`
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---
# MindMate — Implementation Guide
## Sections 7–10: Implementation, Privacy, Deployment, and Roadmap

---

## 7. Feature Breakdown to Implementation Tasks

### 7.1 Emotion Model Integration

#### Implementation Plan
1. **Load GoEmotions model** using Hugging Face Transformers
2. **Preprocess text** (truncate to 512 tokens, handle special characters)
3. **Run inference** to get emotion scores for all 27 labels
4. **Post-process results** (detect mixed emotions, conflicts, confusion)
5. **Calculate metadata** (valence, complexity, emotional state)

#### Key Code Snippet: Emotion Analyzer Service

```python
# backend/app/services/emotion_analyzer_v2.py
from transformers import pipeline
import numpy as np

class EmotionAnalyzerV2:
    def __init__(self):
        self.model_name = "SamLowe/roberta-base-go_emotions"
        self.classifier = pipeline(
            "text-classification",
            model=self.model_name,
            top_k=None,  # Return all 27 emotion scores
            device=-1  # CPU (use 0 for GPU)
        )
    
    def analyze(self, text: str, threshold: float = 0.10) -> dict:
        # Get predictions for all 27 emotions
        results = self.classifier(text[:512])[0]
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
        
        # Extract significant emotions (above threshold)
        significant = [
            {"label": r['label'], "confidence": round(r['score'], 4)}
            for r in sorted_results if r['score'] >= threshold
        ]
        
        # Detect mixed emotions and conflicts
        is_mixed, mixed_type = self._detect_mixed_emotions(text, significant)
        has_conflict = self._detect_conflict_patterns(text, significant)
        has_confusion = self._get_confusion_score(results) > 0.15
        
        # Calculate valence and complexity
        valence = self._calculate_valence(results)
        complexity = self._calculate_complexity(results, significant)
        
        return {
            "emotion": sorted_results[0]['label'],
            "confidence": sorted_results[0]['score'],
            "all_scores": {r['label']: r['score'] for r in results},
            "significant_emotions": significant[:5],
            "is_mixed": is_mixed,
            "mixed_type": mixed_type,
            "has_conflict": has_conflict,
            "has_confusion": has_confusion,
            "complexity": complexity,
            "valence": valence,
            "emotional_state": self._describe_emotional_state(
                is_mixed, has_conflict, has_confusion, valence
            ),
            "model": self.model_name
        }
```

#### Data Schema: Journal Entry

```python
# backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from datetime import datetime

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default_user")
    content = Column(Text, nullable=False)
    emotion = Column(String, nullable=True)  # Primary emotion label
    emotion_scores = Column(String, nullable=True)  # JSON: all metadata
    reflection = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_voice = Column(Boolean, default=False)
    
    # emotion_scores JSON structure:
    # {
    #   "all_scores": {"joy": 0.85, "excitement": 0.12, ...},
    #   "significant_emotions": [{"label": "joy", "confidence": 0.85}, ...],
    #   "is_mixed": false,
    #   "mixed_type": "single",
    #   "has_conflict": false,
    #   "has_confusion": false,
    #   "complexity": "simple",
    #   "valence": {"positive": 0.85, "negative": 0.10, "neutral": 0.05, "overall": "positive"},
    #   "emotional_state": "positive",
    #   "model": "SamLowe/roberta-base-go_emotions"
    # }
```

#### Minimal Test

```python
# backend/tests/test_emotion_analyzer.py
import pytest
from app.services.emotion_analyzer_v2 import emotion_analyzer_v2

def test_emotion_analysis():
    result = emotion_analyzer_v2.analyze("I'm feeling happy and excited today!")
    
    assert result["emotion"] in emotion_analyzer_v2.EMOTIONS
    assert 0 <= result["confidence"] <= 1
    assert "all_scores" in result
    assert len(result["all_scores"]) == 27  # All GoEmotions labels
    assert result["valence"]["overall"] in ["positive", "negative", "neutral"]
    assert "emotional_state" in result

def test_mixed_emotions():
    result = emotion_analyzer_v2.analyze(
        "I'm happy but also nervous about the future."
    )
    assert result["is_mixed"] == True
    assert result["has_conflict"] == True
```

---

### 7.2 LLM Reflection Generation

#### Implementation Plan
1. **Analyze emotion** using EmotionAnalyzerV2
2. **Build context-aware prompt** based on emotional state (confusion, conflict, mixed)
3. **Call LLM API** (Gemini or OpenAI) with structured prompt
4. **Parse response** to extract reflection and suggestions
5. **Apply safety filters** (content moderation, length limits)
6. **Fallback to templates** if API fails

#### Key Code Snippet: Reflection Generator Service

```python
# backend/app/services/reflection_generator_v2.py
import google.generativeai as genai
from openai import OpenAI

class ReflectionGeneratorV2:
    def __init__(self):
        settings = get_settings()
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            self.use_gemini = True
        elif settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.use_gemini = False
        else:
            self.model = None
            self.client = None
    
    def generate(self, journal_text: str, emotion_data: dict) -> dict:
        # Build context-aware prompt
        prompt = self._build_advanced_prompt(
            journal_text,
            emotion_data['emotion'],
            emotion_data['emotional_state'],
            emotion_data['is_mixed'],
            emotion_data['has_conflict'],
            emotion_data['has_confusion'],
            emotion_data['significant_emotions'],
            emotion_data['complexity'],
            emotion_data['valence']
        )
        
        try:
            if self.use_gemini:
                response = self.model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.75,  # Balanced creativity/consistency
                        "max_output_tokens": 300,  # Keep reflections concise
                        "top_p": 0.95,
                        "top_k": 40
                    },
                    safety_settings=[
                        {
                            "category": "HARM_CATEGORY_HARASSMENT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_HATE_SPEECH",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                )
                text = response.text
            else:
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are MindMate, an emotionally intelligent mental wellness AI. Provide warm, empathetic, and supportive reflections. Always prioritize user safety and well-being."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.75,
                    max_tokens=300,
                    presence_penalty=0.6,  # Encourage diversity
                    frequency_penalty=0.3
                )
                text = response.choices[0].message.content
            
            # Parse response into reflection and suggestions
            reflection, suggestions = self._parse_response(text)
            
            return {
                "reflection": reflection,
                "suggestions": suggestions[:3],  # Limit to 3 suggestions
                "tone": self._determine_tone(emotion_data['emotional_state']),
                "focus": self._determine_focus(
                    emotion_data['emotional_state'],
                    emotion_data['has_confusion']
                )
            }
        except Exception as e:
            logger.error(f"Error generating reflection: {e}")
            # Fallback to template-based response
            return self._template_based_reflection(
                emotion_data['emotional_state'],
                emotion_data['emotion'],
                emotion_data['significant_emotions']
            )
    
    def _build_advanced_prompt(
        self, text: str, primary: str, emotional_state: str,
        is_mixed: bool, has_conflict: bool, has_confusion: bool,
        significant: list, complexity: str, valence: dict
    ) -> str:
        """Build context-aware prompt based on emotional complexity"""
        
        if has_confusion or has_conflict or is_mixed:
            # Complex emotional state requires special handling
            return f"""You are MindMate, a compassionate mental wellness AI companion.

USER'S JOURNAL ENTRY:
"{text}"

EMOTIONAL ANALYSIS:
- Primary emotion: {primary}
- Emotional state: {emotional_state}
- Complexity: {complexity}
- Valence: {valence.get('overall', 'neutral')}
- Context: {"CONFUSION DETECTED" if has_confusion else ""} {"EMOTIONAL CONFLICT DETECTED" if has_conflict else ""} {"MIXED EMOTIONS" if is_mixed else ""}

INSTRUCTIONS:
The user is experiencing {emotional_state.replace('_', ' ')}. Provide:

1. **ACKNOWLEDGMENT** (2-3 sentences):
   - Validate their emotional experience
   - Normalize mixed/conflicted feelings
   - Show understanding

2. **INSIGHT** (1-2 sentences):
   - Help them understand WHY they might feel this way
   - Provide gentle perspective

3. **ACTIONABLE TIPS** (3 specific suggestions):
   - Practical self-care actions
   - Tailored to their emotional state

FORMAT:
REFLECTION: [Your acknowledgment and insight here]

TIPS:
- [Specific tip 1]
- [Specific tip 2]
- [Specific tip 3]

TONE: Warm, non-judgmental, emotionally intelligent, validating
SAFETY: If user mentions self-harm, encourage professional help immediately."""
        else:
            # Simpler prompt for clear emotional states
            return f"""You are MindMate, a compassionate mental wellness companion.

USER'S JOURNAL ENTRY:
"{text}"

DETECTED EMOTION: {primary}

Provide a warm, empathetic 2-3 sentence reflection and three actionable self-care tips.

FORMAT:
REFLECTION: [your reflection]

TIPS:
- [tip 1]
- [tip 2]
- [tip 3]

TONE: Warm, supportive, validating"""
```

#### Minimal Test

```python
# backend/tests/test_reflection_generator.py
import pytest
from app.services.reflection_generator_v2 import reflection_generator_v2
from app.services.emotion_analyzer_v2 import emotion_analyzer_v2

def test_reflection_generation():
    # Analyze emotion first
    emotion_result = emotion_analyzer_v2.analyze("I'm feeling anxious about my presentation tomorrow.")
    
    # Generate reflection
    reflection_result = reflection_generator_v2.generate(
        "I'm feeling anxious about my presentation tomorrow.",
        emotion_result
    )
    
    assert "reflection" in reflection_result
    assert len(reflection_result["reflection"]) > 50  # Minimum length
    assert "suggestions" in reflection_result
    assert len(reflection_result["suggestions"]) <= 3
    assert reflection_result["tone"] in ["supportive", "empathetic", "validating", "encouraging"]
    assert "focus" in reflection_result

def test_fallback_template():
    # Test template-based fallback when API is unavailable
    emotion_result = {
        "emotion": "anxiety",
        "emotional_state": "anxious",
        "significant_emotions": [{"label": "nervousness", "confidence": 0.8}]
    }
    result = reflection_generator_v2._template_based_reflection(
        "anxious", "anxiety", emotion_result["significant_emotions"]
    )
    assert "reflection" in result
    assert "suggestions" in result
```

---

### 7.3 Voice Recording and Transcription

#### Implementation Plan
1. **Frontend**: Record audio using Web Audio API or MediaRecorder
2. **Convert to WAV/MP3** format
3. **Upload to backend** via multipart form data
4. **Backend**: Transcribe using OpenAI Whisper API or Google Speech-to-Text
5. **Return transcribed text** to frontend
6. **Auto-submit** as journal entry (optional)

#### Key Code Snippet: Frontend Voice Recorder

```javascript
// frontend/src/components/journal/VoiceRecorder.jsx
import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play } from 'lucide-react';
import { analysisAPI } from '../../services/api';

const VoiceRecorder = ({ onTranscript, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        await transcribeAudio(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to File
      const audioFile = new File([blob], 'recording.webm', { type: 'audio/webm' });
      
      // Call API
      const result = await analysisAPI.speechToText(audioFile);
      
      if (result.success) {
        onTranscript(result.text);
        if (onComplete) {
          onComplete(result.text);
        }
      } else {
        throw new Error(result.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Mic size={20} />
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <Square size={20} />
          Stop Recording
        </button>
      )}
      
      {isProcessing && (
        <span className="text-gray-600">Processing audio...</span>
      )}
    </div>
  );
};

export default VoiceRecorder;
```

#### Key Code Snippet: Backend Speech-to-Text Endpoint

```python
# backend/app/routes/analysis.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.speech_to_text import speech_to_text_service

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.post("/speech-to-text")
async def convert_speech_to_text(audio: UploadFile = File(...)):
    """Convert speech audio to text"""
    
    # Validate file type
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm", "audio/ogg"]
    if audio.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # Check file size (max 10MB)
    file_content = await audio.read()
    if len(file_content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 10MB limit"
        )
    
    try:
        await audio.seek(0)  # Reset file pointer
        text = await speech_to_text_service.transcribe(audio)
        
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not transcribe audio"
            )
        
        return {
            "text": text,
            "success": True,
            "message": "Audio transcribed successfully"
        }
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to transcribe audio"
        )
```

#### Minimal Test

```python
# backend/tests/test_speech_to_text.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_speech_to_text_endpoint():
    # Create a dummy audio file
    audio_content = b"fake audio content"
    files = {"audio": ("test.wav", audio_content, "audio/wav")}
    
    response = client.post("/analysis/speech-to-text", files=files)
    
    # Note: This will fail if no STT backend is configured
    # In production, mock the STT service
    assert response.status_code in [200, 500]  # 500 if no backend configured
    if response.status_code == 200:
        assert "text" in response.json()
        assert response.json()["success"] == True
```

---

### 7.4 Mood Charts and Analytics

#### Implementation Plan
1. **Query database** for journal entries within date range
2. **Aggregate emotions** by date, calculate statistics
3. **Generate weekly trends** (emotion distribution over time)
4. **Calculate streaks** (consecutive days with entries)
5. **Frontend**: Render charts using Chart.js
6. **Display insights** (most common emotion, positive ratio, etc.)

#### Key Code Snippet: Backend Mood Stats Endpoint

```python
# backend/app/routes/mood.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JournalEntry
from ..schemas import MoodStatsResponse, MoodTrendItem
from datetime import datetime, timedelta
import json
from collections import Counter

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.get("/stats", response_model=MoodStatsResponse)
async def get_mood_stats(
    days: int = Query(7, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get mood statistics for the last N days"""
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Query entries
    entries = db.query(JournalEntry)\
        .filter(JournalEntry.created_at >= start_date)\
        .filter(JournalEntry.created_at <= end_date)\
        .order_by(JournalEntry.created_at.desc())\
        .all()
    
    # Aggregate emotions
    emotion_distribution = Counter()
    weekly_trend = []
    
    for entry in entries:
        # Parse emotion_scores if available
        if entry.emotion:
            emotion_distribution[entry.emotion] += 1
        
        # Build weekly trend
        if entry.emotion_scores:
            try:
                scores = json.loads(entry.emotion_scores)
                confidence = scores.get('all_scores', {}).get(entry.emotion, 0.0)
            except:
                confidence = 0.0
        else:
            confidence = 0.0
        
        weekly_trend.append(MoodTrendItem(
            date=entry.created_at.strftime("%Y-%m-%d"),
            emotion=entry.emotion,
            confidence=confidence
        ))
    
    return MoodStatsResponse(
        total_entries=len(entries),
        emotion_distribution=dict(emotion_distribution),
        weekly_trend=weekly_trend
    )
```

#### Key Code Snippet: Frontend Mood Chart Component

```javascript
// frontend/src/components/mood/MoodChart.jsx
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoodChart = ({ weeklyTrend, isDarkMode }) => {
  // Process data for chart
  const chartData = {
    labels: weeklyTrend.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Emotion Confidence',
        data: weeklyTrend.map(item => item.confidence || 0),
        borderColor: isDarkMode ? 'rgb(147, 197, 253)' : 'rgb(59, 130, 246)',
        backgroundColor: isDarkMode ? 'rgba(147, 197, 253, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
        bodyColor: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.5)'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.5)'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Mood Trend (Last 7 Days)
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MoodChart;
```

#### Minimal Test

```python
# backend/tests/test_mood_stats.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from app.models import JournalEntry
from datetime import datetime, timedelta

client = TestClient(app)

def test_mood_stats_endpoint():
    # Create test entries
    # ... (setup test data)
    
    response = client.get("/mood/stats?days=7")
    
    assert response.status_code == 200
    data = response.json()
    assert "total_entries" in data
    assert "emotion_distribution" in data
    assert "weekly_trend" in data
    assert isinstance(data["weekly_trend"], list)
```

---

### 7.5 Authentication and Opt-in Cloud Sync

#### Implementation Plan
1. **Local-first design**: Store data in browser localStorage by default
2. **Opt-in cloud sync**: User can enable cloud sync in settings
3. **Anonymous user IDs**: Generate UUID for each user (no email required)
4. **Encryption**: Encrypt sensitive data before sending to server
5. **Sync endpoint**: POST/PUT journal entries to cloud
6. **Conflict resolution**: Last-write-wins or merge strategy

#### Key Code Snippet: Frontend Local Storage Hook

```javascript
// frontend/src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Generate anonymous user ID
export const getUserId = () => {
  const userIdKey = 'mindmate_user_id';
  let userId = localStorage.getItem(userIdKey);
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(userIdKey, userId);
  }
  
  return userId;
};
```

#### Key Code Snippet: Cloud Sync Service

```javascript
// frontend/src/services/sync.js
import { journalAPI } from './api';
import { getUserId } from '../hooks/useLocalStorage';

export const syncService = {
  // Check if cloud sync is enabled
  isEnabled: () => {
    return localStorage.getItem('mindmate_cloud_sync') === 'true';
  },

  // Enable cloud sync
  enable: () => {
    localStorage.setItem('mindmate_cloud_sync', 'true');
    // Sync existing local entries to cloud
    syncService.syncLocalToCloud();
  },

  // Disable cloud sync
  disable: () => {
    localStorage.setItem('mindmate_cloud_sync', 'false');
  },

  // Sync local entries to cloud
  syncLocalToCloud: async () => {
    if (!syncService.isEnabled()) return;

    const localEntries = JSON.parse(localStorage.getItem('mindmate_entries') || '[]');
    const userId = getUserId();

    for (const entry of localEntries) {
      try {
        await journalAPI.create(entry.content, entry.is_voice);
        // Mark as synced
        entry.synced = true;
      } catch (error) {
        console.error('Error syncing entry:', error);
      }
    }

    // Update local storage
    localStorage.setItem('mindmate_entries', JSON.stringify(localEntries));
  },

  // Sync cloud entries to local
  syncCloudToLocal: async () => {
    if (!syncService.isEnabled()) return;

    try {
      const result = await journalAPI.getHistory(100);
      if (result.success) {
        localStorage.setItem('mindmate_cloud_entries', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Error syncing from cloud:', error);
    }
  }
};
```

#### Data Schema: User Settings

```python
# backend/app/models.py (additional table)
class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, unique=True)
    cloud_sync_enabled = Column(Boolean, default=False)
    privacy_mode = Column(String, default="local")  # "local" or "cloud"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## 8. Privacy, Safety, and Ethics

### 8.1 Privacy-by-Default Design

#### Local-First Architecture
- **Default**: All data stored in browser localStorage
- **No cloud sync by default**: User must explicitly enable
- **Anonymous users**: No email or personal information required
- **Client-side processing**: Emotion analysis can run locally (optional)

#### Implementation

```javascript
// frontend/src/services/privacy.js
export const privacyService = {
  // Check privacy mode
  getPrivacyMode: () => {
    return localStorage.getItem('mindmate_privacy_mode') || 'local';
  },

  // Set privacy mode
  setPrivacyMode: (mode) => {
    if (mode === 'local') {
      // Disable cloud sync
      localStorage.setItem('mindmate_cloud_sync', 'false');
      // Clear cloud data
      localStorage.removeItem('mindmate_cloud_entries');
    }
    localStorage.setItem('mindmate_privacy_mode', mode);
  },

  // Delete all local data
  deleteLocalData: () => {
    localStorage.removeItem('mindmate_entries');
    localStorage.removeItem('mindmate_cloud_entries');
    localStorage.removeItem('mindmate_user_id');
    localStorage.removeItem('mindmate_cloud_sync');
  },

  // Export data (for user portability)
  exportData: () => {
    const entries = JSON.parse(localStorage.getItem('mindmate_entries') || '[]');
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmate_export_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
```

### 8.2 Data Retention and Encryption

#### Data Retention Policy
- **Local storage**: Data persists until user deletes it
- **Cloud storage**: Optional 90-day retention (user configurable)
- **Automatic cleanup**: Delete entries older than retention period
- **User control**: Users can delete their data at any time

#### Encryption
- **In transit**: HTTPS/TLS for all API calls
- **At rest**: Optional encryption for cloud storage (AES-256)
- **Client-side encryption**: Encrypt sensitive data before sending to server

```python
# backend/app/utils/encryption.py
from cryptography.fernet import Fernet
import base64
import os

class EncryptionService:
    def __init__(self):
        # Generate key from environment variable or use default
        key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key().decode())
        self.cipher = Fernet(key.encode())
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.cipher.decrypt(encrypted_data.encode()).decode()
```

### 8.3 Anonymization

#### User Identification
- **Anonymous user IDs**: UUIDs, no PII
- **No tracking**: No analytics or tracking cookies
- **No sharing**: Data never shared with third parties

#### Data Minimization
- **Only necessary data**: Store only journal content, emotions, and timestamps
- **No location data**: Don't collect IP addresses or location
- **No device fingerprints**: Don't track device information

### 8.4 Safety and Content Moderation

#### LLM Safety Settings

```python
# backend/app/services/reflection_generator_v2.py
# Gemini safety settings
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

# OpenAI content filtering
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    temperature=0.75,
    max_tokens=300,
    # OpenAI automatically applies content filtering
)
```

#### Self-Harm Detection

```python
# backend/app/services/safety_filter.py
class SafetyFilter:
    SELF_HARM_KEYWORDS = [
        "suicide", "kill myself", "end my life", "hurt myself",
        "self harm", "cutting", "overdose", "hang myself"
    ]
    
    CRISIS_RESOURCES = {
        "US": "National Suicide Prevention Lifeline: 988",
        "UK": "Samaritans: 116 123",
        "CA": "Crisis Services Canada: 1-833-456-4566"
    }
    
    def detect_self_harm(self, text: str) -> bool:
        """Detect potential self-harm content"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.SELF_HARM_KEYWORDS)
    
    def get_crisis_response(self, country: str = "US") -> str:
        """Get crisis resources for user's country"""
        return self.CRISIS_RESOURCES.get(country, self.CRISIS_RESOURCES["US"])
```

#### Rate Limiting

```python
# backend/app/middleware/rate_limiter.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

# Apply rate limiting to endpoints
@app.post("/journal/create")
@limiter.limit("10/minute")  # 10 requests per minute
async def create_journal_entry(request: Request, ...):
    # ... endpoint logic
```

#### Human Escalation

```python
# backend/app/services/escalation.py
class EscalationService:
    def __init__(self):
        self.admin_email = os.getenv('ADMIN_EMAIL', 'admin@mindmate.com')
    
    async def escalate_crisis(self, user_id: str, entry_content: str):
        """Escalate potential crisis to human moderator"""
        # Log the incident
        logger.critical(f"CRISIS DETECTED: User {user_id}")
        
        # Send alert to admin (optional, requires email service)
        # await send_email(
        #     to=self.admin_email,
        #     subject="Crisis Detection Alert",
        #     body=f"User {user_id} may be in crisis. Content: {entry_content[:100]}..."
        # )
        
        # Return crisis resources to user
        return {
            "crisis_detected": True,
            "message": "We're here to help. Please reach out to a mental health professional.",
            "resources": SafetyFilter().get_crisis_response()
        }
```

### 8.5 Ethical Considerations

#### Transparency
- **Clear data usage**: Explain how data is used in privacy policy
- **User consent**: Explicit consent for cloud sync
- **Data access**: Users can export/delete their data

#### Bias and Fairness
- **Emotion model**: GoEmotions trained on diverse datasets
- **Cultural sensitivity**: Acknowledge limitations in emotion detection across cultures
- **Inclusive language**: Use inclusive, non-judgmental language in reflections

#### Professional Boundaries
- **Not a replacement**: Clear disclaimer that MindMate is not a substitute for professional therapy
- **Crisis handling**: Direct users to professional help when needed
- **Limitations**: Acknowledge AI limitations in mental health support

---

## 9. Deployment & Demo

### 9.1 Local Development Setup

#### Backend Setup

```bash
# 1. Create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cat > .env << EOF
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=sqlite:///./mindmate.db
DEBUG=True
HOST=0.0.0.0
PORT=8000
EOF

# 4. Run database migrations (auto-created on first run)
python -m app.main

# 5. Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF

# 3. Start development server
npm run dev
```

### 9.2 Deployment to Render (Backend)

#### Steps
1. **Create Render account**: Sign up at https://render.com
2. **Create new Web Service**: Connect your GitHub repository
3. **Configure build settings**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.12
4. **Set environment variables** in Render dashboard:
   ```
   OPENAI_API_KEY=your_key
   GEMINI_API_KEY=your_key
   DATABASE_URL=postgresql://user:pass@host/db (Render provides this)
   DEBUG=False
   ```
5. **Deploy**: Render automatically deploys on git push

#### Dockerfile (Alternative)

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9.3 Deployment to Netlify/Vercel (Frontend)

#### Netlify Deployment

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. **Deploy**: Connect GitHub repo, Netlify auto-deploys

#### Vercel Deployment

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel`
3. **Set environment variables** in Vercel dashboard
4. **Configure build**: Vercel auto-detects Vite projects

### 9.4 Environment Variables Checklist

#### Backend (.env)
```bash
# Required
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Optional
DATABASE_URL=sqlite:///./mindmate.db
DEBUG=True
HOST=0.0.0.0
PORT=8000
REFLECTION_PROVIDER=gemini  # or "openai"
WHISPER_MODEL=whisper-1
GEMINI_MODEL=gemini-2.5-flash
OPENAI_MODEL=gpt-4o-mini

# Security (optional)
ENCRYPTION_KEY=...
ADMIN_EMAIL=admin@mindmate.com
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000  # Local dev
# VITE_API_URL=https://your-backend.onrender.com  # Production
```

### 9.5 Pre-Demo Checklist

- [ ] **Backend deployed and accessible**
  - [ ] API health check: `curl https://your-backend.onrender.com/health`
  - [ ] Swagger UI: `https://your-backend.onrender.com/docs`
- [ ] **Frontend deployed and accessible**
  - [ ] Frontend loads without errors
  - [ ] API connection works (check browser console)
- [ ] **Environment variables set**
  - [ ] API keys configured
  - [ ] CORS enabled for frontend domain
- [ ] **Database initialized**
  - [ ] Tables created
  - [ ] Can create journal entries
- [ ] **Features tested**
  - [ ] Text journaling works
  - [ ] Voice journaling works (if enabled)
  - [ ] Emotion detection works
  - [ ] Reflections generate
  - [ ] Charts display
  - [ ] Dark mode works
- [ ] **Performance tested**
  - [ ] API response times < 2s
  - [ ] Frontend loads < 3s
  - [ ] No console errors

### 9.6 3-Minute Demo Script

#### Introduction (30 seconds)
"Hello! I'm excited to show you MindMate, an AI-powered mental wellness companion. MindMate helps users track their emotions, journal their thoughts, and receive personalized AI reflections. Let me walk you through the key features."

#### Feature 1: Journal Entry Creation (45 seconds)
1. **Text Journaling**:
   - "First, let's create a journal entry. I'll type: 'I'm feeling anxious about my presentation tomorrow, but also excited to share my work.'"
   - Show the emotion detection: "Notice how MindMate detects mixed emotions - anxiety and excitement - with confidence scores."
   - Show the AI reflection: "The AI provides a supportive reflection tailored to my emotional state, along with actionable self-care tips."

2. **Voice Journaling** (if time permits):
   - "You can also journal using voice. Let me record a quick entry."
   - Show transcription and emotion analysis.

#### Feature 2: Mood Analytics (45 seconds)
1. **Insights Page**:
   - "Now let's look at the Insights page, which shows my mood trends over time."
   - Show the mood chart: "This line chart shows my emotional confidence over the last 7 days."
   - Show emotion distribution: "This shows the distribution of emotions in my journal entries."
   - Show mood calendar: "This calendar view lets me see my emotions day by day."

#### Feature 3: Advanced Features (30 seconds)
1. **Mixed Emotions**:
   - "MindMate uses GoEmotions, a state-of-the-art model with 27 emotion labels, so it can detect complex emotional states like confusion, conflict, and mixed feelings."

2. **Settings**:
   - "In settings, I can switch between Gemini and OpenAI for reflections, toggle dark mode, and manage my privacy settings."

#### Feature 4: Privacy & Safety (30 seconds)
1. **Privacy**:
   - "Privacy is built-in by default. All data is stored locally unless you opt into cloud sync."
   - "Users can export or delete their data at any time."

2. **Safety**:
   - "MindMate includes safety features like self-harm detection, content moderation, and crisis resource links."

#### Conclusion (30 seconds)
"MindMate combines cutting-edge AI with a user-friendly interface to provide personalized mental wellness support. It's built with privacy, safety, and ethical AI practices in mind. Thank you for watching! Questions?"

---

## 10. Optional: Enhancements & Future Roadmap

### 10.1 Short-Term Enhancements (1-3 months)

#### 1. Mood Prediction
- **Description**: Predict future mood based on historical patterns
- **Implementation**: Train ML model (LSTM/Transformer) on user's journal history
- **Value**: Proactive mental health support

```python
# backend/app/services/mood_predictor.py
from sklearn.ensemble import RandomForestRegressor
import numpy as np

class MoodPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100)
    
    def train(self, historical_data):
        # Extract features: day of week, time of day, previous emotions, etc.
        X = self._extract_features(historical_data)
        y = self._extract_targets(historical_data)
        self.model.fit(X, y)
    
    def predict(self, user_context):
        features = self._extract_features([user_context])
        prediction = self.model.predict(features)
        return prediction
```

#### 2. Journaling Prompts
- **Description**: AI-generated prompts to guide journaling
- **Implementation**: Use LLM to generate personalized prompts based on user's emotional state
- **Value**: Encourage consistent journaling

```python
# backend/app/services/prompt_generator.py
def generate_prompt(emotion_state, previous_entries):
    prompt = f"""Generate a thoughtful journaling prompt for someone who is feeling {emotion_state}.
    Previous entries suggest: {summarize_entries(previous_entries)}
    Create a prompt that encourages self-reflection and emotional awareness."""
    
    response = llm.generate(prompt)
    return response
```

#### 3. Emotion Trend Alerts
- **Description**: Alert users to concerning emotion trends
- **Implementation**: Monitor emotion patterns, send alerts for sustained negative trends
- **Value**: Early intervention for mental health issues

```python
# backend/app/services/alert_service.py
class AlertService:
    def check_trends(self, user_entries):
        # Analyze last 7 days
        recent_emotions = [e.emotion for e in user_entries[-7:]]
        negative_ratio = sum(1 for e in recent_emotions if e in NEGATIVE_EMOTIONS) / len(recent_emotions)
        
        if negative_ratio > 0.7:  # 70% negative emotions
            return {
                "alert": True,
                "message": "We noticed you've been experiencing more negative emotions recently. Consider reaching out to a mental health professional.",
                "resources": get_crisis_resources()
            }
        return {"alert": False}
```
