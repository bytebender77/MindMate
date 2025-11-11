import { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import { calculateEmotionStats, getMostCommonEmotion, calculateStreak } from '../utils/helpers';

export const useMood = (days = 7) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true to show loading state
  const [error, setError] = useState(null);

  const fetchStats = async (timeRange = days) => {
    setLoading(true);
    setError(null);
    try {
      const result = await moodAPI.getStats(timeRange);
      if (result.success && result.data) {
        try {
          // Backend returns entries in weekly_trend format
          const weeklyTrend = Array.isArray(result.data.weekly_trend) ? result.data.weekly_trend : [];
          const entries = weeklyTrend.map(item => {
            if (!item || typeof item !== 'object') return null;
            return {
              emotion: item.emotion || null,
              created_at: item.date || null,
              date: item.date || null,
              confidence: typeof item.confidence === 'number' ? item.confidence : null,
            };
          }).filter(Boolean);

          // Get emotion distribution and convert to array format
          const totalEntries = typeof result.data.total_entries === 'number' ? result.data.total_entries : 0;
          const emotionDistribution = result.data.emotion_distribution && typeof result.data.emotion_distribution === 'object' 
            ? result.data.emotion_distribution 
            : {};
          
          // Convert emotion distribution dict to array with percentages
          const emotionStats = Object.entries(emotionDistribution)
            .filter(([emotion, count]) => emotion && typeof count === 'number' && count > 0)
            .map(([emotion, count]) => ({
              emotion: String(emotion),
              count: Number(count),
              percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count);

          // Calculate additional stats
          const mostCommon = emotionStats.length > 0 
            ? emotionStats[0]
            : null;

          let streak = 0;
          try {
            streak = calculateStreak(entries);
          } catch (err) {
            console.error('Error calculating streak:', err);
            streak = 0;
          }
          
          // Calculate positive ratio
          const positiveEmotions = ['joy', 'surprise', 'love', 'happiness', 'excited'];
          const positiveCount = Object.entries(emotionDistribution)
            .filter(([emotion]) => emotion && positiveEmotions.includes(String(emotion).toLowerCase()))
            .reduce((sum, [, count]) => {
              const numCount = typeof count === 'number' ? count : 0;
              return sum + numCount;
            }, 0);
          
          const positiveRatio = totalEntries > 0
            ? Math.round((positiveCount / totalEntries) * 100)
            : 0;

          setStats({
            totalEntries,
            emotionStats,
            emotionDistribution,
            mostCommonEmotion: mostCommon?.emotion || 'neutral',
            streak,
            positiveRatio,
            entries,
            weeklyTrend,
            timeRange
          });
        } catch (transformError) {
          console.error('Error transforming mood stats:', transformError);
          setError('Error processing mood data: ' + transformError.message);
        }
      } else {
        setError(result.error || 'Failed to fetch mood statistics');
      }
    } catch (err) {
      console.error('Error fetching mood stats:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};
