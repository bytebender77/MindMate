const EmotionDistribution = ({ stats = [] }) => {
  const emotionConfig = {
    joy: { 
      color: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700', 
      barColor: 'bg-green-500', 
      textColor: 'text-green-700 dark:text-green-400' 
    },
    sadness: { 
      color: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700', 
      barColor: 'bg-blue-500', 
      textColor: 'text-blue-700 dark:text-blue-400' 
    },
    anger: { 
      color: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700', 
      barColor: 'bg-red-500', 
      textColor: 'text-red-700 dark:text-red-400' 
    },
    fear: { 
      color: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700', 
      barColor: 'bg-purple-500', 
      textColor: 'text-purple-700 dark:text-purple-400' 
    },
    surprise: { 
      color: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-700', 
      barColor: 'bg-yellow-500', 
      textColor: 'text-yellow-700 dark:text-yellow-400' 
    },
    neutral: { 
      color: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600', 
      barColor: 'bg-gray-500', 
      textColor: 'text-gray-700 dark:text-gray-300' 
    }
  };

  // Validate and filter stats
  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No emotion data available</p>
      </div>
    );
  }

  // Filter out invalid entries and ensure required fields exist
  const validStats = stats.filter(stat => {
    return stat && typeof stat === 'object' && stat.emotion && typeof stat.percentage === 'number';
  });

  if (validStats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No valid emotion data available</p>
      </div>
    );
  }

  const sortedStats = [...validStats].sort((a, b) => {
    const aPercent = typeof a.percentage === 'number' ? a.percentage : 0;
    const bPercent = typeof b.percentage === 'number' ? b.percentage : 0;
    return bPercent - aPercent;
  });

  return (
    <div className="space-y-3">
      {sortedStats.map((stat, index) => {
        try {
          const emotion = stat.emotion ? stat.emotion.toLowerCase() : 'neutral';
          const config = emotionConfig[emotion] || emotionConfig.neutral;
          const percentage = typeof stat.percentage === 'number' ? Math.max(0, Math.min(100, stat.percentage)) : 0;

          return (
            <div
              key={stat.emotion || `stat-${index}`}
              className={`bg-gradient-to-r ${config.color} rounded-lg p-4 border`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium capitalize ${config.textColor}`}>
                  {stat.emotion || 'Unknown'}
                </span>
                <span className={`text-2xl font-bold ${config.textColor}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-2">
                <div
                  className={`${config.barColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              {stat.count && typeof stat.count === 'number' && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.count} {stat.count === 1 ? 'entry' : 'entries'}
                </p>
              )}
            </div>
          );
        } catch (err) {
          console.error('Error rendering emotion stat:', err, stat);
          return null;
        }
      })}
    </div>
  );
};

export default EmotionDistribution;
