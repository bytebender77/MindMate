import { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Flame } from 'lucide-react';
import JournalInput from '../components/journal/JournalInput';
import ReflectionCard from '../components/journal/ReflectionCard';
import Card from '../components/common/Card';
import { useJournal } from '../hooks/useJournal';
import { getMostCommonEmotion, calculateStreak } from '../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

const DashboardPage = () => {
  const { entries, loading, createEntry, currentReflection, clearReflection } = useJournal();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (content, isVoice) => {
    setSubmitting(true);
    try {
      const result = await createEntry(content, isVoice);
      if (result.success) {
        toast.success('Journal entry saved successfully!');
      } else {
        toast.error('Failed to save entry. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  const mostCommon = getMostCommonEmotion(thisWeekEntries);
  const currentStreak = calculateStreak(entries);

  const quickStats = [
    {
      icon: BookOpen,
      label: 'This Week',
      value: thisWeekEntries.length,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Most Common',
      value: mostCommon?.emotion || 'N/A',
      color: 'from-green-500 to-green-600',
      capitalize: true
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
            Your Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Take a moment to reflect on your thoughts and feelings
          </p>
        </div>

        <JournalInput onSubmit={handleSubmit} isLoading={submitting} />

        {currentReflection && (
          <ReflectionCard
            reflection={currentReflection.reflection}
            emotion={currentReflection.emotion}
            suggestions={currentReflection.suggestions}
            emotionMetadata={currentReflection.emotion_metadata}
          />
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} hover className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold text-gray-800 dark:text-gray-100 ${stat.capitalize ? 'capitalize' : ''}`}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {entries.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Recent Entries</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="space-y-4">
                {entries.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`pb-4 ${index < 4 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      {entry.emotion && (
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 capitalize">
                          {entry.emotion}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
