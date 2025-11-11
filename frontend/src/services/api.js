import axios from 'axios';

// API Base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Journal API (V2 - uses GoEmotions)
export const journalAPI = {
  /**
   * Create a new journal entry
   * @param {string} content - Journal entry content
   * @param {boolean} isVoice - Whether entry is from voice input
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  create: async (content, isVoice = false) => {
    try {
      const response = await api.post('/journal/create', {
        content,
        is_voice: isVoice,
      });

      return {
        success: true,
        data: {
          id: response.data.id,
          content: response.data.content,
          emotion: response.data.emotion,
          emotion_scores: response.data.emotion_metadata || response.data.emotion_scores,
          emotion_metadata: response.data.emotion_metadata,
          reflection: response.data.reflection,
          reflection_metadata: response.data.reflection_metadata,
          created_at: response.data.created_at,
          is_voice: response.data.is_voice || false,
          user_id: response.data.user_id,
        },
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to create journal entry',
      };
    }
  },

  /**
   * Get journal history
   * @param {number} limit - Maximum number of entries to retrieve
   * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
   */
  getHistory: async (limit = 50) => {
    try {
      const response = await api.get(`/journal/history?limit=${limit}`);

      const entries = response.data.map((entry) => {
        // Handle emotion_metadata - it might be an object or need parsing
        let emotionMetadata = entry.emotion_metadata;
        if (!emotionMetadata && entry.emotion_scores) {
          if (typeof entry.emotion_scores === 'string') {
            try {
              emotionMetadata = JSON.parse(entry.emotion_scores);
            } catch (e) {
              emotionMetadata = {};
            }
          } else {
            emotionMetadata = entry.emotion_scores;
          }
        }
        
        return {
          id: entry.id,
          content: entry.content,
          emotion: entry.emotion,
          emotion_scores: entry.emotion_scores,
          emotion_metadata: emotionMetadata,
          reflection: entry.reflection,
          reflection_metadata: entry.reflection_metadata,
          created_at: entry.created_at,
          is_voice: entry.is_voice || false,
          user_id: entry.user_id,
        };
      });

      return {
        success: true,
        data: entries,
      };
    } catch (error) {
      console.error('Error fetching journal history:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch journal history',
      };
    }
  },

  /**
   * Get a specific journal entry by ID
   * @param {number} id - Entry ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/journal/${id}`);

      // Handle emotion_metadata
      let emotionMetadata = response.data.emotion_metadata;
      if (!emotionMetadata && response.data.emotion_scores) {
        if (typeof response.data.emotion_scores === 'string') {
          try {
            emotionMetadata = JSON.parse(response.data.emotion_scores);
          } catch (e) {
            emotionMetadata = {};
          }
        } else {
          emotionMetadata = response.data.emotion_scores;
        }
      }

      return {
        success: true,
        data: {
          id: response.data.id,
          content: response.data.content,
          emotion: response.data.emotion,
          emotion_scores: response.data.emotion_scores,
          emotion_metadata: emotionMetadata,
          reflection: response.data.reflection,
          reflection_metadata: response.data.reflection_metadata,
          created_at: response.data.created_at,
          is_voice: response.data.is_voice || false,
          user_id: response.data.user_id,
        },
      };
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch journal entry',
      };
    }
  },

  /**
   * Update a journal entry (Note: Backend doesn't have update endpoint, but keeping for compatibility)
   * @param {number} id - Entry ID
   * @param {object} updates - Fields to update
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  update: async (id, updates) => {
    // Backend doesn't have update endpoint yet
    // For now, return the entry as-is
    try {
      const entry = await journalAPI.getById(id);
      if (entry.success) {
        return {
          success: true,
          data: { ...entry.data, ...updates },
        };
      }
      return entry;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update journal entry',
      };
    }
  },

  /**
   * Delete a journal entry (Note: Backend doesn't have delete endpoint, but keeping for compatibility)
   * @param {number} id - Entry ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  delete: async (id) => {
    // Backend doesn't have delete endpoint yet
    // For now, return success (frontend will handle removing from state)
    return {
      success: true,
    };
  },
};

// Mood API
export const moodAPI = {
  /**
   * Get mood statistics
   * @param {number} days - Number of days to analyze (default: 7)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  getStats: async (days = 7) => {
    try {
      const response = await api.get(`/mood/stats?days=${days}`);

      const stats = Object.entries(response.data.emotion_distribution || {}).map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / (response.data.total_entries || 1)) * 100),
      }));

      return {
        success: true,
        data: {
          entries: response.data.weekly_trend || [],
          stats,
          total_entries: response.data.total_entries,
          emotion_distribution: response.data.emotion_distribution,
          weekly_trend: response.data.weekly_trend,
        },
      };
    } catch (error) {
      console.error('Error fetching mood stats:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch mood stats',
      };
    }
  },
};

// Analysis API (V2 - uses GoEmotions)
export const analysisAPI = {
  /**
   * Analyze emotion from text (V2 - GoEmotions with 27 labels)
   * @param {string} text - Text to analyze
   * @returns {Promise<{success: boolean, emotion?: string, confidence?: number, all_scores?: object, error?: string}>}
   */
  analyzeEmotion: async (text) => {
    try {
      const response = await api.post('/analysis/emotion-v2', {
        text,
      });

      return {
        success: true,
        emotion: response.data.emotion,
        confidence: response.data.confidence,
        all_scores: response.data.all_scores,
        significant_emotions: response.data.significant_emotions,
        is_mixed: response.data.is_mixed,
        mixed_type: response.data.mixed_type,
        has_conflict: response.data.has_conflict,
        has_confusion: response.data.has_confusion,
        complexity: response.data.complexity,
        valence: response.data.valence,
        emotional_state: response.data.emotional_state,
        model: response.data.model,
      };
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to analyze emotion',
      };
    }
  },

  /**
   * Generate reflection (V2 - enhanced with emotional context)
   * @param {string} content - Journal content
   * @returns {Promise<{success: boolean, reflection?: string, suggestions?: string[], error?: string}>}
   */
  generateReflection: async (content) => {
    try {
      const response = await api.post('/analysis/reflect-v2', {
        text: content,
      });

      // Handle response structure - reflection can be nested in response.data.reflection
      const reflectionData = response.data.reflection || {};
      
      return {
        success: true,
        reflection: reflectionData.reflection || reflectionData.message || response.data.reflection,
        suggestions: reflectionData.suggestions || [],
        tone: reflectionData.tone,
        focus: reflectionData.focus,
        emotion_analysis: response.data.emotion_analysis,
      };
    } catch (error) {
      console.error('Error generating reflection:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to generate reflection',
      };
    }
  },

  /**
   * Perform full analysis (V2 - emotion + reflection with GoEmotions)
   * @param {string} text - Text to analyze
   * @returns {Promise<{success: boolean, emotion?: object, reflection?: object, error?: string}>}
   */
  fullAnalysis: async (text) => {
    try {
      const response = await api.post('/analysis/full-analysis-v2', {
        text,
      });

      return {
        success: true,
        emotion: response.data.emotion,
        reflection: response.data.reflection,
        model: response.data.model,
      };
    } catch (error) {
      console.error('Error performing full analysis:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to perform analysis',
      };
    }
  },

  /**
   * Convert speech to text
   * @param {File} audioFile - Audio file to transcribe
   * @returns {Promise<{success: boolean, text?: string, error?: string}>}
   */
  speechToText: async (audioFile) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await api.post('/analysis/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        text: response.data.text,
      };
    } catch (error) {
      console.error('Error converting speech to text:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to convert speech to text',
      };
    }
  },
};

