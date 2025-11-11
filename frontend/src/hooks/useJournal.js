import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import { REFLECTION_SUGGESTIONS } from '../utils/constants';

export const useJournal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentReflection, setCurrentReflection] = useState(null);

  const fetchEntries = async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const result = await journalAPI.getHistory(limit);
      if (result.success) {
        // Parse emotion data (handle both V1 and V2 formats)
        const parsedEntries = (result.data || []).map(entry => {
          // Handle V2 emotion_metadata
          if (entry.emotion_metadata) {
            entry.emotion_metadata = typeof entry.emotion_metadata === 'string'
              ? JSON.parse(entry.emotion_metadata)
              : entry.emotion_metadata;
          }
          
          // Fallback: parse emotion_scores if emotion_metadata doesn't exist (V1 format)
          if (!entry.emotion_metadata && entry.emotion_scores) {
            if (typeof entry.emotion_scores === 'string') {
              try {
                entry.emotion_metadata = JSON.parse(entry.emotion_scores);
              } catch (e) {
                console.warn('Failed to parse emotion_scores:', e);
                entry.emotion_metadata = {};
              }
            } else if (typeof entry.emotion_scores === 'object') {
              entry.emotion_metadata = entry.emotion_scores;
            }
          }

          // Handle reflection_metadata
          if (entry.reflection_metadata && typeof entry.reflection_metadata === 'string') {
            try {
              entry.reflection_metadata = JSON.parse(entry.reflection_metadata);
            } catch (e) {
              console.warn('Failed to parse reflection_metadata:', e);
            }
          }

          return entry;
        });
        setEntries(parsedEntries);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (content, isVoice = false) => {
    setLoading(true);
    setError(null);
    try {
      // Backend API automatically analyzes emotion and generates reflection (V2)
      const result = await journalAPI.create(content, isVoice);

      if (result.success) {
        const entry = result.data;
        
        // Handle V2 emotion_metadata structure
        let emotionMetadata = entry.emotion_metadata;
        if (!emotionMetadata && entry.emotion_scores) {
          // Fallback: parse emotion_scores if emotion_metadata doesn't exist
          if (typeof entry.emotion_scores === 'string') {
            try {
              emotionMetadata = JSON.parse(entry.emotion_scores);
            } catch (e) {
              console.warn('Failed to parse emotion_scores:', e);
              emotionMetadata = {};
            }
          } else if (typeof entry.emotion_scores === 'object') {
            emotionMetadata = entry.emotion_scores;
          }
        }

        // Handle V2 reflection_metadata structure
        const reflectionMetadata = entry.reflection_metadata || {};
        const suggestions = reflectionMetadata.suggestions || [];

        // Add entry to state
        setEntries(prev => [entry, ...prev]);

        // Set current reflection for display (V2 format)
        setCurrentReflection({
          emotion: entry.emotion,
          reflection: entry.reflection,
          suggestions: suggestions.length > 0 
            ? suggestions 
            : (REFLECTION_SUGGESTIONS[entry.emotion?.toLowerCase()] || REFLECTION_SUGGESTIONS.neutral).slice(0, 3),
          confidence: emotionMetadata?.confidence || emotionMetadata?.all_scores?.[entry.emotion] || 0,
          all_scores: emotionMetadata?.all_scores || {},
          emotion_metadata: emotionMetadata,
          reflection_metadata: reflectionMetadata,
          tone: reflectionMetadata.tone,
          focus: reflectionMetadata.focus,
        });

        return { success: true, data: entry };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    setError(null);
    try {
      const result = await journalAPI.delete(id);
      if (result.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateEntry = async (id, updates) => {
    setError(null);
    try {
      const result = await journalAPI.update(id, updates);
      if (result.success) {
        setEntries(prev => prev.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        ));
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    currentReflection,
    createEntry,
    deleteEntry,
    updateEntry,
    refreshEntries: fetchEntries,
    clearReflection: () => setCurrentReflection(null)
  };
};
