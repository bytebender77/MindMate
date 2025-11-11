import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMMM d, yyyy • h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatRelativeTime = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateEmotionStats = (entries) => {
  const emotionCounts = {};
  let total = 0;

  entries.forEach(entry => {
    if (entry.emotion) {
      const emotion = entry.emotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      total++;
    }
  });

  return Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));
};

export const getMostCommonEmotion = (entries) => {
  const stats = calculateEmotionStats(entries);
  if (stats.length === 0) return null;
  return stats.reduce((max, stat) => stat.count > max.count ? stat : max, stats[0]);
};

export const calculateStreak = (entries) => {
  try {
    if (!Array.isArray(entries) || entries.length === 0) return 0;

    // Get unique dates from entries, handling both created_at and date fields
    const dates = entries
      .map(e => {
        if (!e) return null;
        const dateStr = e.created_at || e.date;
        if (!dateStr) return null;
        try {
          return new Date(dateStr).toDateString();
        } catch (err) {
          console.error('Error parsing date:', err);
          return null;
        }
      })
      .filter(Boolean);

    if (dates.length === 0) return 0;

    // Get unique dates and sort descending
    const sortedDates = [...new Set(dates)].sort((a, b) => {
      try {
        return new Date(b) - new Date(a);
      } catch (err) {
        return 0;
      }
    });

    let streak = 0;
    const currentDate = new Date();
    const today = currentDate.toDateString();

    // Check if there's an entry today
    if (sortedDates[0] === today) {
      streak = 1;
      // Continue checking consecutive days
      for (let i = 1; i < sortedDates.length; i++) {
        try {
          const entryDate = new Date(sortedDates[i]);
          const expectedDate = new Date(currentDate);
          expectedDate.setDate(expectedDate.getDate() - streak);
          const expectedDateStr = expectedDate.toDateString();
          const entryDateStr = entryDate.toDateString();
          
          if (entryDateStr === expectedDateStr) {
            streak++;
          } else {
            break;
          }
        } catch (err) {
          console.error('Error calculating streak for date:', err);
          break;
        }
      }
    }

    return streak;
  } catch (err) {
    console.error('Error in calculateStreak:', err);
    return 0;
  }
};

export const getEmotionEmoji = (emotion) => {
  const emojiMap = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😰',
    surprise: '😲',
    neutral: '😐'
  };
  return emojiMap[emotion?.toLowerCase()] || '😐';
};

export const validateJournalEntry = (content) => {
  const errors = [];

  if (!content || content.trim().length === 0) {
    errors.push('Journal entry cannot be empty');
  }

  if (content.length > 5000) {
    errors.push('Journal entry is too long (maximum 5000 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