// Legacy functions for backward compatibility
export const analyzeEmotion = async (content) => {
  const result = await analysisAPI.analyzeEmotion(content);
  if (result.success) {
    return result.emotion;
  }
  return 'neutral';
};

export const generateReflection = async (content, emotion = null) => {
  // V2 doesn't require emotion parameter - it analyzes automatically
  const result = await analysisAPI.generateReflection(content);
  if (result.success) {
    return result.reflection;
  }
  return 'Thank you for sharing. Remember, it\'s okay to feel what you\'re feeling.';
};

// Settings API
export const settingsAPI = {
  /**
   * Get current reflection provider
   * @returns {Promise<{success: boolean, current_provider?: string, available_providers?: string[], error?: string}>}
   */
  getProvider: async () => {
    try {
      const response = await api.get('/settings/provider');

      return {
        success: true,
        current_provider: response.data.current_provider,
        available_providers: response.data.available_providers,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error getting provider:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to get provider',
      };
    }
  },

  /**
   * Set reflection provider
   * @param {string} provider - Provider name ("gemini" or "openai")
   * @returns {Promise<{success: boolean, current_provider?: string, message?: string, error?: string}>}
   */
  setProvider: async (provider) => {
    try {
      const response = await api.post('/settings/provider', {
        provider,
      });

      return {
        success: true,
        current_provider: response.data.current_provider,
        available_providers: response.data.available_providers,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error setting provider:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to set provider',
      };
    }
  },
};

// Export default API instance
export default api;
