import React from 'react';
import { Smile, Frown, AlertCircle, Zap, Meh, XCircle, HelpCircle, Heart, ThumbsUp, TrendingUp } from 'lucide-react';

// Map GoEmotions to icons and colors
const emotionConfig = {
  // Positive emotions
  joy: {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    icon: Smile,
    label: 'Joy'
  },
  love: {
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
    icon: Heart,
    label: 'Love'
  },
  excitement: {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    icon: Zap,
    label: 'Excitement'
  },
  gratitude: {
    color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700',
    icon: Heart,
    label: 'Gratitude'
  },
  admiration: {
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    icon: ThumbsUp,
    label: 'Admiration'
  },
  optimism: {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    icon: TrendingUp,
    label: 'Optimism'
  },
  approval: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    icon: ThumbsUp,
    label: 'Approval'
  },
  amusement: {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    icon: Smile,
    label: 'Amusement'
  },
  caring: {
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
    icon: Heart,
    label: 'Caring'
  },
  pride: {
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    icon: TrendingUp,
    label: 'Pride'
  },
  relief: {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    icon: Smile,
    label: 'Relief'
  },

  // Negative emotions
  sadness: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    icon: Frown,
    label: 'Sadness'
  },
  anger: {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    icon: XCircle,
    label: 'Anger'
  },
  fear: {
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    icon: AlertCircle,
    label: 'Fear'
  },
  nervousness: {
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    icon: AlertCircle,
    label: 'Nervousness'
  },
  disappointment: {
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    icon: Frown,
    label: 'Disappointment'
  },
  annoyance: {
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    icon: XCircle,
    label: 'Annoyance'
  },
  disapproval: {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    icon: XCircle,
    label: 'Disapproval'
  },
  disgust: {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    icon: XCircle,
    label: 'Disgust'
  },
  embarrassment: {
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
    icon: Frown,
    label: 'Embarrassment'
  },
  grief: {
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    icon: Frown,
    label: 'Grief'
  },
  remorse: {
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    icon: Frown,
    label: 'Remorse'
  },

  // Neutral/Complex emotions
  confusion: {
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    icon: HelpCircle,
    label: 'Confusion'
  },
  surprise: {
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    icon: Zap,
    label: 'Surprise'
  },
  neutral: {
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    icon: Meh,
    label: 'Neutral'
  },
  curiosity: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    icon: HelpCircle,
    label: 'Curiosity'
  },
  desire: {
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
    icon: Heart,
    label: 'Desire'
  },
  realization: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    icon: Zap,
    label: 'Realization'
  },

  // Mixed state
  mixed: {
    color: 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    icon: HelpCircle,
    label: 'Mixed Feelings'
  }
};

const EmotionBadge = ({ emotion, emotionMetadata, showBreakdown = true, size = 'md' }) => {
  const isMixed = emotionMetadata?.is_mixed;
  const hasConfusion = emotionMetadata?.has_confusion;
  const emotionalState = emotionMetadata?.emotional_state;
  const significant = emotionMetadata?.significant_emotions || [];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  // Show confusion badge if detected (even if primary emotion isn't confusion)
  if (hasConfusion) {
    const config = emotionConfig.confusion;
    const Icon = config.icon;

    return (
      <div className="space-y-2">
        <div className={`inline-flex items-center rounded-full border-2 font-semibold ${config.color} ${sizeStyles[size]}`}>
          <Icon size={iconSizes[size]} />
          <span>Feeling Confused</span>
          {emotion && emotion.toLowerCase() !== 'confusion' && (
            <span className="ml-2 opacity-75">• {emotion}</span>
          )}
        </div>
        {showBreakdown && significant.length > 1 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Other emotions: {significant.slice(1, 3).map(e => e.label || e).join(', ')}
          </p>
        )}
      </div>
    );
  }

  // Show mixed emotions (only if we have multiple significant emotions)
  if (isMixed && significant && significant.length > 1) {
    return (
      <div className="space-y-2">
        <div className={`inline-flex items-center rounded-full border-2 font-semibold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700 ${sizeStyles[size]}`}>
          <HelpCircle size={iconSizes[size]} />
          <span>Mixed Feelings</span>
        </div>

        {showBreakdown && significant.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            {significant.slice(0, 3).map((emo, idx) => {
              const emoLabel = typeof emo === 'string' ? emo : (emo.label || emo);
              const emoConfidence = typeof emo === 'object' && emo.confidence ? emo.confidence : null;
              const config = emotionConfig[emoLabel?.toLowerCase()] || emotionConfig.neutral;
              const Icon = config.icon;

              return (
                <div key={idx} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.color} text-xs`}>
                  <Icon size={14} />
                  <span className="capitalize">{emoLabel}</span>
                  {emoConfidence && (
                    <span className="opacity-75">({Math.round(emoConfidence * 100)}%)</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Single emotion
  const config = emotionConfig[emotion?.toLowerCase()] || emotionConfig.neutral;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center rounded-full border-2 font-semibold ${config.color} ${sizeStyles[size]}`}>
      <Icon size={iconSizes[size]} />
      <span className="capitalize">{config.label || emotion}</span>
    </div>
  );
};

export default EmotionBadge;
