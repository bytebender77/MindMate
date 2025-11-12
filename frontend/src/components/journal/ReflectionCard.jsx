import { Sparkles, Lightbulb } from 'lucide-react';
import EmotionBadge from '../common/EmotionBadge';

const ReflectionCard = ({ reflection, emotion, suggestions = [], emotionMetadata = null }) => {
  if (!reflection) return null;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-primary-100 dark:border-primary-800/30 animate-fadeIn transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">MindMate's Reflection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on your entry</p>
          </div>
        </div>
        {emotion && <EmotionBadge emotion={emotion} emotionMetadata={emotionMetadata} showBreakdown={true} />}
      </div>

      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 border border-primary-100 dark:border-gray-600 mb-4">
        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
          {reflection}
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={18} />
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Try this today:</h4>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-primary-500 dark:text-primary-400 font-bold">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReflectionCard;
